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

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Log in as admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
// Admin authentication
adminRoutes.post('/login', adminLogin);

// Plan management routes (protected)
/**
 * @swagger
 * /admin/plans:
 *   post:
 *     summary: Create new plan
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Success
 */
adminRoutes.post('/plans', adminAuth, planValidators.create, createPlan);

/**
 * @swagger
 * /admin/plans/{planId}:
 *   put:
 *     summary: Update a plan
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
adminRoutes.put('/plans/:planId', adminAuth, planValidators.update, updatePlan);

/**
 * @swagger
 * /admin/plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
adminRoutes.get('/plans', adminAuth, getAllPlans);

/**
 * @swagger
 * /admin/plans/{planId}:
 *   delete:
 *     summary: Delete a plan
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
adminRoutes.delete('/plans/:planId', adminAuth, deletePlan);

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Get access logs
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
// Access logs route (protected)
adminRoutes.get('/logs', adminAuth, getAccessLogs);

/**
 * @swagger
 * /admin/reports/monthly:
 *   get:
 *     summary: Download CSV access log reports
 *     tags: [Admin]
 *     security:
 *       - adminCookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
// Monthly usage reports (protected)
adminRoutes.get('/reports/monthly', adminAuth, getMonthlyUsageReport);

export default adminRoutes; 