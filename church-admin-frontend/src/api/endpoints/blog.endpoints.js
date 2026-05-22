export const BLOG_ENDPOINTS = {
  LIST: '/blogs',
  GET: (id) => `/blogs/${id}`,
  CREATE: '/blogs',
  UPDATE: (id) => `/blogs/${id}`,
  DELETE: (id) => `/blogs/${id}`,
  PUBLISH: (id) => `/blogs/${id}/publish`,
  UNPUBLISH: (id) => `/blogs/${id}/unpublish`,
};
