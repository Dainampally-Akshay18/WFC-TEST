import { Router } from 'express';
import userController from './user.controller.js';

const userRouter = Router();

// TODO: Register routes
// userRouter.get('/profile', authMiddleware, userController.getProfile);
// userRouter.put('/profile', authMiddleware, userController.updateProfile);
// userRouter.get('/', authMiddleware, roleMiddleware(['MASTER_ADMIN']), userController.getAllUsers);
// userRouter.delete('/:id', authMiddleware, roleMiddleware(['MASTER_ADMIN']), userController.deleteUser);

export default userRouter;
