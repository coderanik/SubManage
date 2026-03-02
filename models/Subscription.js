import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Plan from './Plan.js';

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED'),
    defaultValue: 'ACTIVE',
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
    defaultValue: 'PENDING',
  }
});

Subscription.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId', as: 'userRecord' });
Subscription.belongsTo(Plan, { foreignKey: 'planId', as: 'planIdRecord' }); // keep alias similar for easy populate mapping? Alias can just be "Plan"
User.hasMany(Subscription, { foreignKey: 'userId', sourceKey: 'userId' });
Plan.hasMany(Subscription, { foreignKey: 'planId' });

export default Subscription;