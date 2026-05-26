import axiosClient from '../client/axiosClient';
import { SERMON_ENDPOINTS } from '../endpoints/sermon.endpoints';

export const sermonService = {
  // Sermon methods
  getSermons: (params) => axiosClient.get(SERMON_ENDPOINTS.LIST, { params }),
  
  getSermon: (id) => axiosClient.get(SERMON_ENDPOINTS.GET(id)),
  
  createSermon: (sermonData) => axiosClient.post(SERMON_ENDPOINTS.CREATE, sermonData),
  
  updateSermon: (id, sermonData) => axiosClient.put(SERMON_ENDPOINTS.UPDATE(id), sermonData),
  
  deleteSermon: (id) => axiosClient.delete(SERMON_ENDPOINTS.DELETE(id)),
  
  publishSermon: (id) => axiosClient.patch(SERMON_ENDPOINTS.PUBLISH(id)),
  
  unpublishSermon: (id) => axiosClient.patch(SERMON_ENDPOINTS.UNPUBLISH(id)),

  // Category methods
  getCategories: (params) => axiosClient.get(SERMON_ENDPOINTS.CATEGORIES_LIST, { params }),
  
  getCategory: (id) => axiosClient.get(SERMON_ENDPOINTS.CATEGORIES_GET(id)),
  
  createCategory: (categoryData) => axiosClient.post(SERMON_ENDPOINTS.CATEGORIES_CREATE, categoryData),
  
  updateCategory: (id, categoryData) => axiosClient.put(SERMON_ENDPOINTS.CATEGORIES_UPDATE(id), categoryData),
  
  deleteCategory: (id) => axiosClient.delete(SERMON_ENDPOINTS.CATEGORIES_DELETE(id)),
};
