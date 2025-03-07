import logger from '../config/logger.js';
import { AIService } from '../services/ai.service.js';
import { HTTPError } from '../utils/helpers.js';

const aiService = new AIService();

export const calculateEmissions = async (req, res, next) => {
  try {
    const { vehicle, distance } = req.body;
    
    if (!vehicle || !distance) {
      throw new HTTPError(400, 'Vehicle and distance are required');
    }

    const co2 = await aiService.calculateEmissions(vehicle, distance);
    logger.info(`Calculated emissions: ${co2}kg for ${vehicle} ${distance}km`);
    
    res.json({
      success: true,
      data: { co2 }
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { co2, vehicle, distance } = req.body;
    
    if (!co2 || !vehicle || !distance) {
      throw new HTTPError(400, 'All fields are required');
    }

    const recommendations = await aiService.getRecommendations(co2, vehicle, distance);
    
    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    next(error);
  }
};