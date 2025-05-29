import express from 'express';
import {
  adminLogin,
  createPlan,
  updatePlan,
  getAllPlans,
  deletePlan
} from '../controllers/adminControllers.js';
import { adminAuth, superAdminAuth } from '../middleware/adminAuth.js';
import { planValidators } from '../middleware/validators.js';

const adminRoutes = express.Router();

// Admin authentication
adminRoutes.post('/login', adminLogin);

// Plan management routes (protected)
adminRoutes.post('/plans', adminAuth, planValidators.create, createPlan);
adminRoutes.put('/plans/:planId', adminAuth, planValidators.update, updatePlan);
adminRoutes.get('/plans', adminAuth, getAllPlans);
adminRoutes.delete('/plans/:planId', adminAuth, deletePlan);

export default adminRoutes; 