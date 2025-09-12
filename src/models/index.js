import sequelize from "../config/db.js";

import Tenant from "./tenant.model.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import UserRole from "./userRole.model.js";
import Todo from "./todo.model.js";
import AuditLog from "./auditLog.model.js";

// Associations
Tenant.hasMany(User, { foreignKey: "tenant_id" });
User.belongsTo(Tenant, { foreignKey: "tenant_id" });

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

User.hasMany(Todo, { foreignKey: "user_id" });
Todo.belongsTo(User, { foreignKey: "user_id" });

Tenant.hasMany(Todo, { foreignKey: "tenant_id" });
Todo.belongsTo(Tenant, { foreignKey: "tenant_id" });

User.hasMany(AuditLog, { foreignKey: "actor_user_id" });
AuditLog.belongsTo(User, { foreignKey: "actor_user_id" });

export {
  sequelize,
  Tenant,
  User,
  Role,
  UserRole,
  Todo,
  AuditLog,
};