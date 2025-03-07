import { HTTPError } from '../utils/helpers.js';

// In-memory store for demonstration (replace with database in production)
let calculations = [];

export class CalculationService {
  getHistory() {
    return calculations;
  }

  addCalculation(entry) {
    if (!entry.vehicle || !entry.distance || !entry.co2) {
      throw new HTTPError(400, 'Invalid calculation data');
    }
    
    const newEntry = {
      ...entry,
      id: calculations.length + 1,
      timestamp: new Date().toISOString()
    };
    
    calculations = [newEntry, ...calculations].slice(0, 50); // Keep last 50 entries
    return newEntry;
  }
}