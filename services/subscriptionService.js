import { Op } from 'sequelize';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import { ApiError } from '../middleware/errorHandler.js';

// Check and update expired subscriptions
export const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    
    // Find all active subscriptions that have expired
    const expiredSubscriptions = await Subscription.findAll({
      where: {
        status: 'ACTIVE',
        endDate: { [Op.lt]: now }
      }
    });

    // Update expired subscriptions
    for (const subscription of expiredSubscriptions) {
      if (subscription.autoRenew) {
        // Calculate new end date based on current plan
        const plan = await Plan.findByPk(subscription.planId);
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + plan.duration);
        
        subscription.endDate = newEndDate;
        subscription.paymentStatus = 'PENDING';
        await subscription.save();
      } else {
        subscription.status = 'EXPIRED';
        await subscription.save();

        // Check if user has other active subscriptions
        const activeSubs = await Subscription.count({
          where: {
            userId: subscription.userId,
            status: 'ACTIVE'
          }
        });

        if (activeSubs === 0) {
          await User.update(
            { role: 'Free' },
            { where: { userId: subscription.userId } }
          );
        }
      }
    }

    return expiredSubscriptions;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error checking expired subscriptions');
  }
};

// Get subscription statistics
export const getSubscriptionStats = async () => {
  try {
    const stats = await Subscription.count({
      group: ['status']
    });

    // Format output to match existing pipeline
    return stats.map(stat => ({
      _id: stat.status,
      count: parseInt(stat.count, 10)
    }));
  } catch (error) {
    throw new ApiError(500, 'Error getting subscription statistics');
  }
};

// Get user subscription history
export const getUserSubscriptionHistory = async (userId) => {
  try {
    const history = await Subscription.findAll({ 
      where: { userId },
      include: [{ model: Plan, as: 'planIdRecord' }],
      order: [['createdAt', 'DESC']]
    });

    return history;
  } catch (error) {
    throw new ApiError(500, 'Error getting subscription history');
  }
};