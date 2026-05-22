export const EVENT_ENDPOINTS = {
  LIST: '/events',
  GET: (id) => `/events/${id}`,
  CREATE: '/events',
  UPDATE: (id) => `/events/${id}`,
  DELETE: (id) => `/events/${id}`,
  PUBLISH: (id) => `/events/${id}/publish`,
  UNPUBLISH: (id) => `/events/${id}/unpublish`,
};
