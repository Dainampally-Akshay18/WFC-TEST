export const APP_NAME = 'Church Admin';
export const APP_VERSION = '1.0.0';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY hh:mm A',
  SHORT: 'MM/DD/YYYY',
  TIME: 'hh:mm A',
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
};
