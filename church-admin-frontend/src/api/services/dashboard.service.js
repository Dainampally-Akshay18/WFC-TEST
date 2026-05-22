import axiosClient from '../client/axiosClient';
import { DASHBOARD_ENDPOINTS } from '../endpoints/dashboard.endpoints';

export const dashboardService = {
  getOverview: () => axiosClient.get(DASHBOARD_ENDPOINTS.OVERVIEW),
  
  getAnalytics: (params) => axiosClient.get(DASHBOARD_ENDPOINTS.ANALYTICS, { params }),
  
  getReports: (params) => axiosClient.get(DASHBOARD_ENDPOINTS.REPORTS, { params }),
  
  getRecentActivities: (params) => axiosClient.get(DASHBOARD_ENDPOINTS.RECENT_ACTIVITIES, { params }),
};
