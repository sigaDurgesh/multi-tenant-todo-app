// import TenantRequest from "../models/tenantRequest.model.js";
// import Tenant from "../models/tenant.model.js";
// import User from "../models/user.model.js";
// import Role from "../models/role.model.js";
// import UserRole from "../models/userRole.model.js";
// import AuditLog from "../models/auditLog.model.js";
// import { sequelize } from "../models/index.js";
// import generateSecurePassword from "../utlis/genarateSecurePassword.js";  
// import nodemailer from "nodemailer";
// import bcrypt from "bcrypt";
// import crypto from "crypto";

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
//       order: [["reviewed_at", "DESC"]],
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


// export const createTenantRequest = async (req, res) => {
//   try {
//     const { user_id, tenant_name , email } = req.body; // <-- get both values

//     // Check if user already has a pending request
//     const existing = await TenantRequest.findOne({
//       where: { user_id, status: "pending" },
//     });
//     if (existing) {
//       return res.status(400).json({ message: "You already have a pending request" });
//     }

//     const existingTenant = await TenantRequest.findOne({
//       where: { tenant_name, status: "pending" },
//     });
//     if (existingTenant) {
//         return res
//           .status(400)
//           .json({ message: "This tenant name already has a pending request" });
//     }

//     // Create request
//     const request = await TenantRequest.create({ user_id, tenant_name , email });

//     await AuditLog.create({
//       actor_user_id: user_id, // who performed the action
//       action: "CREATE_TENANT_REQUEST",
//       entity_type: "TenantRequest",
//       entity_id: request.id, // the new tenant request id
//       details: {
//         tenant_name,
//         email,
//         status: request.status,
//       },
//     });

//     const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "suryadurgesh18@gmail.com",
//     pass: "rrezrvaceqjrrjnd",
//   },
// });


//     const mailOptions = {
//       from: `"Tenant Request System" <${process.env.EMAIL_USER}>`,
//       to: "suryadurgesh18@gmail.com",
//       subject: "New Tenant Request Submitted",
//       html: `
//         <h2>New Tenant Request</h2>
//         <p><b>Tenant Name:</b> ${tenant_name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>User ID:</b> ${user_id}</p>
//         <p><b>Status:</b> ${request.status}</p>
//         <p><b>Request ID:</b> ${request.id}</p>
//       `,
//     };

//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log("✅ Email sent:", info.messageId);

//       // Only send success response if email is sent
//       return res.status(201).json({
//         message: "Tenant request submitted successfully (email sent)",
//         data: request,
//       });
//     } catch (err) {
//       console.error("❌ Failed to send email:", err);

//       // Rollback? (Optional: delete tenant request if email fails)
//       await request.destroy();

//       return res.status(500).json({
//         message: "Tenant request failed: could not send notification email",
//         error: err.message,
//       });
//     }
//   } catch (error) {
//         return res
//       .status(500)
//       .json({ message: "Error creating request", error: error.message });
//   }
// };

// // ------------------ REVIEW REQUEST (Super Admin) ------------------
// export const reviewTenantRequest = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { requestId, action, reviewerId } = req.body; 
//     // requestId = tenant_request id
//     // action = "approved" | "rejected"
//     // reviewerId = super admin's user id

//     // 1. Find request
//     const request = await TenantRequest.findByPk(requestId, { transaction: t });
//     if (!request) {
//       await t.rollback();
//       return res.status(404).json({ message: "Request not found" });
//     }

//     if (request.status !== "pending") {
//       await t.rollback();
//       return res.status(400).json({ message: "Request already reviewed" });
//     }

//     // 2. Update request status
//     request.status = action;
//     request.reviewed_by = reviewerId;
//     request.reviewed_at = new Date();
//     await request.save({ transaction: t });

//     if (action === "approved") {
//       // Create tenant
//       const tenant = await Tenant.create(
//         { name: request.tenant_name },
//         { transaction: t }
//       );

//       const plainPassword = generateSecurePassword(12);
//       const passwordHash = await bcrypt.hash(plainPassword, 10);

//       // Update user with tenant_id + password
//       await User.update(
//         { tenant_id: tenant.id, password_hash: passwordHash },
//         { where: { id: request.user_id }, transaction: t }
//       );

//       // 🔑 Remove all old roles first
//       await UserRole.destroy({
//         where: { user_id: request.user_id },
//         transaction: t,
//       });

//       // ✅ Assign ONLY tenant_admin role (role_id = 2)
//       await UserRole.create(
//         { user_id: request.user_id, role_id: 2 },
//         { transaction: t }
//       );

//       // Send approval email
//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: "suryadurgesh18@gmail.com",
//           pass: "rrezrvaceqjrrjnd",
//         },
//       });

//       console.log("Generated Password:", plainPassword);

//       const mailOptions = {
//         from: `"Tenant System" <${process.env.EMAIL_USER}>`,
//         to: request.email,
//         subject: "Your Tenant Admin Account Approved",
//         html: `
//           <h2>Welcome to Multi-Tenant App</h2>
//           <p>Your tenant request has been <b>approved</b>.</p>
//           <p><b>Tenant:</b> ${request.tenant_name}</p>
//           <p><b>Email:</b> ${request.email}</p>
//           <p><b>Password:</b> ${plainPassword}</p>
//           <p>You can now login as <b>Tenant Admin</b>.</p>
//         `,
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//       } catch (err) {
//         await t.rollback();
//         return res
//           .status(500)
//           .json({ message: "Failed to send email", error: err.message });
//       }

//       // Audit log
//       await AuditLog.create(
//         {
//           actor_user_id: reviewerId,
//           action: "tenant_request_approved",
//           entity_type: "TenantRequest",
//           entity_id: request.id,
//           details: {
//             tenant_id: tenant.id,
//             user_id: request.user_id,
//             email: request.email,
//           },
//         },
//         { transaction: t }
//       );
//     }
//     if (action === "rejected") {
//       // Audit log
//       await AuditLog.create(
//         {
//           actor_user_id: reviewerId,
//           action: "tenant_request_rejected",
//           entity_type: "TenantRequest",
//           entity_id: request.id,
//           details: { user_id: request.user_id, email: request.email },
//         },
//         { transaction: t }
//       );
//     }

//     await t.commit();
//     return res
//       .status(200)
//       .json({ message: `Request ${action} successfully`, data: request });
//   } catch (error) {
//     await t.rollback();
//     return res
//       .status(500)
//       .json({ message: "Error reviewing request", error: error.message });
//   }
// };

// export const getTenantRequestById = async (req, res) => {
//   try {
//     const { id } = req.params; // request id comes from URL

//     const request = await TenantRequest.findByPk(id);

//     if (!request) {
//       return res.status(404).json({ message: "Tenant request not found" });
//     }

//     return res.status(200).json({
//       message: "Tenant request fetched successfully",
//       data: request,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching tenant request",
//       error: error.message,
//     });
//   }
// };






