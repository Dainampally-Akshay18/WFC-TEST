import axiosClient from '../client/axiosClient';
import { AUDIT_ENDPOINTS } from '../endpoints/audit.endpoints';

export const dashboardService = {
  getStatistics: () => axiosClient.get(AUDIT_ENDPOINTS.STATISTICS),
};
