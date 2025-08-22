import express from "express";
import {
  createTenantRequest,
  reviewTenantRequest,
  listTenantRequests,
} from "../controllers/tenantRequest.controller.js";
const router = express.Router();

// Normal user creates request
router.post("/", createTenantRequest);

// Super admin reviews request
router.put("/:requestId/review", reviewTenantRequest);

// Super admin lists requests
router.get("/", listTenantRequests);

export default router;
