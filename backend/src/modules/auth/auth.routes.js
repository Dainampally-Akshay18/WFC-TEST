import { Router } from 'express';
import authController from './auth.controller.js';
import authValidation from './auth.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import {validateRequest} from '../../middleware/validate.middleware.js';

const authRouter = Router();

/**
 * ============================================
 * PUBLIC ROUTES (No authentication required)
 * ============================================
 */

/**
 * POST /api/auth/signup
 * Create new user account
 */
authRouter.post(
  '/signup',
  validateRequest(authValidation.signupSchema),
  authController.signup
);

/**
 * POST /api/auth/login
 * Authenticate user and get JWT token
 */
authRouter.post(
  '/login',
  validateRequest(authValidation.loginSchema),
  authController.login
);

/**
 * POST /api/auth/forgot-password
 * Request password reset link
 */
authRouter.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * POST /api/auth/reset-password/:token
 * Reset password with valid token
 */
authRouter.post(
  '/reset-password/:token',
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword
);

/**
 * ============================================
 * PROTECTED ROUTES (Authentication required)
 * ============================================
 */

/**
 * GET /api/auth/me
 * Get current user profile
 */
authRouter.get(
  '/me',
  authMiddleware,
  authController.getCurrentUser
);

/**
 * PUT /api/auth/profile
 * Update current user profile
 */
authRouter.put(
  '/profile',
  authMiddleware,
  validateRequest(authValidation.updateProfileSchema),
  authController.updateProfile
);

/**
 * ============================================
 * ADMIN ROUTES (MASTER_ADMIN only)
 * ============================================
 */

/**
 * GET /api/auth/pending-users
 * Get all pending user approvals
 */
authRouter.get(
  '/pending-users',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  authController.getPendingUsers
);

/**
 * GET /api/auth/user/:userId
 * Get user by ID
 */
authRouter.get(
  '/user/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  authController.getUserById
);

/**
 * PUT /api/auth/approve-user/:userId
 * Approve pending user
 */
authRouter.put(
  '/approve-user/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  authController.approveUser
);

/**
 * PUT /api/auth/reject-user/:userId
 * Reject pending user
 */
authRouter.put(
  '/reject-user/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validateRequest(authValidation.rejectUserSchema),
  authController.rejectUser
);

/**
 * PUT /api/auth/promote-user/:userId
 * Promote USER to LEADER
 */
authRouter.put(
  '/promote-user/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  authController.promoteUser
);

export default authRouter;
