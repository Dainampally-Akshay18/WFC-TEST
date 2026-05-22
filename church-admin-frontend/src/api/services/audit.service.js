import axiosClient from '../client/axiosClient';
import { AUDIT_ENDPOINTS } from '../endpoints/audit.endpoints';

export const auditService = {
  getAuditLogs: (params) => axiosClient.get(AUDIT_ENDPOINTS.LIST, { params }),
  
  getAuditLog: (id) => axiosClient.get(AUDIT_ENDPOINTS.GET(id)),
  
  exportAuditLogs: (params) => axiosClient.get(AUDIT_ENDPOINTS.EXPORT, { params, responseType: 'blob' }),
};
