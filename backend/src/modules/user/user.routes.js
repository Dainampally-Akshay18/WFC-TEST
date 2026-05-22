import { Router } from 'express';
import userController from './user.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import validate from '../../middleware/requestValidator.middleware.js';
import userValidation from './user.validation.js';

const userRouter = Router();

/**
 * ============================================
 * USER MANAGEMENT ROUTES
 * MASTER_ADMIN only
 * ============================================
 */

/**
 * GET /api/users
 * Get all users with filters & pagination
 */
userRouter.get(
  '/',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validate(userValidation.getUsersQuerySchema, 'query'),
  userController.getAllUsers
);

/**
 * GET /api/users/:userId
 * Get single user details
 */
userRouter.get(
  '/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validate(userValidation.userIdParamSchema, 'params'),
  userController.getUserById
);

/**
 * PUT /api/users/:userId
 * Update user details
 */
userRouter.put(
  '/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validate(userValidation.userIdParamSchema, 'params'),
  validate(userValidation.updateUserSchema, 'body'),
  userController.updateUser
);

/**
 * DELETE /api/users/:userId
 * Delete user
 */
userRouter.delete(
  '/:userId',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validate(userValidation.userIdParamSchema, 'params'),
  userController.deleteUser
);

export default userRouter;