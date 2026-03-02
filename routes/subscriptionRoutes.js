import express from 'express';
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getPlans,
  getSubscriptionHistory,
  getSubscriptionStatsController,
  upgradeToPremium
} from '../controllers/subscriptionControllers.js';
import { subscriptionValidators } from '../middleware/validators.js';
import { userAuth } from '../middleware/auth.js';

const subscriptionRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Manage recurring user items
 */

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create new subscription for user
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               planId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 */
// Subscription routes
subscriptionRoutes.post('/', subscriptionValidators.create, createSubscription);

/**
 * @swagger
 * /subscriptions/{userId}:
 *   get:
 *     summary: Retrieve subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
subscriptionRoutes.get('/:userId', subscriptionValidators.get, getSubscription);

/**
 * @swagger
 * /subscriptions/{userId}:
 *   put:
 *     summary: Update subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *               planId:
 *                 type: string
 *               autoRenew:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
subscriptionRoutes.put('/:userId', subscriptionValidators.update, updateSubscription);

/**
 * @swagger
 * /subscriptions/{userId}:
 *   delete:
 *     summary: Cancel subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cancelled
 */
subscriptionRoutes.delete('/:userId', subscriptionValidators.cancel, cancelSubscription);

/**
 * @swagger
 * /subscriptions/upgrade:
 *   post:
 *     summary: Upgrade User to Premium Plan
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *               paymentMethodToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upgraded User successfully
 */
// Upgrade Route
subscriptionRoutes.post('/upgrade', userAuth, subscriptionValidators.upgrade, upgradeToPremium);

/**
 * @swagger
 * /subscriptions/{userId}/history:
 *   get:
 *     summary: Get user subscription history
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
// Additional subscription routes
subscriptionRoutes.get('/:userId/history', subscriptionValidators.get, getSubscriptionHistory);

/**
 * @swagger
 * /subscriptions/stats:
 *   get:
 *     summary: Generate statistics map
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Retrieved safely
 */
subscriptionRoutes.get('/stats', getSubscriptionStatsController);

/**
 * @swagger
 * /subscriptions/plans:
 *   get:
 *     summary: Acquire general active plans
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Fetches default lists
 */
// Plan routes
subscriptionRoutes.get('/plans', getPlans);

export default subscriptionRoutes; 