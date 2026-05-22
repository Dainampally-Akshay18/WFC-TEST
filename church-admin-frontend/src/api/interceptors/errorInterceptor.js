import { handleApiError } from '../utils/apiErrorHandler';

export const errorInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );
};
