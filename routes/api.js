import { Router } from 'express';
import { body } from 'express-validator';
import {
  calculateEmissions,
  getRecommendations
} from '../controllers/ai.controller.js';
import { getCalculationHistory } from '../controllers/calculation.controller.js';
import { validateRequest } from '../middlewares/validation.js';

const router = Router();

router.post('/calculate',
  validateRequest([
    body('vehicle').notEmpty().withMessage('Vehicle type is required'),
    body('distance').isFloat({ min: 0 }).withMessage('Valid distance required')
  ]),
  calculateEmissions
);

router.post('/recommendations',
  validateRequest([
    body('co2').isFloat({ min: 0 }),
    body('vehicle').notEmpty(),
    body('distance').isFloat({ min: 0 })
  ]),
  getRecommendations
);

router.get('/history', getCalculationHistory);

export default router;