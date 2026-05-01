import { Router } from 'express';
import eventController from './event.controller.js';

const eventRouter = Router();

// TODO: Register routes
// eventRouter.post('/', authMiddleware, eventController.createEvent);
// eventRouter.get('/:id', eventController.getEvent);
// eventRouter.get('/', eventController.getAllEvents);
// eventRouter.put('/:id', authMiddleware, eventController.updateEvent);
// eventRouter.delete('/:id', authMiddleware, eventController.deleteEvent);

export default eventRouter;
