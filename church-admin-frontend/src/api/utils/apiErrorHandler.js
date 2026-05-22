import { toast } from '../../utils/toast';

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error?.message || data?.message || 'An error occurred';
    
    switch (status) {
      case 400:
        // Don't show toast for validation errors, let component handle it
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        toast.error(message);
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred');
  }
};
