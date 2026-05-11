import jwt from 'jsonwebtoken';

/**
 * ============================================
 * AUTH MIDDLEWARE
 * ============================================
 * 
 * Verifies JWT token and attaches user to request
 */

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No authorization header provided',
        },
      });
    }

    // Token format: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid authorization header format',
        },
      });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
        },
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication failed',
      },
    });
  }
};

export default authMiddleware;
