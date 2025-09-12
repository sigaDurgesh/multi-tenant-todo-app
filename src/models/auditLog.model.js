import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  actor_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSONB,
  },
}, {
  timestamps: true,
  tableName: "audit_logs",
});

export default AuditLog;
