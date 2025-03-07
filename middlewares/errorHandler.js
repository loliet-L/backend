import logger from '../config/logger.js';
import { HTTPError } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HTTPError) {
    logger.warn(`Client Error: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  logger.error(`Server Error: ${err.stack}`);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};