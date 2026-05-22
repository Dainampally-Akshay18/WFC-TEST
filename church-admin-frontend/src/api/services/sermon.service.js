import axiosClient from '../client/axiosClient';
import { SERMON_ENDPOINTS } from '../endpoints/sermon.endpoints';

export const sermonService = {
  getSermons: (params) => axiosClient.get(SERMON_ENDPOINTS.LIST, { params }),
  
  getSermon: (id) => axiosClient.get(SERMON_ENDPOINTS.GET(id)),
  
  createSermon: (sermonData) => axiosClient.post(SERMON_ENDPOINTS.CREATE, sermonData),
  
  updateSermon: (id, sermonData) => axiosClient.put(SERMON_ENDPOINTS.UPDATE(id), sermonData),
  
  deleteSermon: (id) => axiosClient.delete(SERMON_ENDPOINTS.DELETE(id)),
  
  getCategories: () => axiosClient.get(SERMON_ENDPOINTS.CATEGORIES),
};
