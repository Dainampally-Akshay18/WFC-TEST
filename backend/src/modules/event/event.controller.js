import eventService from './event.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * EVENT CONTROLLER - HANDLES HTTP REQUESTS
 * ============================================
 * 
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 * - Uses asyncHandler to catch errors
 */

export const eventController = {
  /**
   * 📝 POST /api/events
   * Create event
   * All roles can create with visibility/branch rules
   */
  createEvent: asyncHandler(async (req, res, next) => {
    const { title, description, date, time, location, visibility, branch } = req.body;
    
    // DEBUG
    console.log('🔍 req.user:', JSON.stringify(req.user, null, 2));
    console.log('🔍 req.user keys:', req.user ? Object.keys(req.user) : 'undefined');
    
    // Try both userId and _id
    const userId = req.user?._id || req.user?.userId;
    const userRole = req.user?.role;
    const userBranch = req.user?.branch;

    console.log('📝 Extracted - userId:', userId, 'role:', userRole, 'branch:', userBranch);

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        error: { message: 'Missing user info in token' },
      });
    }

    const result = await eventService.createEvent(
      { title, description, date, time, location, visibility, branch },
      userId,
      userRole,
      userBranch
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  }),
  /**
   * 📝 PUT /api/events/:id
   * Update event
   * USER: own events only
   * LEADER: own branch events
   * MASTER_ADMIN: any event
   */
  updateEvent: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, date, time, location, visibility, branch } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const userBranch = req.user.branch;

    const result = await eventService.updateEvent(
      id,
      { title, description, date, time, location, visibility, branch },
      userId,
      userRole,
      userBranch
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * ❌ DELETE /api/events/:id
   * Delete event
   * Same permission rules as update
   */
  deleteEvent: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const userBranch = req.user.branch;

    const result = await eventService.deleteEvent(id, userId, userRole, userBranch);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📖 GET /api/events
   * Get all events
   * Role-filtered: GLOBAL + own branch
   * Public access for authenticated users
   */
  getEvents: asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role || 'USER';
    const userBranch = req.user?.branch || null;

    const events = await eventService.getEvents(userRole, userBranch);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  }),

  /**
   * 📖 GET /api/events/:id
   * Get single event
   * Respects visibility + branch permissions
   */
  getEventById: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userRole = req.user?.role || 'USER';
    const userBranch = req.user?.branch || null;

    const event = await eventService.getEventById(id, userRole, userBranch);

    res.status(200).json({
      success: true,
      data: event,
    });
  }),
};

export default eventController;
