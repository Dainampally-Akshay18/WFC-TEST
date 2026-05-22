export const UPLOAD_ENDPOINTS = {
  IMAGE: '/upload/image',
  VIDEO: '/upload/video',
  DOCUMENT: '/upload/document',
  DELETE: (publicId) => `/upload/${publicId}`,
};
