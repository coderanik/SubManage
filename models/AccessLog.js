import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const AccessLog = sequelize.define('AccessLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

AccessLog.belongsTo(User, { foreignKey: 'userPk', targetKey: 'id', as: 'userRef' });
User.hasMany(AccessLog, { foreignKey: 'userPk', sourceKey: 'id' });

export default AccessLog;
