import TenantRequest from "../models/tenantRequest.model.js";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import AuditLog from "../models/auditLog.model.js";
import { sequelize } from "../models/index.js";
import nodemailer from "nodemailer";

export const listReviewedTenantRequests = async (req, res) => {
  try {
    const requests = await TenantRequest.findAll({
      where: {
        status : "pending",
      },
      attributes: [
        "id",
        "tenant_name",
        "user_id",
        "status",
        "requested_at",
        "reviewed_at",
        "reviewed_by"
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

export const createTenantRequest = async (req, res) => {
  try {
    const { user_id, tenant_name , email } = req.body; // <-- get both values

    // Check if user already has a pending request
    const existing = await TenantRequest.findOne({
      where: { user_id, status: "pending" },
    });
    if (existing) {
      return res.status(400).json({ message: "You already have a pending request" });
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
    const request = await TenantRequest.create({ user_id, tenant_name , email });

    await AuditLog.create({
      actor_user_id: user_id, // who performed the action
      action: "CREATE_TENANT_REQUEST",
      entity_type: "TenantRequest",
      entity_id: request.id, // the new tenant request id
      details: {
        tenant_name,
        email,
        status: request.status,
      },
    });

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "suryadurgesh18@gmail.com",
    pass: "rrezrvaceqjrrjnd",
  },
});


    const mailOptions = {
      from: `"Tenant Request System" <${process.env.EMAIL_USER}>`,
      to: "suryadurgesh18@gmail.com",
      subject: "New Tenant Request Submitted",
      html: `
        <h2>New Tenant Request</h2>
        <p><b>Tenant Name:</b> ${tenant_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>User ID:</b> ${user_id}</p>
        <p><b>Status:</b> ${request.status}</p>
        <p><b>Request ID:</b> ${request.id}</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);

      // Only send success response if email is sent
      return res.status(201).json({
        message: "Tenant request submitted successfully (email sent)",
        data: request,
      });
    } catch (err) {
      console.error("❌ Failed to send email:", err);

      // Rollback? (Optional: delete tenant request if email fails)
      await request.destroy();

      return res.status(500).json({
        message: "Tenant request failed: could not send notification email",
        error: err.message,
      });
    }
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
    const { requestId } = req.params;
    const { action } = req.body; // "approved" | "rejected"
    const reviewerId = req.user.id; // from JWT

    // Find request
    const request = await TenantRequest.findByPk(requestId, { transaction: t });
    if (!request) {
      await t.rollback();
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      await t.rollback();
      return res.status(400).json({ message: "Request already reviewed" });
    }

    // Update request status
    request.status = action;
    request.reviewed_by = reviewerId;
    request.reviewed_at = new Date();
    await request.save({ transaction: t });

    if (action === "approved") {
      // Create new tenant
      const tenant = await Tenant.create(
        { name: `Tenant-${request.user_id}` },
        { transaction: t }
      );

      // Assign tenant_id to user
      await User.update(
        { tenant_id: tenant.id },
        { where: { id: request.user_id }, transaction: t }
      );

      // Assign "tenant_admin" role
      const tenantAdminRole = await Role.findOne({
        where: { name: "tenantAdmin" },
        transaction: t,
      });
      if (!tenantAdminRole) {
        await t.rollback();
        return res.status(500).json({ message: "Role 'tenantAdmin' not found" });
      }

      await UserRole.create(
        { user_id: request.user_id, role_id: tenantAdminRole.id },
        { transaction: t }
      );

      // Audit log
      await AuditLog.create(
        {
          actor_user_id: reviewerId,
          action: "tenant_request_approved",
          description: `Super admin ${reviewerId} approved tenant request for user ${request.user_id}. Tenant ${tenant.id} created.`,
        },
        { transaction: t }
      );
    } else if (action === "rejected") {
      // Audit log
      await AuditLog.create(
        {
          actor_user_id: reviewerId,
          action: "tenant_request_rejected",
          description: `Super admin ${reviewerId} rejected tenant request for user ${request.user_id}.`,
        },
        { transaction: t }
      );
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




