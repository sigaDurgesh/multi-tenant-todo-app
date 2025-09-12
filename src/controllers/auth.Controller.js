import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Tenant from "../models/tenant.model.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      name: name || email, // use email as default name
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { tenantName, email, password } = req.body;
    // find user with their roles
    const user = await User.findOne({
      where: { email, is_deleted: false },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["name"], // only return role name
        },
        {
          model: Tenant,
          attributes: ["id", "name"],
          required: false, // allow null for super_admin
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    let roles = (user.Roles || []).map((r) => r.name);

    // If user has no roles, assign 'user' role
    if (
      roles.length === 0 ||
      (!roles.includes("superAdmin") && !roles.includes("tenantAdmin"))
    ) {
      roles = ["user"];
    }

    if (roles.includes("superAdmin")) {
      if (tenantName) {
        return res
          .status(400)
          .json({ message: "Super Admin should not log in with a tenant" });
      }
    } else if (roles.includes("tenantAdmin") || roles.includes("user")) {
      if (!tenantName) {
        return res.status(400).json({ message: "Tenant name is required" });
      }

      const tenant = await Tenant.findOne({
  where: { name: tenantName },
});

if (!tenant) {
  return res.status(400).json({ message: "Tenant does not exist" });
}

if (tenant.is_deleted) {
  return res.status(403).json({ message: "This tenant has been deleted. Please contact support." });
}

if (!tenant.is_active) {
  return res.status(403).json({ message: "This tenant is currently inactive. Please contact your administrator." });
}

if (user.tenant_id !== tenant.id) {
  return res.status(403).json({ message: "You are not assigned to this tenant" });
}


      if (user.tenant_id !== tenant.id) {
        return res.status(403).json({ message: "Invalid tenant name." });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tenant_id: user.tenant_id, roles },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "User",
        tenant_id: user.tenant_id,
        tenant_name: user.Tenant ? user.Tenant.name : null,
        roles,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id; // comes from JWT middleware

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update DB
    await User.update(
      { password_hash: passwordHash },
      { where: { id: userId } }
    );

    // Send success email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "suryadurgesh18@gmail.com", // your email
        pass: "rrezrvaceqjrrjnd", // app password
      },
    });

    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Your Password Has Been Updated Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50; text-align: center;">🔒 Password Changed Successfully</h2>
            <p style="font-size: 16px; color: #333;">
              Hello <b>${user.name || user.email}</b>,
            </p>
            <p style="font-size: 16px; color: #333;">
              We wanted to let you know that your account password was updated successfully. 
              If this was you, no further action is required.
            </p>
            <div style="margin: 20px 0; text-align: center;">
              <a href="https://yourapp.com/login" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                Login to Your Account
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you did not make this change, please reset your password immediately or contact support.
            </p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Tenant System. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Failed to send password change email:", err.message);
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating password",
      error: error.message,
    });
  }
};
