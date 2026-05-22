export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
};

export const isDevelopment = ENV.APP_ENV === 'development';
export const isProduction = ENV.APP_ENV === 'production';
