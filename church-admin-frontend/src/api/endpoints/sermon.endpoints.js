export const SERMON_ENDPOINTS = {
  // Sermon endpoints
  LIST: '/sermons',
  GET: (id) => `/sermons/${id}`,
  CREATE: '/sermons',
  UPDATE: (id) => `/sermons/${id}`,
  DELETE: (id) => `/sermons/${id}`,
  PUBLISH: (id) => `/sermons/${id}/publish`,
  UNPUBLISH: (id) => `/sermons/${id}/unpublish`,
  
  // Category endpoints
  CATEGORIES_LIST: '/sermons/categories',
  CATEGORIES_GET: (id) => `/sermons/categories/${id}`,
  CATEGORIES_CREATE: '/sermons/categories',
  CATEGORIES_UPDATE: (id) => `/sermons/categories/${id}`,
  CATEGORIES_DELETE: (id) => `/sermons/categories/${id}`,
};
