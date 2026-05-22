export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  GET: (id) => `/notifications/${id}`,
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: (id) => `/notifications/${id}`,
};
