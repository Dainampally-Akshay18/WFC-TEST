import { Router } from 'express';
import prayerController from './prayer.controller.js';
import prayerValidation from './prayer.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

const prayerRouter = Router();

/**
 * ============================================
 * PRAYER ROUTES
 * ============================================
 *
 * All prayer endpoints with proper middleware
 * and role-based access control
 */

/**
 * ============================================
 * PUBLIC ROUTES (No auth required)
 * ============================================
 */

/**
 * 📖 GET /api/prayers
 * Get all prayer requests (newest first)
 * Returns: all prayers with prayerCount and hasPrayed flag
 */
prayerRouter.get('/', authMiddleware, prayerController.getAllPrayers);

/**
 * 🔍 GET /api/prayers/:id
 * Get specific prayer request by ID
 * Returns: prayer with prayerCount and hasPrayed flag
 */
prayerRouter.get('/:id', authMiddleware, prayerController.getPrayerById);

/**
 * ============================================
 * PROTECTED ROUTES (Authentication required)
 * ============================================
 */

/**
 * 🙏 POST /api/prayers
 * Create new prayer request
 * Rules:
 * - User must be authenticated
 * - Can create normal or anonymous prayers
 * - createdBy = current user
 * - creatorName = user.name (or "Anonymous" if isAnonymous=true)
 * - Default status = "ACTIVE"
 */
prayerRouter.post(
  '/',
  authMiddleware,
  validateRequest(prayerValidation.createPrayerSchema),
  prayerController.createPrayer
);

/**
 * ✏️ PUT /api/prayers/:id
 * Update prayer request
 * Rules:
 * - USER: only own prayers
 * - LEADER/MASTER_ADMIN: any prayer
 */
prayerRouter.put(
  '/:id',
  authMiddleware,
  validateRequest(prayerValidation.updatePrayerSchema),
  prayerController.updatePrayer
);

/**
 * ❌ DELETE /api/prayers/:id
 * Delete prayer request
 * Rules:
 * - USER: only own prayers
 * - LEADER/MASTER_ADMIN: any prayer
 */
prayerRouter.delete('/:id', authMiddleware, prayerController.deletePrayer);

/**
 * 🔄 PATCH /api/prayers/:id/status
 * Update prayer status (LEADER/MASTER_ADMIN only)
 * Rules:
 * - Only LEADER and MASTER_ADMIN can change status
 * - Allowed statuses: ACTIVE, PRAYED, ARCHIVED
 */
prayerRouter.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(prayerValidation.updateStatusSchema),
  prayerController.updatePrayerStatus
);

/**
 * 🙏 POST /api/prayers/:id/pray
 * Toggle "I Prayed" (VERY IMPORTANT)
 * Rules:
 * - User must be authenticated
 * - Implements toggle behavior:
 *   - If not prayed: add to prayedBy, increment count, send notification
 *   - If already prayed: remove from prayedBy, decrement count
 * - Don't notify user for their own prayer
 *
 * Response includes:
 * - Prayer data
 * - hasPrayed: current user's prayed status
 * - prayerCount: updated count
 */
prayerRouter.post('/:id/pray', authMiddleware, prayerController.togglePrayed);

export default prayerRouter;
