import axiosClient from '../client/axiosClient';
import { AUTH_ENDPOINTS } from '../endpoints/auth.endpoints';

export const authService = {
  login: (credentials) => axiosClient.post(AUTH_ENDPOINTS.LOGIN, credentials),
  
  signup: (userData) => axiosClient.post(AUTH_ENDPOINTS.SIGNUP, userData),
  
  logout: () => axiosClient.post(AUTH_ENDPOINTS.LOGOUT),
  
  forgotPassword: (email) => axiosClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token, newPassword) => {
    return axiosClient.post(`/auth/reset-password/${token}`, { 
      newPassword,
      confirmPassword: newPassword 
    });
  },
  
  verifyOtp: (email, otp) => axiosClient.post(AUTH_ENDPOINTS.VERIFY_OTP, { email, otp }),
  
  resendOtp: (email) => axiosClient.post(AUTH_ENDPOINTS.RESEND_OTP, { email }),
  
  changePassword: (oldPassword, newPassword) => axiosClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, { oldPassword, newPassword }),
  
  getMe: () => axiosClient.get(AUTH_ENDPOINTS.ME),
  
  updateProfile: (data) => axiosClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, data),
};
