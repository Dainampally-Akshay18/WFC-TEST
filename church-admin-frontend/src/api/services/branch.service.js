import axiosClient from '../client/axiosClient';
import { BRANCH_ENDPOINTS } from '../endpoints/branch.endpoints';

export const branchService = {
  getBranches: (params) => axiosClient.get(BRANCH_ENDPOINTS.LIST, { params }),
  
  getBranch: (id) => axiosClient.get(BRANCH_ENDPOINTS.GET(id)),
  
  createBranch: (branchData) => axiosClient.post(BRANCH_ENDPOINTS.CREATE, branchData),
  
  updateBranch: (id, branchData) => axiosClient.put(BRANCH_ENDPOINTS.UPDATE(id), branchData),
  
  deleteBranch: (id) => axiosClient.delete(BRANCH_ENDPOINTS.DELETE(id)),
};
