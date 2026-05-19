import auditService from './audit.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * AUDIT CONTROLLER - HTTP HANDLERS
 * ============================================
 *
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 * - No database logic here
 */

export const auditController = {
  /**
   * 📖 GET /api/audit
   * Get audit logs with pagination and filtering
   *
   * Query params:
   * - page: page number (default: 1)
   * - limit: results per page (default: 20, max: 100)
   * - action: filter by action
   * - performerRole: filter by performer role
   * - targetType: filter by target type
   * - branch: filter by branch (MASTER_ADMIN only)
   * - startDate: filter from date (ISO string)
   * - endDate: filter to date (ISO string)
   */
  getAuditLogs: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const userBranch = req.user.branch;

    const options = {
      page: req.query.page,
      limit: req.query.limit,
      action: req.query.action,
      performerRole: req.query.performerRole,
      targetType: req.query.targetType,
      branch: req.query.branch,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await auditService.getAuditLogs(
      userId,
      userRole,
      userBranch,
      options
    );

    res.status(200).json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
      message: 'Audit logs retrieved successfully',
    });
  }),

  /**
   * 📖 GET /api/audit/:id
   * Get single audit log by ID
   */
  getAuditLogById: asyncHandler(async (req, res, next) => {
    const auditId = req.params.id;
    const userRole = req.user.role;
    const userBranch = req.user.branch;

    const result = await auditService.getAuditLogById(
      auditId,
      userRole,
      userBranch
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Audit log retrieved successfully',
    });
  }),

  /**
   * 📊 GET /api/audit/statistics
   * Get audit statistics and summary
   *
   * Query params:
   * - startDate: filter from date
   * - endDate: filter to date
   * - branch: filter by branch (MASTER_ADMIN only)
   */
  getAuditStatistics: asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;
    const userBranch = req.user.branch;

    const options = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      branch: req.query.branch,
    };

    const result = await auditService.getAuditStatistics(
      userRole,
      userBranch,
      options
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Audit statistics retrieved successfully',
    });
  }),
};

export default auditController;
