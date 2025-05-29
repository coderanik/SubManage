import { body, param, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Subscription validators
export const subscriptionValidators = {
  create: [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('planId').isMongoId().withMessage('Invalid plan ID'),
    validate
  ],
  update: [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('subscriptionId').isMongoId().withMessage('Invalid subscription ID'),
    body('planId').optional().isMongoId().withMessage('Invalid plan ID'),
    body('autoRenew').optional().isBoolean().withMessage('Auto-renew must be a boolean'),
    validate
  ],
  get: [
    param('userId').notEmpty().withMessage('User ID is required'),
    validate
  ],
  cancel: [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('subscriptionId').isMongoId().withMessage('Invalid subscription ID'),
    validate
  ]
};

// Plan validators
export const planValidators = {
  create: [
    body('name').notEmpty().withMessage('Plan name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('features').isArray().withMessage('Features must be an array'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    validate
  ],
  update: [
    param('planId').isMongoId().withMessage('Invalid plan ID'),
    body('name').optional().notEmpty().withMessage('Plan name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    validate
  ]
}; 