import { Router } from 'express';
import sermonController from './sermon.controller.js';

const sermonRouter = Router();

// TODO: Register routes
// sermonRouter.post('/', authMiddleware, sermonController.createSermon);
// sermonRouter.get('/:id', sermonController.getSermon);
// sermonRouter.get('/', sermonController.getAllSermons);
// sermonRouter.put('/:id', authMiddleware, sermonController.updateSermon);
// sermonRouter.delete('/:id', authMiddleware, sermonController.deleteSermon);

export default sermonRouter;
