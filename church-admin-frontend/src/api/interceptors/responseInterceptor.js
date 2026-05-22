import { formatResponse } from '../utils/responseFormatter';

export const responseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return formatResponse(response);
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
