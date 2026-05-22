import axiosClient from '../client/axiosClient';
import { USER_ENDPOINTS } from '../endpoints/user.endpoints';

export const userService = {
  getUsers: (params) => axiosClient.get(USER_ENDPOINTS.LIST, { params }),
  
  getUser: (id) => axiosClient.get(USER_ENDPOINTS.GET(id)),
  
  createUser: (userData) => axiosClient.post(USER_ENDPOINTS.CREATE, userData),
  
  updateUser: (id, userData) => axiosClient.put(USER_ENDPOINTS.UPDATE(id), userData),
  
  deleteUser: (id) => axiosClient.delete(USER_ENDPOINTS.DELETE(id)),
  
  approveUser: (id) => axiosClient.post(USER_ENDPOINTS.APPROVE(id)),
  
  rejectUser: (id) => axiosClient.post(USER_ENDPOINTS.REJECT(id)),
  
  changeRole: (id, role) => axiosClient.patch(USER_ENDPOINTS.CHANGE_ROLE(id), { role }),
  
  changeStatus: (id, status) => axiosClient.patch(USER_ENDPOINTS.CHANGE_STATUS(id), { status }),
};
