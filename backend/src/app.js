

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import middleware
import authMiddleware from './middleware/auth.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

// console.log('📍 app.js loaded');
// try {
//   console.log('📍 importing auth routes...');
//   import authRouter from './modules/auth/auth.routes.js';
//   console.log('✅ auth routes imported successfully');
// } catch(e) {
//   console.error('❌ Auth routes import failed:', e.message);
//   console.error(e.stack);
// }

// Import routes
import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/user/user.routes.js';
import eventRouter from './modules/event/event.routes.js';
import sermonRouter from './modules/sermon/sermon.routes.js';
import prayerRouter from './modules/prayer/prayer.routes.js';
import blogRouter from './modules/blog/blog.routes.js';
import { notificationRouter } from './modules/notification/notification.routes.js';
import auditRouter from './modules/audit/audit.routes.js';

dotenv.config();

const app = express();

// ============= MIDDLEWARE =============

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS middleware
app.use(cors());

// Request logging (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============= HEALTH CHECK =============

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// ============= API ROUTES =============


// Auth routes (public)
app.use('/api/auth', authRouter);

// Protected routes (require authentication)
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/events', eventRouter);
app.use('/api/sermons', sermonRouter);
app.use('/api/prayers', prayerRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/notifications', authMiddleware, notificationRouter);
app.use('/api/audit', authMiddleware, auditRouter);

// ============= 404 HANDLER =============

app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Route not found',
    },
  });
});

// ============= ERROR MIDDLEWARE =============

app.use(errorMiddleware);

export default app;
