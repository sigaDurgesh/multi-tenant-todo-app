import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserRole = sequelize.define("UserRole", {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  timestamps: false,
  tableName: "user_roles",
});

export default UserRole;
