export const USER_ENDPOINTS = {
  LIST: '/users',
  GET: (id) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  APPROVE: (id) => `/users/${id}/approve`,
  REJECT: (id) => `/users/${id}/reject`,
  CHANGE_ROLE: (id) => `/users/${id}/role`,
  CHANGE_STATUS: (id) => `/users/${id}/status`,
};
