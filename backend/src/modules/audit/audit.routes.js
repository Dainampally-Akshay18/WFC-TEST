import { Router } from 'express';
import auditController from './audit.controller.js';
import auditValidation from './audit.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

const auditRouter = Router();

/**
 * ============================================
 * AUDIT API ROUTES
 * ============================================
 *
 * All routes are READ-ONLY
 * Audit logs are immutable (no create/update/delete endpoints)
 *
 * Access Control:
 * - MASTER_ADMIN: Can see ALL logs
 * - LEADER: Can see logs for their branch + global logs
 * - USER: No access (403)
 */

/**
 * GET /api/audit
 * Get audit logs with pagination and filtering
 * Protected: LEADER, MASTER_ADMIN only
 *
 * Query Parameters:
 * - page: page number (default: 1)
 * - limit: results per page (default: 20, max: 100)
 * - action: filter by action (CREATE_EVENT, UPDATE_BLOG, etc.)
 * - performerRole: filter by performer role (USER, LEADER, MASTER_ADMIN)
 * - targetType: filter by target type (USER, BLOG, EVENT, PRAYER, SERMON, etc.)
 * - branch: filter by branch (MASTER_ADMIN only)
 * - startDate: filter from date (ISO string)
 * - endDate: filter to date (ISO string)
 *
 * Examples:
 * GET /api/audit
 * GET /api/audit?page=1&limit=20
 * GET /api/audit?action=CREATE_BLOG
 * GET /api/audit?performerRole=LEADER&startDate=2024-01-01T00:00:00Z
 * GET /api/audit?targetType=EVENT&branch=BRANCH1
 */
auditRouter.get(
  '/',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(auditValidation.getAuditLogsSchema),
  auditController.getAuditLogs
);

/**
 * GET /api/audit/statistics
 * Get audit statistics and summary
 * Protected: LEADER, MASTER_ADMIN only
 *
 * Query Parameters:
 * - startDate: filter from date (ISO string)
 * - endDate: filter to date (ISO string)
 * - branch: filter by branch (MASTER_ADMIN only)
 *
 * Returns:
 * - totalLogs: total number of logs
 * - actionBreakdown: count by action
 * - roleBreakdown: count by performer role
 * - targetTypeBreakdown: count by target type
 *
 * Example:
 * GET /api/audit/statistics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
 */
auditRouter.get(
  '/statistics',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(auditValidation.getAuditStatisticsSchema),
  auditController.getAuditStatistics
);

/**
 * GET /api/audit/:id
 * Get single audit log by ID
 * Protected: LEADER, MASTER_ADMIN only
 * Access Control: LEADER can only see logs for their branch
 */
auditRouter.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  auditController.getAuditLogById
);

export default auditRouter;
