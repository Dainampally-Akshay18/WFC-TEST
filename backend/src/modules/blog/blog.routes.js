import { Router } from 'express';
import blogController from './blog.controller.js';

const blogRouter = Router();

// TODO: Register routes
// blogRouter.post('/', authMiddleware, blogController.createBlog);
// blogRouter.get('/:id', blogController.getBlog);
// blogRouter.get('/', blogController.getAllBlogs);
// blogRouter.put('/:id', authMiddleware, blogController.updateBlog);
// blogRouter.delete('/:id', authMiddleware, blogController.deleteBlog);

export default blogRouter;
