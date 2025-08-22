import TenantRequest from "../models/tenantRequest.model.js";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import AuditLog from "../models/auditLog.model.js";
import { sequelize } from "../models/index.js";

// ------------------ CREATE REQUEST ------------------
export const createTenantRequest = async (req, res) => {
  try {
    const userId = req.body.data[0].user_id; // take logged-in user from JWT

    // Check if user already has a pending request
    const existing = await TenantRequest.findOne({
      where: { user_id: userId, status: "pending" },
    });
    if (existing) {
      return res.status(400).json({ message: "You already have a pending request" });
    }

    // Create request
    const request = await TenantRequest.create({ user_id: userId });

    // Log action
    // await AuditLog.create({
    //   actor_user_id: userId,
    //   action: "tenant_request_created",
    //   description: `User ${userId} requested to become a tenant owner.`,
    // });

    return res.status(201).json({
      message: "Tenant request submitted successfully",
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

// ------------------ LIST REQUESTS (Super Admin) ------------------
export const listTenantRequests = async (req, res) => {
  try {
    const requests = await TenantRequest.findAll({
      include: [
        { model: User, as: "requester", attributes: ["id", "email"] },
        { model: User, as: "reviewer", attributes: ["id", "email"] },
      ],
    });

    return res.status(200).json({ data: requests });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};
