import { Router } from 'express';
import eventController from './event.controller.js';
import eventValidation from './event.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

const eventRouter = Router();

/**
 * GET /api/events
 * Get all events (role-filtered)
 * Protected: needs auth to filter by user's branch
 */
eventRouter.get('/', authMiddleware, eventController.getEvents);

/**
 * GET /api/events/:id
 * Get single event (with permission check)
 */
eventRouter.get('/:id', authMiddleware, eventController.getEventById);

/**
 * ============================================
 * PROTECTED ROUTES (Authentication required)
 * ============================================
 */

/**
 * POST /api/events
 * Create event
 * USER: only BRANCH events for their branch
 * LEADER: BRANCH + GLOBAL events
 * MASTER_ADMIN: any event
 */
eventRouter.post(
  '/',
  authMiddleware,
  validateRequest(eventValidation.createEventSchema),
  eventController.createEvent
);

/**
 * PUT /api/events/:id
 * Update event
 * USER: own events only
 * LEADER: own branch events
 * MASTER_ADMIN: any event
 */
eventRouter.put(
  '/:id',
  authMiddleware,
  validateRequest(eventValidation.updateEventSchema),
  eventController.updateEvent
);

/**
 * DELETE /api/events/:id
 * Delete event
 * Same permission rules as update
 */
eventRouter.delete('/:id', authMiddleware, eventController.deleteEvent);

export default eventRouter;
