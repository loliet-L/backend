import { validationResult } from 'express-validator';
import { HTTPError } from '../utils/helpers.js';

export const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => err.msg);
      return next(new HTTPError(400, messages.join(', ')));
    }

    next();
  };
};