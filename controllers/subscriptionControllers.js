import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import User from "../models/User.js";
import { getUserSubscriptionHistory, getSubscriptionStats as getStats } from "../services/subscriptionService.js";
import { ApiError } from "../middleware/errorHandler.js";

// Create a new subscription
export const createSubscription = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Validate user exists
    const user = await User.findOne({ userId });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Validate plan exists and is active
    const plan = await Plan.findOne({ _id: planId, isActive: true });
    if (!plan) {
      throw new ApiError(404, "Plan not found or inactive");
    }

    // Check if user already has this specific plan
    const existingPlanSubscription = await Subscription.findOne({
      userId,
      planId,
      status: 'ACTIVE'
    });

    if (existingPlanSubscription) {
      throw new ApiError(400, "User already has an active subscription for this plan");
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = new Subscription({
      userId,
      planId,
      endDate,
      status: 'ACTIVE',
      paymentStatus: 'PENDING'
    });

    await subscription.save();

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user's current subscriptions
export const getSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ 
      userId,
      status: 'ACTIVE'
    })
      .populate('planId')
      .sort({ createdAt: -1 });

    if (!subscriptions.length) {
      throw new ApiError(404, "No active subscriptions found");
    }

    return res.json({
      success: true,
      subscriptions
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscriptionId, planId, autoRenew } = req.body;

    const subscription = await Subscription.findOne({ 
      _id: subscriptionId,
      userId, 
      status: 'ACTIVE' 
    });

    if (!subscription) {
      throw new ApiError(404, "No active subscription found");
    }

    if (planId) {
      const newPlan = await Plan.findOne({ _id: planId, isActive: true });
      if (!newPlan) {
        throw new ApiError(404, "Plan not found or inactive");
      }

      // Check if user already has this plan
      const existingPlanSubscription = await Subscription.findOne({
        userId,
        planId,
        status: 'ACTIVE',
        _id: { $ne: subscriptionId } // Exclude current subscription
      });

      if (existingPlanSubscription) {
        throw new ApiError(400, "User already has an active subscription for this plan");
      }

      // Calculate new end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + newPlan.duration);

      subscription.planId = planId;
      subscription.endDate = endDate;
    }

    if (autoRenew !== undefined) {
      subscription.autoRenew = autoRenew;
    }

    await subscription.save();

    return res.json({
      success: true,
      message: "Subscription updated successfully",
      subscription
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscriptionId } = req.body;

    const subscription = await Subscription.findOne({ 
      _id: subscriptionId,
      userId, 
      status: 'ACTIVE' 
    });

    if (!subscription) {
      throw new ApiError(404, "No active subscription found");
    }

    subscription.status = 'CANCELLED';
    subscription.autoRenew = false;
    await subscription.save();

    return res.json({
      success: true,
      message: "Subscription cancelled successfully"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all available plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    return res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get subscription history
export const getSubscriptionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await getUserSubscriptionHistory(userId);
    
    return res.json({
      success: true,
      history
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get subscription statistics
export const getSubscriptionStatsController = async (req, res) => {
  try {
    const stats = await getStats();
    
    return res.json({
      success: true,
      stats
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 