import { FILE_UPLOAD } from '../constants/appConstants';

export const validateFile = (file) => {
  const errors = [];

  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    errors.push(`File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateImage = (file) => {
  const errors = [];

  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push('Invalid image type. Allowed types: JPEG, PNG, GIF, WebP');
  }

  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    errors.push(`Image size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
