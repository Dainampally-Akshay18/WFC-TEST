import prayerService from './prayer.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * PRAYER CONTROLLER - HTTP HANDLERS
 * ============================================
 *
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 */

export const prayerController = {
  /**
   * 🙏 POST /api/prayers
   * Create new prayer request
   */
  createPrayer: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await prayerService.createPrayer(
      req.body,
      userId,
      userRole
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Prayer request created successfully',
    });
  }),

  /**
   * 📖 GET /api/prayers
   * Get all prayer requests (newest first)
   */
  getAllPrayers: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;

    const result = await prayerService.getAllPrayers(userId);

    res.status(200).json({
      success: true,
      data: result,
      count: result.length,
    });
  }),

  /**
   * 🔍 GET /api/prayers/:id
   * Get specific prayer request by ID
   */
  getPrayerById: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await prayerService.getPrayerById(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * ✏️ PUT /api/prayers/:id
   * Update prayer request
   * USER: only own prayers
   * LEADER/MASTER_ADMIN: any prayer
   */
  updatePrayer: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await prayerService.updatePrayer(
      id,
      req.body,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Prayer request updated successfully',
    });
  }),

  /**
   * ❌ DELETE /api/prayers/:id
   * Delete prayer request
   * USER: only own prayers
   * LEADER/MASTER_ADMIN: any prayer
   */
  deletePrayer: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await prayerService.deletePrayer(id, userId, userRole);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 🔄 PATCH /api/prayers/:id/status
   * Update prayer status (LEADER/MASTER_ADMIN only)
   * Allowed statuses: ACTIVE, PRAYED, ARCHIVED
   */
  updatePrayerStatus: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await prayerService.updatePrayerStatus(
      id,
      status,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Prayer status updated successfully',
    });
  }),

  /**
   * 🙏 POST /api/prayers/:id/pray
   * Toggle "I Prayed" (VERY IMPORTANT)
   * Implements toggle behavior with duplicate prevention
   *
   * If user hasn't prayed:
   * - Add to prayedBy array
   * - Increment prayerCount
   * - Send notification to creator
   *
   * If user already prayed:
   * - Remove from prayedBy array
   * - Decrement prayerCount
   */
  togglePrayed: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await prayerService.togglePrayed(id, userId, userRole);

    res.status(200).json({
      success: true,
      data: result,
      message: result.hasPrayed
        ? 'Thank you for praying!'
        : 'You have removed your prayer',
    });
  }),
};

export default prayerController;
