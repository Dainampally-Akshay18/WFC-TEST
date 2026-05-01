import { Router } from 'express';
import authController from './auth.controller.js';

const authRouter = Router();

// TODO: Register routes
// authRouter.post('/register', authController.register);
// authRouter.post('/login', authController.login);
// authRouter.post('/logout', authMiddleware, authController.logout);
// authRouter.post('/refresh-token', authController.refreshToken);

export default authRouter;
