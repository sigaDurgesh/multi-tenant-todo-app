import express from "express";
import {
  createTenantRequest,
  reviewTenantRequest,
  listReviewedTenantRequests,
  getTenantRequestById,
  registerUserUnderTenant,
  getUsersByTenant,
  createTenantWithAdmin,
  addUserUnderTenant
} from "../controllers/tenant.controller.js";
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

export default router;
