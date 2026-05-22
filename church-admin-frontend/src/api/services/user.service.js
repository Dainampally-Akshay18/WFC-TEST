import axiosClient from '../client/axiosClient';
import { USER_ENDPOINTS } from '../endpoints/user.endpoints';

export const userService = {
  getUsers: (params) => axiosClient.get(USER_ENDPOINTS.LIST, { params }),
  
  getUser: (id) => axiosClient.get(USER_ENDPOINTS.GET(id)),
  
  approveUser: (id) => axiosClient.put(USER_ENDPOINTS.UPDATE_STATUS(id), { status: 'APPROVED' }),
  
  rejectUser: (id) => axiosClient.put(USER_ENDPOINTS.UPDATE_STATUS(id), { status: 'REJECTED' }),
  
  deleteUser: (id) => axiosClient.delete(USER_ENDPOINTS.DELETE(id)),
};
