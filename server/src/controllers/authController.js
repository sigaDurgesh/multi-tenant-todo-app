import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

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
    const { email, password } = req.body;

    // find user with their roles
    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        through: { attributes: [] },
        attributes: ["name"], // only return role name
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    let roles = user.Roles.map(r => r.name);

    // If user has no roles, assign 'user' role
    if (roles.length === 0) {
      const defaultRole = await Role.findOne({ where: { name: "user" } });
      if (defaultRole) {
        await user.addRole(defaultRole);
        roles = ["user"];
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
        roles,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
