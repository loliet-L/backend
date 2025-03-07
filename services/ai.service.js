import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/constants.js';
import logger from '../config/logger.js';
import { HTTPError } from '../utils/helpers.js';

export class AIService {
  constructor() {
    this.gemini = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.calculationModel = this.gemini.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.1,
        topP: 0.1
      }
    });
    
    this.recommendationModel = this.gemini.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9
      }
    });
  }

  async calculateEmissions(vehicle, distance) {
    try {
      const prompt = `As an environmental scientist, calculate CO2 emissions in kg for ${vehicle} traveling ${distance}km.
        Use standard emission factors and respond ONLY with a number. Example format: 12.5
        Vehicle types and their average emission factors:
        - Car: 0.12 kg/km
        - Bus: 0.06 kg/km
        - Train: 0.035 kg/km 
        - Plane: 0.18 kg/km
        Formula: (distance * emission factor). Return only the number.`;

      const result = await this.calculationModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      const co2 = parseFloat(text.match(/\d+\.?\d*/)[0]);
      
      if (isNaN(co2)) {
        throw new Error('Invalid numerical response');
      }
      
      return co2;
    } catch (error) {
      logger.error(`Gemini Calculation Error: ${error.message}`);
      
      // Fallback to local calculation
      const localResult = this.#localCalculation(vehicle, distance);
      logger.warn(`Using local calculation: ${localResult}`);
      
      return localResult;
    }
  }

  async getRecommendations(co2, vehicle, distance) {
    try {
      const prompt = `Generate 3 practical recommendations to reduce ${co2}kg CO2 emissions 
        from ${vehicle} travel over ${distance}km. Use bullet points with concise, 
        actionable advice. Format each item starting with • and avoid markdown.`;

      const result = await this.recommendationModel.generateContent(prompt);
      const response = await result.response;
      
      return response.text()
        .replace(/\*\*/g, '')
        .replace(/#/g, '')
        .trim();
    } catch (error) {
      logger.error(`Gemini Recommendation Error: ${error.message}`);
      throw new HTTPError(500, 'Failed to generate recommendations');
    }
  }

  // Local fallback calculation
  #localCalculation(vehicle, distance) {
    const emissionFactors = {
      car: 0.12,
      bus: 0.06,
      train: 0.035,
      plane: 0.18
    };
    
    return (emissionFactors[vehicle.toLowerCase()] || 0.12) * distance;
  }
}