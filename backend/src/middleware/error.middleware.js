/**
 * ============================================
 * ERROR MIDDLEWARE
 * ============================================
 * 
 * Centralized error handling for all routes
 */

export const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Get status code and message
  const status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation Error',
        details: errors,
      },
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: `${field} already exists`,
      },
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        status: 401,
        message: 'Invalid token',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        status: 401,
        message: 'Token expired',
      },
    });
  }

  // Standard error response
  res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
  });
};

export default errorMiddleware;
