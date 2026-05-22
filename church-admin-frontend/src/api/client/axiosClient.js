import axios from 'axios';
import { authInterceptor } from '../interceptors/authInterceptor';
import { errorInterceptor } from '../interceptors/errorInterceptor';
import { refreshInterceptor } from '../interceptors/refreshInterceptor';
import { responseInterceptor } from '../interceptors/responseInterceptor';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptors
authInterceptor(axiosClient);

// Response interceptors
responseInterceptor(axiosClient);
errorInterceptor(axiosClient);
refreshInterceptor(axiosClient);

export default axiosClient;
