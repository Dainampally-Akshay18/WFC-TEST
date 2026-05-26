import axiosClient from '../client/axiosClient';
import { AUDIT_ENDPOINTS } from '../endpoints/audit.endpoints';

export const auditService = {
  // Fetch ALL audit logs — send limit=100 to get max results
  getAllLogs: async () => {
    try {
      const res = await axiosClient.get(AUDIT_ENDPOINTS.LIST, {
        params: { limit: 100 }
      });

      // Debug: log the raw response to identify the exact structure
      console.log('[AuditService] Raw API response:', JSON.stringify(res, null, 2));

      // The responseInterceptor unwraps axios response.data,
      // so res could be:
      //   Shape A: { success: true, data: { logs: [...], pagination: {...} } }
      //   Shape B: { logs: [...], pagination: {...} }  (if double-unwrapped)
      //   Shape C: [...] (if already the array)

      // Handle all possible shapes
      let logs = [];

      if (Array.isArray(res)) {
        // Shape C: response is already the logs array
        logs = res;
      } else if (Array.isArray(res?.data?.logs)) {
        // Shape A: { success, data: { logs: [...] } }
        logs = res.data.logs;
      } else if (Array.isArray(res?.logs)) {
        // Shape B: { logs: [...] }
        logs = res.logs;
      } else if (Array.isArray(res?.data)) {
        // Shape D: { data: [...] } — data is the array itself
        logs = res.data;
      } else if (res?.data?.data && Array.isArray(res.data.data.logs)) {
        // Shape E: double nested { data: { data: { logs: [...] } } }
        logs = res.data.data.logs;
      }

      console.log('[AuditService] Extracted logs count:', logs.length);
      return logs;
    } catch (err) {
      console.error('[AuditService] getAllLogs error:', err);
      throw err;
    }
  },

  getAuditLog: async (id) => {
    try {
      const res = await axiosClient.get(AUDIT_ENDPOINTS.GET(id));
      return res?.data?.log || res?.log || res?.data?.data?.log || null;
    } catch (err) {
      console.error('[AuditService] getAuditLog error:', err);
      throw err;
    }
  },

  getStatistics: async () => {
    try {
      const res = await axiosClient.get(AUDIT_ENDPOINTS.STATISTICS);
      console.log('[AuditService] Statistics response:', JSON.stringify(res, null, 2));
      // Same pattern as statistics which is working — res.data gives the stats object
      return res?.data || res || null;
    } catch (err) {
      console.error('[AuditService] getStatistics error:', err);
      throw err;
    }
  },

  exportAuditLogs: (params) => axiosClient.get(AUDIT_ENDPOINTS.EXPORT, { params, responseType: 'blob' }),
};
