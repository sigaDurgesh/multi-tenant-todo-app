import express from "express";
import {
  createTenantRequest,
  reviewTenantRequest,
  listReviewedTenantRequests,
  getTenantRequestById,
  registerUserUnderTenant,
  getUsersByTenant
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

export default router;
