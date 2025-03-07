export class HTTPError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.name = 'HTTPError';
      this.statusCode = statusCode;
    }
  }
  
  export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };