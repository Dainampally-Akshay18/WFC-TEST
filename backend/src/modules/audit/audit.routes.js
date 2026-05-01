import { Router } from 'express';
import auditController from './audit.controller.js';

const auditRouter = Router();

// TODO: Register routes
// auditRouter.get('/', authMiddleware, roleMiddleware(['MASTER_ADMIN']), auditController.getAuditLogs);
// auditRouter.get('/:id', authMiddleware, roleMiddleware(['MASTER_ADMIN']), auditController.getAuditLogById);
// auditRouter.post('/filter', authMiddleware, roleMiddleware(['MASTER_ADMIN']), auditController.filterAuditLogs);

export default auditRouter;
