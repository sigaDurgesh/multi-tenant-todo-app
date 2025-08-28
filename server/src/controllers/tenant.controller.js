import TenantRequest from "../models/tenantRequest.model.js";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import UserRole from "../models/userRole.model.js";
import AuditLog from "../models/auditLog.model.js";
import Role from "../models/role.model.js";
import { sequelize } from "../models/index.js";
import generateSecurePassword from "../../middlewares/genarateSecurePassword.js";
import bcrypt from "bcrypt";

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
    const { user_id, tenant_name, email } = req.body;

    // Check for duplicates
    const existing = await TenantRequest.findOne({
      where: { user_id, status: "pending" },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    const existingTenant = await TenantRequest.findOne({
      where: { tenant_name, status: "pending" },
    });
    if (existingTenant) {
      return res
        .status(400)
        .json({ message: "This tenant name already has a pending request" });
    }

    // Create request
    const request = await TenantRequest.create({ user_id, tenant_name, email });

    await AuditLog.create({
      actor_user_id: user_id,
      action: "CREATE_TENANT_REQUEST",
      entity_type: "TenantRequest",
      entity_id: request.id,
      details: { tenant_name, email, status: request.status },
    });

    // Send email notification
    const mailOptions = {
      from: `"Tenant Request System" <${process.env.EMAIL_USER}>`,
      to: 'suryadurgesh18@gmail.com',
      subject: "New Tenant Request Submitted",
      html: generateEmailTemplate({
        title: "New Tenant Request",
        subTitle: "A new tenant request has been submitted.",
        body: `
          <p><b>Tenant Name:</b> ${tenant_name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>User ID:</b> ${user_id}</p>
          <p><b>Status:</b> ${request.status}</p>
          <p><b>Request ID:</b> ${request.id}</p>
        `,
        footer: "This is an automated message from Tenant Request System.",
      }),
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Tenant request submitted successfully (email sent)",
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
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

      const plainPassword = generateSecurePassword(12);
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      await User.update(
        { tenant_id: tenant.id, password_hash: passwordHash },
        { where: { id: request.user_id }, transaction: t }
      );

      // Replace roles
      await UserRole.destroy({
        where: { user_id: request.user_id },
        transaction: t,
      });

      await UserRole.create(
        { user_id: request.user_id, role_id: 2 },
        { transaction: t }
      );

      // Send approval email
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: request.email,
        subject: "Your Tenant Admin Account Approved",
        html: generateEmailTemplate({
          title: "Welcome to Multi-Tenant App 🎉",
          subTitle: "Your tenant request has been approved.",
          body: `
            <p><b>Tenant:</b> ${request.tenant_name}</p>
            <p><b>Email:</b> ${request.email}</p>
            <p><b>Password:</b> ${plainPassword}</p>
            <p>You can now login as <b>Tenant Admin</b>.</p>
            <p><strong><em>Make sure to change your password.</em></strong></p>
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
    const { tenantName, email, password } = req.body;

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

    // 4. Create user under tenant
    const user = await User.create({
      tenant_id: tenant.id,
      email,
      password_hash: hashedPassword,
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
      user: { id: user.id, email: user.email, tenant: tenant.name, role: "user" },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};