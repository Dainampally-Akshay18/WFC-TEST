export const PRAYER_ENDPOINTS = {
  LIST: '/prayers',
  GET: (id) => `/prayers/${id}`,
  CREATE: '/prayers',
  UPDATE: (id) => `/prayers/${id}`,
  DELETE: (id) => `/prayers/${id}`,
  APPROVE: (id) => `/prayers/${id}/approve`,
  REJECT: (id) => `/prayers/${id}/reject`,
};
