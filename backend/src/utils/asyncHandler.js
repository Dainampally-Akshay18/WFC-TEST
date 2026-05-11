/**
 * ============================================
 * ASYNC HANDLER
 * ============================================
 * 
 * Wraps async route handlers to catch errors
 * Eliminates need for try/catch in every controller
 */

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Create error object with proper status
      const err = new Error(error.message);
      err.status = error.status || 500;
      next(err);
    });
  };
};

export default asyncHandler;
