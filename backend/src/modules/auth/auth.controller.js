import authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * AUTH CONTROLLER - HANDLES HTTP REQUESTS
 * ============================================
 * 
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 */

export const authController = {
  /**
   * 📝 POST /auth/signup
   * Create new user account
   */
  signup: asyncHandler(async (req, res, next) => {
    const { name, email, password, branch } = req.body;

    const result = await authService.signup(name, email, password, branch);

    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 🔐 POST /auth/login
   * Authenticate user and return JWT token
   */
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📧 POST /auth/forgot-password
   * Request password reset link
   */
  forgotPassword: asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 🔑 POST /auth/reset-password/:token
   * Reset password with valid token
   */
  resetPassword: asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * ✅ PUT /auth/approve-user/:userId
   * Admin approves pending user (MASTER_ADMIN only)
   */
  approveUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.user.userId; // From auth middleware

    const result = await authService.approveUser(userId, adminId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * ❌ PUT /auth/reject-user/:userId
   * Admin rejects pending user (MASTER_ADMIN only)
   */
  rejectUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId;

    const result = await authService.rejectUser(userId, adminId, reason);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 🔄 PUT /auth/promote-user/:userId
   * Promote USER to LEADER (MASTER_ADMIN only)
   */
  promoteUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.user.userId;

    const result = await authService.promoteUser(userId, adminId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📊 GET /auth/pending-users
   * Get all pending user approvals (MASTER_ADMIN only)
   */
  getPendingUsers: asyncHandler(async (req, res, next) => {
    const result = await authService.getPendingUsers();

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 👤 GET /auth/me
   * Get current user profile
   */
  getCurrentUser: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId; // From auth middleware

    const user = await authService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  /**
   * 👤 GET /auth/user/:userId
   * Get user by ID (admin only)
   */
  getUserById: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await authService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  /**
   * 📝 PUT /auth/profile
   * Update current user profile
   */
  updateProfile: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId; // From auth middleware
    const updateData = req.body;

    const result = await authService.updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),
};

export default authController;
