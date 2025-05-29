import express from 'express';
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getPlans,
  getSubscriptionHistory,
  getSubscriptionStatsController
} from '../controllers/subscriptionControllers.js';
import { subscriptionValidators } from '../middleware/validators.js';

const subscriptionRoutes = express.Router();

// Subscription routes
subscriptionRoutes.post('/', subscriptionValidators.create, createSubscription);
subscriptionRoutes.get('/:userId', subscriptionValidators.get, getSubscription);
subscriptionRoutes.put('/:userId', subscriptionValidators.update, updateSubscription);
subscriptionRoutes.delete('/:userId', subscriptionValidators.cancel, cancelSubscription);

// Additional subscription routes
subscriptionRoutes.get('/:userId/history', subscriptionValidators.get, getSubscriptionHistory);
subscriptionRoutes.get('/stats', getSubscriptionStatsController);

// Plan routes
subscriptionRoutes.get('/plans', getPlans);

export default subscriptionRoutes; 