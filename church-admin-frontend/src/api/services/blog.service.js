import axiosClient from '../client/axiosClient';
import { BLOG_ENDPOINTS } from '../endpoints/blog.endpoints';

export const blogService = {
  getBlogs: (params) => axiosClient.get(BLOG_ENDPOINTS.LIST, { params }),
  
  getBlog: (id) => axiosClient.get(BLOG_ENDPOINTS.GET(id)),
  
  createBlog: (blogData) => axiosClient.post(BLOG_ENDPOINTS.CREATE, blogData),
  
  updateBlog: (id, blogData) => axiosClient.put(BLOG_ENDPOINTS.UPDATE(id), blogData),
  
  deleteBlog: (id) => axiosClient.delete(BLOG_ENDPOINTS.DELETE(id)),
  
  publishBlog: (id) => axiosClient.post(BLOG_ENDPOINTS.PUBLISH(id)),
  
  unpublishBlog: (id) => axiosClient.post(BLOG_ENDPOINTS.UNPUBLISH(id)),
};
