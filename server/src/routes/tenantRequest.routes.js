import express from "express";
import {
  createTenantRequest,
  reviewTenantRequest,
  listReviewedTenantRequests,
  getTenantRequestById,
  registerUserUnderTenant,
  getUsersByTenant,
  createTenantWithAdmin,
  addUserUnderTenant,
  softDeleteTenant
} from "../controllers/tenant.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
const router = express.Router();

// Normal user creates request
router.post("/", createTenantRequest);

// Super admin reviews request
router.put("/review-request", reviewTenantRequest);

// Super admin lists requests
router.get("/", listReviewedTenantRequests);

// Get request by ID
router.get("/:id", getTenantRequestById);

// Register user under tenant after approval
router.post("/register-user", registerUserUnderTenant);

// Get users by tenant
router.get("/users/:tenantId", getUsersByTenant);

// Super admin creates tenant directly
router.post("/create-tenant", createTenantWithAdmin);

// Add tenant user by tenant admin
router.post("/add-tenant-user", addUserUnderTenant);

// Soft delete tenant by super admin
router.delete("/:id", authenticateJWT , softDeleteTenant);

export default router;
