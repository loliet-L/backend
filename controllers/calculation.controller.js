import { CalculationService } from '../services/calculation.service.js';
import { HTTPError } from '../utils/helpers.js';

const calculationService = new CalculationService();

export const getCalculationHistory = async (req, res, next) => {
  try {
    const history = await calculationService.getHistory();
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};