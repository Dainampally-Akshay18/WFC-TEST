import { Router } from 'express';
import notificationController from './notification.controller.js';

const notificationRouter = Router();

// TODO: Register routes
// notificationRouter.get('/', authMiddleware, notificationController.getNotifications);
// notificationRouter.put('/:id/read', authMiddleware, notificationController.markAsRead);
// notificationRouter.delete('/:id', authMiddleware, notificationController.deleteNotification);
// notificationRouter.delete('/', authMiddleware, notificationController.clearAllNotifications);

export default notificationRouter;
