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
import {formatDate} from "../utlis/dateFormatter.js";

import transporter from "../config/nodemailer.js";
import { generateEmailTemplate } from "../utlis/emailTemplate.js";
import { validateTenantName } from "../utlis/tenantNameValidators.js";
import { emailLoginButton } from "../utlis/emailLoginButton.js";

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

// export const createTenantRequest = async (req, res) => {
//   try {
//     const { tenantName, email, password } = req.body;

//     // 1. Validate tenant name
//     const validation = validateTenantName(tenantName);
//     if (!validation.valid) {
//       return res.status(400).json({ message: validation.message });
//     }

//     // 2. Block if tenant exists and is deleted OR inactive
//     const blockedTenant = await Tenant.findOne({
//       where: {
//         name: tenantName,
//         [Op.or]: [{ is_deleted: true }, { is_active: false }],
//       },
//     });

//     if (blockedTenant) {
//       return res.status(400).json({
//         message:
//           "This tenant is either deleted or inactive and cannot accept new requests.",
//       });
//     }

//     // 3. Check for duplicate pending tenant request
//     const existingTenantRequest = await TenantRequest.findOne({
//       where: { tenant_name: tenantName, status: "pending" },
//     });
//     if (existingTenantRequest) {
//       return res
//         .status(400)
//         .json({ message: "This tenant name already has a pending request" });
//     }

//     // 4. Create a new user (hash password before saving)
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       email,
//       password_hash: hashedPassword,
//       // tenant_id will be assigned once tenant is approved
//     });

//     // 5. Create the tenant request (linking user_id)
//     const request = await TenantRequest.create({
//       user_id: user.id,
//       tenant_name: tenantName,
//       email,
//       status: "pending"
//     });

//     // 6. Audit log
//     await AuditLog.create({
//       actor_user_id: user.id,
//       action: "CREATE_TENANT_REQUEST",
//       entity_type: "TenantRequest",
//       entity_id: request.id,
//       details: { tenant_name: tenantName, email, status: request.status },
//     });

//     return res.status(201).json({
//       message: "Tenant request submitted successfully",
//       data: request,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error creating request", error: error.message });
//   }
// };

export const createTenantRequest = async (req, res) => {
  try {
    const { tenantName, email, password } = req.body;

    // 1. Validate tenant name
    const validation = validateTenantName(tenantName);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // 2. Block if tenant exists and is deleted OR inactive
    const blockedTenant = await Tenant.findOne({
      where: {
        name: tenantName,
        [Op.or]: [{ is_deleted: true }, { is_active: false }],
      },
    });

    if (blockedTenant) {
      return res.status(400).json({
        message:
          "This tenant is either deleted or inactive and cannot accept new requests.",
      });
    }

    // 3. Check if an active tenant already exists
    const existingTenant = await Tenant.findOne({
      where: { name: tenantName, is_deleted: false, is_active: true },
    });

    if (existingTenant) {
      return res.status(400).json({
        message: "This tenant name is already taken. Please use a different name.",
      });
    }

    // 4. Check for duplicate pending tenant request
    const existingTenantRequest = await TenantRequest.findOne({
      where: { tenant_name: tenantName, status: "pending" },
    });
    if (existingTenantRequest) {
      return res
        .status(400)
        .json({ message: "This tenant name is already taken. Please use a different name." });
    }

    // 5. Create a new user (hash password before saving)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      // tenant_id will be assigned once tenant is approved
    });

    // 6. Create the tenant request (linking user_id)
    const request = await TenantRequest.create({
      user_id: user.id,
      tenant_name: tenantName,
      email,
      status: "pending",
    });

    // 7. Audit log
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
            <p>
              ${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}
          </p>
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

    const validation = validateTenantName(tenantName);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

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
      where: { tenant_id: tenant.id},
      attributes: ["id", "email","is_active", "is_deleted"],
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

export const createTenantWithAdmin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tenantName, email } = req.body;

    const validation = validateTenantName(tenantName);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // 1. Check duplicate tenant
    const existingTenant = await Tenant.findOne({ where: { name: tenantName } });
    if (existingTenant) {
      if (!existingTenant.is_deleted) {
        await t.rollback();
        return res.status(400).json({ message: "Tenant name already exists" });
      }
      if (existingTenant.is_deleted && !existingTenant.is_active) {
        await t.rollback();
        return res.status(400).json({
          message:
            "This tenant was deleted and cannot be recreated.",
        });
      }
    }

// 2. Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "This email is already associated with another tenant. Please use new email." });
  }

    // 2. Generate secure password
    const plainPassword = generateSecurePassword(12);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // 3. Create Tenant
    const tenant = await Tenant.create(
      { name: tenantName },
      { transaction: t }
    );

    // 4. Create User (tenant admin)
    const user = await User.create(
      { tenant_id: tenant.id, email, password_hash: passwordHash },
      { transaction: t }
    );

    // 5. Assign tenantAdmin role
    await UserRole.create(
      { user_id: user.id, role_id: 2 }, // tenantAdmin
      { transaction: t }
    );

    // 6. Store entry in tenant_requests with status "approved"
    const tenantRequest = await TenantRequest.create(
      {
        user_id: user.id,
        tenant_name: tenantName,
        email,
        status: "approved",
        reviewed_by: user.id, // optional: or super admin ID
        reviewed_at: new Date(),
      },
      { transaction: t }
    );

    // 7. Send email with password
    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Tenant has been Created 🎉",
      html: generateEmailTemplate({
        title: "Tenant Created Successfully",
        subTitle: "Your tenant has been set up and approved.",
        body: `
          <p><b>Tenant:</b> ${tenantName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${plainPassword}</p>
          <p><strong><em>Please change your password after first login.</em></strong></p>
          <p>
              ${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}
          </p>
        `,
        footer: "This is an automated message from Tenant System.",
      }),
    };
    await transporter.sendMail(mailOptions);

    // 8. Commit transaction
    await t.commit();

    return res.status(201).json({
      message: "Tenant created successfully",
      tenant,
      user,
      tenantRequest,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Error creating tenant",
      error: error.message,
    });
  }
};

export const addUserUnderTenant = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tenantId, email, roleId } = req.body; 
    // roleId optional; if not provided default = user role (id=3 for example)

    // 1. Validate tenant
    const tenant = await Tenant.findByPk(tenantId, { transaction: t });
    if (!tenant || tenant.is_deleted) {
      await t.rollback();
      return res.status(404).json({ message: "Tenant not found" });
    }

    // 2. Check if user already exists under tenant
    let user = await User.findOne({
      where: { email, tenant_id: tenant.id, is_deleted: false },
      include: [{ model: Role, as: "Roles" }],
      transaction: t,
    });

    if (user) {
      // User already exists → just send info email
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Already Registered with ${tenant.name}`,
        html: generateEmailTemplate({
          title: "You are already registered",
          subTitle: `Hello, you are already a user of tenant <b>${tenant.name}</b>.`,
          body: `
            <p><b>Tenant:</b> ${tenant.name}</p>
            <p><b>Email:</b> ${email}</p>
            <p>No further action is required. You can continue using your existing account.</p> 
            <p>
              ${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}
          </p>
          `,
          footer: "This is an automated message from Tenant System.",
        }),
      };
      await transporter.sendMail(mailOptions);

      await t.commit();
      return res.status(200).json({
        message: "User already exists under tenant. Info email sent.",
        user,
      });
    }

    // 3. If user does not exist → create with auto password
    const plainPassword = generateSecurePassword(12);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    user = await User.create(
      {
        tenant_id: tenant.id,
        email,
        password_hash: passwordHash,
      },
      { transaction: t }
    );

    const assignedRoleId = roleId || 3; // default user role
    await UserRole.create(
      { user_id: user.id, role_id: assignedRoleId },
      { transaction: t }
    );

    // 4. Send welcome email for new user
    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to ${tenant.name}! 🎉`,
      html: generateEmailTemplate({
        title: "Welcome to the Tenant System",
        subTitle: "Your account has been created successfully.",
        body: `
          <p><b>Tenant:</b> ${tenant.name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${plainPassword}</p>
          <br/>
          <p><strong><em>Please change your password after your first login.</em></strong></p>
          <p><strong><em>Don't forget your tenant name – it's required for login.</em></strong></p>
          <p>
              ${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}
          </p>
        `,
        footer: "This is an automated message from Tenant System.",
      }),
    };
    await transporter.sendMail(mailOptions);

    await t.commit();

    return res.status(201).json({
      message: "New user created successfully under tenant",
      user,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Error adding user under tenant",
      error: error.message,
    });
  }
};

export const softDeleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if user is super admin
    if (!req.user || req.user.roles[0] !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Only super admins can delete tenants." });
    }

    // 1. Find tenant
    const tenant = await Tenant.findOne({ where: { id: id, is_deleted: false } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found or already deleted." });
    }
    const newDate = formatDate(new Date()).toString();
    // 2. Soft delete tenant
    await tenant.update({
      is_deleted: true,
      deleted_at: newDate,
      is_active: false,
      updatedAt: newDate
    });

    const tenantRequest = await TenantRequest.findOne({ where: { tenant_name: tenant.name } });
    const tenantEmail = tenantRequest?.email;

    // 3. Prepare email (if tenant has an email field)
    if (tenantEmail) {
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: tenantEmail,
        subject: `Tenant ${tenant.name} has been deleted`,
        html: generateEmailTemplate({
          title: "Tenant Deleted",
          subTitle: "Your tenant account has been deactivated by the super admin.",
          body: `
            <p>Hello ${tenant.name},</p>
            <p>Your tenant account (<b>${tenant.name}</b>) has been <strong>soft deleted</strong> on ${newDate}.</p>
            <p>You will no longer be able to access the system unless reactivated by a super admin.</p>
            <br/>
            <p>If you believe this is a mistake, please contact support immediately.</p>
          `,
          footer: "This is an automated message from Tenant System.",
        }),
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("⚠️ Failed to send tenant deletion email:", emailErr.message);
      }
    }

    // 4. Return API response
    return res.status(200).json({
      message: "Tenant soft deleted successfully",
      tenant: {
        id: tenant.id,
        name: tenant.name,
        is_deleted: tenant.is_deleted,
        deleted_at: newDate,
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error soft deleting tenant",
      error: error.message,
    });
  }
};

export const activateTenant = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if user is super admin
    if (!req.user || req.user.roles[0] !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Only super admins can activate tenants." });
    }

    // 1. Find tenant
    const tenant = await Tenant.findOne({ where: { id: id , is_active: false } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found or already activated." });
    }
    const newDate = formatDate(new Date()).toString();
    await tenant.update({
      is_active: true,
      updatedAt: newDate,
      is_deleted: false
    });
    
    const tenantRequest = await TenantRequest.findOne({ where: { tenant_name: tenant.name } });
    const tenantEmail = tenantRequest?.email;
    // 📧 Send activation email (if tenant has email)
    if (tenantEmail) {
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: tenantEmail,
        subject: `Tenant ${tenant.name} has been activated 🎉`,
        html: generateEmailTemplate({
          title: "Tenant Activated",
          subTitle: "Your tenant account is now active again.",
          body: `
            <p>Hello ${tenant.name},</p>
            <p>Your tenant account (<b>${tenant.name}</b>) has been <strong>activated</strong> by the super admin.</p>
            <p>You can now log in and continue using the system.</p>
            <br/>
            <p>
              ${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}
            </p>
          `,
          footer: "This is an automated message from Tenant System.",
        }),
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("⚠️ Failed to send tenant activation email:", emailErr.message);
      }
    }

    return res.status(200).json({
      message: "Tenant activated successfully",
      tenant: {
        id: tenant.id,
        name: tenant.name,
        is_active: tenant.is_active
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error activating tenant",
      error: error.message,
    });
  }
};

export const deactivateTenant = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if user is super admin
    if (!req.user || req.user.roles[0] !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Only super admins can deactivate tenants." });
    }

    // 1. Find tenant
    const tenant = await Tenant.findOne({ where: { id: id, is_active: true } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found or already deactivated." });
    }
    const newDate = formatDate(new Date()).toString();
    await tenant.update({
      is_active: false,
      updatedAt: newDate,
      is_deleted: false
    });

    const tenantRequest = await TenantRequest.findOne({ where: { tenant_name: tenant.name } });
    const tenantEmail = tenantRequest?.email;

    // 📧 Send deactivation email (if tenant has email)
    if (tenantEmail) {
      const mailOptions = {
        from: `"Tenant System" <${process.env.EMAIL_USER}>`,
        to: tenantEmail,
        subject: `Tenant ${tenant.name} has been deactivated`,
        html: generateEmailTemplate({
          title: "Tenant Deactivated",
          subTitle: "Your tenant account has been temporarily disabled.",
          body: `
            <p>Hello ${tenant.name},</p>
            <p>Your tenant account (<b>${tenant.name}</b>) has been <strong>deactivated</strong> by the super admin.</p>
            <p>You will not be able to log in until it is reactivated.</p>
            <br/>
            <p>If you believe this action was taken in error, please contact support.</p>
          `,
          footer: "This is an automated message from Tenant System.",
        }),
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("⚠️ Failed to send tenant deactivation email:", emailErr.message);
      }
    }

    return res.status(200).json({
      message: "Tenant deactivated successfully",
      tenant: {
        id: tenant.id,
        name: tenant.name,
        is_active: tenant.is_active
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deactivating tenant",
      error: error.message,
    });
  }
};

export const getTenantsWithUserCount = async (req, res) => {
  try {
    const tenants = await sequelize.query(
      `
      SELECT 
          t."id",
          t."name",
          t."is_active",
          tr."email",
          t."is_deleted",
          t."deleted_at",
          tr.status,
          (
              SELECT COUNT(*) 
              FROM "users" u
              JOIN "user_roles" ur ON ur."user_id" = u."id"
              WHERE u."tenant_id" = t."id"
                AND ur."role_id" = 3  -- only normal users
          ) AS "userCount"
      FROM "tenants" t
      LEFT JOIN "tenant_requests" tr
          ON tr."tenant_name" = t."name"
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({
      message: "Tenants fetched successfully",
      tenants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching tenant request",
      error: error.message,
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tenantAdmin = req.user; // coming from authenticateJWT

    // Ensure tenant admin role
    if (!tenantAdmin.roles.includes("tenantAdmin")) {
      return res.status(403).json({ message: "Only tenant admins can activate users" });
    }

    const user = await User.findOne({ where: { id: userId, tenant_id: tenantAdmin.tenant_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }

    await user.update({ is_active: true });

    const tenant = await Tenant.findByPk(tenantAdmin.tenant_id);

    // 📧 Send activation email
    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your account has been activated 🎉",
      html: generateEmailTemplate({
        title: "Account Activated",
        subTitle: "You can now log in and access your account again.",
        body: `
          <p>Hello ${user.name || user.email || ""},</p>
          <p>Your account under tenant <b>${tenant.name}</b> has been <strong>activated</strong> by your administrator.</p>
          <p>You can now log in and continue using the system as usual.</p>
          <br/>
          <p>${emailLoginButton({
          url: `${process.env.LOCAL_URL}/login`,
          label: "Log in to Tenant System",
        })}</p>
        `,
        footer: "This is an automated message from Tenant System.",
      }),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Failed to send activation email:", emailErr.message);
    }

    return res.status(200).json({ message: "User activated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error activating user", error: error.message });
  }
};

/**
 * Deactivate a user (tenant admin only)
 */
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tenantAdmin = req.user;

    if (!tenantAdmin.roles.includes("tenantAdmin")) {
      return res.status(403).json({ message: "Only tenant admins can deactivate users" });
    }

    const user = await User.findOne({ where: { id: userId, tenant_id: tenantAdmin.tenant_id, is_deleted: false } });
    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }

    await user.update({ is_active: false });
    
    const tenant = await Tenant.findByPk(tenantAdmin.tenant_id);

    // 📧 Prepare and send notification email
    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your account has been deactivated",
      html: generateEmailTemplate({
        title: "Account Deactivated",
        subTitle: "Your account has been temporarily disabled.",
        body: `
          <p>Hello ${user.name || user.email || ""},</p>
          <p>Your account under tenant <b>${tenant.name}</b> has been <strong>deactivated</strong> by your administrator.</p>
          <p>This means you will not be able to log in until your account is reactivated.</p>
          <br/>
          <p>If you believe this action was taken in error, please contact your tenant admin.</p>
        `,
        footer: "This is an automated message from Tenant System.",
      }),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Failed to send deactivation email:", emailErr.message);
    }

    return res.status(200).json({ message: "User deactivated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error deactivating user", error: error.message });
  }
};

/**
 * Soft delete a user (tenant admin only)
 */
export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tenantAdmin = req.user;

    if (!tenantAdmin.roles.includes("tenantAdmin")) {
      return res.status(403).json({ message: "Only tenant admins can delete users" });
    }

    const user = await User.findOne({ where: { id: userId, tenant_id: tenantAdmin.tenant_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }

    await user.update({ is_deleted: true , is_active: false});

    const tenant = await Tenant.findByPk(tenantAdmin.tenant_id);

    // 📧 Prepare notification email
    const mailOptions = {
      from: `"Tenant System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your account has been deleted",
      html: generateEmailTemplate({
        title: "Account Deactivated",
        subTitle: "Your account has been deleted by your tenant administrator.",
        body: `
          <p>Hello ${user.name || user.email || ""},</p>
          <p>Your account under tenant <b>${tenant.name}</b> has been <strong>deleted</strong> by your administrator.</p>
          <p>If you believe this is a mistake, please reach out to your tenant admin for clarification.</p>
          <br/>
          <p style="color:#ef4444;font-weight:600;">You will no longer be able to log in until your account is reactivated.</p>
        `,
        footer: "This is an automated message from Tenant System.",
      }),
    };

    // Send email (ignore errors for the API response but log them)
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Failed to send deletion email:", emailErr.message);
    }

    return res.status(200).json({ message: "User deleted successfully (soft delete)", user });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};