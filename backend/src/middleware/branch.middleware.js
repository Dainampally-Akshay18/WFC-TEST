/**
 * ============================================
 * BRANCH MIDDLEWARE
 * ============================================
 * 
 * Ensures users can only access their branch data
 * MASTER_ADMIN can access all branches
 */

export const checkBranch = (allowCrossBranch = false) => {
  return (req, res, next) => {
    const user = req.user;

    // MASTER_ADMIN can access all branches
    if (user.role === 'MASTER_ADMIN') {
      return next();
    }

    // Extract branch from request (query, params, or body)
    const requestBranch = req.query.branch || req.params.branch || req.body?.branch;

    // If no branch specified in request, allow (might be user's own data)
    if (!requestBranch) {
      return next();
    }

    // Check if user's branch matches request branch
    if (user.branch !== requestBranch && !allowCrossBranch) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this branch',
        },
      });
    }

    next();
  };
};

export default checkBranch;
