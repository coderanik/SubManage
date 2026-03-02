import express from 'express';
import {
  adminLogin,
  createPlan,
  updatePlan,
  getAllPlans,
  deletePlan,
  getAccessLogs,
  getMonthlyUsageReport
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

// Access logs route (protected)
adminRoutes.get('/logs', adminAuth, getAccessLogs);

// Monthly usage reports (protected)
adminRoutes.get('/reports/monthly', adminAuth, getMonthlyUsageReport);

export default adminRoutes; 