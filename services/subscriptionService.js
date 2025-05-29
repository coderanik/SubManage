import Subscription from '../models/Subscription.js';
import { ApiError } from '../middleware/errorHandler.js';

// Check and update expired subscriptions
export const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    
    // Find all active subscriptions that have expired
    const expiredSubscriptions = await Subscription.find({
      status: 'ACTIVE',
      endDate: { $lt: now }
    });

    // Update expired subscriptions
    for (const subscription of expiredSubscriptions) {
      if (subscription.autoRenew) {
        // Calculate new end date based on current plan
        const plan = await subscription.populate('planId');
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + plan.duration);
        
        subscription.endDate = newEndDate;
        subscription.paymentStatus = 'PENDING';
        await subscription.save();
      } else {
        subscription.status = 'EXPIRED';
        await subscription.save();
      }
    }

    return expiredSubscriptions;
  } catch (error) {
    throw new ApiError(500, 'Error checking expired subscriptions');
  }
};

// Get subscription statistics
export const getSubscriptionStats = async () => {
  try {
    const stats = await Subscription.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats;
  } catch (error) {
    throw new ApiError(500, 'Error getting subscription statistics');
  }
};

// Get user subscription history
export const getUserSubscriptionHistory = async (userId) => {
  try {
    const history = await Subscription.find({ userId })
      .populate('planId')
      .sort({ createdAt: -1 });

    return history;
  } catch (error) {
    throw new ApiError(500, 'Error getting subscription history');
  }
}; 