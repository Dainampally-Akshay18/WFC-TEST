/**
 * ============================================
 * ROLE MIDDLEWARE
 * ============================================
 * 
 * Restricts access to specific user roles
 * Must be used AFTER authMiddleware
 */

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
        },
      });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions for this action',
        },
      });
    }

    next();
  };
};

export default roleMiddleware;
