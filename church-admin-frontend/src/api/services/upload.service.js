import axiosClient from '../client/axiosClient';
import { UPLOAD_ENDPOINTS } from '../endpoints/upload.endpoints';

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post(UPLOAD_ENDPOINTS.IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return axiosClient.post(UPLOAD_ENDPOINTS.VIDEO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return axiosClient.post(UPLOAD_ENDPOINTS.DOCUMENT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteFile: (publicId) => axiosClient.delete(UPLOAD_ENDPOINTS.DELETE(publicId)),
};
