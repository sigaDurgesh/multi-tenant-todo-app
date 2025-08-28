import TenantRequest from "../models/tenantRequest.model.js";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import UserRole from "../models/userRole.model.js";
import AuditLog from "../models/auditLog.model.js";
import Role from "../models/role.model.js";
import { sequelize } from "../models/index.js";
import generateSecurePassword from "../middlewares/genarateSecurePassword.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import transporter from "../config/nodemailer.js";
import { generateEmailTemplate } from "../utlis/emailTemplate.js";

// ------------------ LIST PENDING REQUESTS ------------------
export const listReviewedTenantRequests = async (req, res) => {
  try {
    const requests = await TenantRequest.findAll({
      attributes: [
        "id",
        "tenant_name",
        "user_id",
        "status",
        "requested_at",
        "reviewed_at",
        "reviewed_by",
      ],
      include: [
        { model: User, as: "requester", attributes: ["id", "email"] },
        { model: User, as: "reviewer", attributes: ["id", "email"] },
      ],
      order: [["reviewed_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Reviewed tenant requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching reviewed tenant requests",
      error: error.message,
    });
  }
};

// export const listAllTenantRequests = async (req, res) => {
//   try {
//     const requests = await TenantRequest.findAll({
//       attributes: [
//         "id",
//         "tenant_name",
//         "user_id",
//         "status",
//         "requested_at",
//         "reviewed_at",
//         "reviewed_by"
//       ],
//       include: [
//         { model: User, as: "requester", attributes: ["id", "email"] },
//         { model: User, as: "reviewer", attributes: ["id", "email"] },
//       ],
//       order: [["requested_at", "DESC"]],
//     });

//     return res.status(200).json({
//       message: "All tenant requests fetched successfully",
//       data: requests,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching tenant requests",
//       error: error.message,
//     });
//   }
// };


// ------------------ CREATE REQUEST ------------------

export const createTenantRequest = async (req, res) => {
  try {
    const { tenantName, email, password } = req.body;

    // 1. Check for duplicate tenant request
    const existingTenant = await TenantRequest.findOne({
      where: { tenant_name: tenantName, status: "pending" },
    });
    if (existingTenant) {
      return res.status(400).json({ message: "This tenant name already has a pending request" });
    }

    // 2. Create a new user (hash password before saving)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      // tenant_id will be assigned once tenant is approved
    });

    // 3. Create the tenant request (linking user_id)
    const request = await TenantRequest.create({
      user_id: user.id,
      tenant_name: tenantName,
      email,
      status: "pending"
    });

    // 4. Audit log
    await AuditLog.create({
      actor_user_id: user.id,
      action: "CREATE_TENANT_REQUEST",
      entity_type: "TenantRequest",
      entity_id: request.id,
      details: { tenant_name: tenantName, email, status: request.status },
    });

    return res.status(201).json({
      message: "Tenant request submitted successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating request", error: error.message });
  }
};

// ------------------ REVIEW REQUEST (Super Admin) ------------------
export const reviewTenantRequest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { requestId, action, reviewerId } = req.body;
    const request = await TenantRequest.findByPk(requestId, { transaction: t });
    if (!request) {
      await t.rollback();
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      await t.rollback();
      return res.status(400).json({ message: "Request already reviewed" });
    }
    // Update request
    request.status = action;
    request.reviewed_by = reviewerId;
    request.reviewed_at = new Date();
    await request.save({ transaction: t });
    if (action === "approved") {
      const tenant = await Tenant.create(
        { name: request.tenant_name },
        { transaction: t }
      );
      // Fetch user
      const user = await User.findByPk(request.user_id, { transaction: t });
      if (!user) {
        await t.rollback();
        return res.status(404).json({ message: "User not found" });
      }
      let plainPassword = null;
      let passwordHash = user.password_hash;
      // Only generate password if user doesn't already have one
      if (!user.password_hash) {
        plainPassword = generateSecurePassword(12);
        passwordHash = await bcrypt.hash(plainPassword, 10);
      }
      await user.update(
        { tenant_id: tenant.id, password_hash: passwordHash },
        { transaction: t }
      );
      // Replace roles
      await UserRole.destroy({
        where: { user_id: request.user_id },
        transaction: t,
      });
      await UserRole.create(
        { user_id: request.user_id, role_id: 2 }, // tenant admin role
        { transaction: t }
      );
      // Send approval email
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: request.email,
        subject: "Your Tenant Admin Account Approved",
        html: generateEmailTemplate({
          title: "Welcome to Multi-Tenant App :tada:",
          subTitle: "Your tenant request has been approved.",
          body: `
            <p><b>Tenant:</b> ${request.tenant_name}</p>
            <p><b>Email:</b> ${request.email}</p>
            ${
              plainPassword
                ? `<p><b>Password:</b> ${plainPassword}</p>
                   <p><strong><em>Make sure to change your password.</em></strong></p>`
                : `<p>You can log in using your existing password.</p>`
            }
          `,
          footer:
            "If you did not make this request, please contact support immediately.",
        }),
      };
      await transporter.sendMail(mailOptions);
      
      await AuditLog.create(
        {
          actor_user_id: reviewerId,
          action: "tenant_request_approved",
          entity_type: "TenantRequest",
          entity_id: request.id,
          details: {
            tenant_id: tenant.id,
            user_id: request.user_id,
            email: request.email,
          },
        },
        { transaction: t }
      );
    }

    if (action === "rejected") {
      await AuditLog.create(
        {
          actor_user_id: reviewerId,
          action: "tenant_request_rejected",
          entity_type: "TenantRequest",
          entity_id: request.id,
          details: { user_id: request.user_id, email: request.email },
        },
        { transaction: t }
      );

      // Send rejection email
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: request.email,
        subject: "Tenant Request Rejected",
        html: generateEmailTemplate({
          title: "Tenant Request Update",
          subTitle: "We regret to inform you that your request was rejected.",
          body: `
            <p><b>Tenant:</b> ${request.tenant_name}</p>
            <p><b>Email:</b> ${request.email}</p>
            <p>Status: <span style="color:red"><b>Rejected</b></span></p>
          `,
          footer: "For more details, please contact your system administrator.",
        }),
      };
      await transporter.sendMail(mailOptions);
    }
    await t.commit();
    return res
      .status(200)
      .json({ message: `Request ${action} successfully`, data: request });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Error reviewing request", error: error.message });
  }
};











// ------------------ GET REQUEST BY ID ------------------
export const getTenantRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await TenantRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Tenant request not found" });
    }

    return res.status(200).json({
      message: "Tenant request fetched successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching tenant request",
      error: error.message,
    });
  }
};

// ------------------ REGISTER USER UNDER TENANT ------------------
export const registerUserUnderTenant = async (req, res) => {
  try {
    const { tenantName, email, password, name } = req.body;

    // 1. Find tenant
    const tenant = await Tenant.findOne({ where: { name: tenantName, is_deleted: false } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found. Contact your tenant admin." });
    }

    // 2. Check if email already exists
    const existing = await User.findOne({ where: { email, is_deleted: false } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user under tenant (storing tenant_id explicitly)
    const user = await User.create({
      tenant_id: tenant.id,
      email,
      password_hash: hashedPassword,
      name,
      is_deleted: false,
    });

    // 5. Assign "user" role
    const role = await Role.findOne({ where: { name: "user" } });
    if (!role) {
      return res.status(400).json({ message: "Role 'user' not found in system" });
    }
    await UserRole.create({ user_id: user.id, role_id: role.id });

    // 6. Respond
    return res.status(201).json({
      message: "User registered successfully under tenant",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenant_id: tenant.id,
        tenant: tenant.name,
        role: "user",
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};


export const getUsersByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // 1. Validate tenant
    const tenant = await Tenant.findOne({
      where: { id: tenantId, is_deleted: false }
    });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // 2. Fetch users excluding tenantAdmin
    const users = await User.findAll({
      where: { tenant_id: tenant.id, is_deleted: false },
      attributes: ["id", "email"],
      include: [
        {
          model: Role,
          as: "Roles", // must match your association
          attributes: ["id", "name"],
          through: { attributes: [] },
          where: {
            name: { [Op.ne]: "tenantAdmin" } // 👈 exclude tenantAdmin
          },
          required: true // ensures users without Roles are excluded
        }
      ],
      order: [["id", "DESC"]]
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      tenant: { id: tenant.id, name: tenant.name },
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users for tenant",
      error: error.message
    });
  }
};


