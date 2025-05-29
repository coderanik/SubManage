import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler.js";

// Fixed admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASS

// Admin authentication
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against fixed credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: "admin", role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 86400000, // 1 day
    });

    return res.json({
      success: true,
      message: "Admin logged in successfully",
      admin: {
        id: "admin",
        email: ADMIN_EMAIL,
        role: "ADMIN"
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new subscription plan
export const createPlan = async (req, res) => {
  try {
    const { name, price, features, duration } = req.body;

    // Check if plan with same name exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      throw new ApiError(400, "Plan with this name already exists");
    }

    const plan = new Plan({
      name,
      price,
      features,
      duration,
      isActive: true
    });

    await plan.save();

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan: {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        duration: plan.duration
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a subscription plan
export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { name, price, features, duration, isActive } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ApiError(404, "Plan not found");
    }

    // If name is being updated, check for duplicates
    if (name && name !== plan.name) {
      const existingPlan = await Plan.findOne({ name });
      if (existingPlan) {
        throw new ApiError(400, "Plan with this name already exists");
      }
    }

    // Update plan fields
    if (name) plan.name = name;
    if (price) plan.price = price;
    if (features) plan.features = features;
    if (duration) plan.duration = duration;
    if (typeof isActive === 'boolean') plan.isActive = isActive;

    await plan.save();

    return res.json({
      success: true,
      message: "Plan updated successfully",
      plan: {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        duration: plan.duration,
        isActive: plan.isActive
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all plans (admin view)
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      plans: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        duration: plan.duration,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a plan
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ApiError(404, "Plan not found");
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      planId,
      status: 'ACTIVE'
    });

    if (activeSubscriptions > 0) {
      throw new ApiError(400, "Cannot delete plan with active subscriptions");
    }

    await plan.deleteOne();

    return res.json({
      success: true,
      message: "Plan deleted successfully"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 