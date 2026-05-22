import axiosClient from '../client/axiosClient';
import { PRAYER_ENDPOINTS } from '../endpoints/prayer.endpoints';

export const prayerService = {
  getPrayers: (params) => axiosClient.get(PRAYER_ENDPOINTS.LIST, { params }),
  
  getPrayer: (id) => axiosClient.get(PRAYER_ENDPOINTS.GET(id)),
  
  createPrayer: (prayerData) => axiosClient.post(PRAYER_ENDPOINTS.CREATE, prayerData),
  
  updatePrayer: (id, prayerData) => axiosClient.put(PRAYER_ENDPOINTS.UPDATE(id), prayerData),
  
  deletePrayer: (id) => axiosClient.delete(PRAYER_ENDPOINTS.DELETE(id)),
  
  approvePrayer: (id) => axiosClient.post(PRAYER_ENDPOINTS.APPROVE(id)),
  
  rejectPrayer: (id) => axiosClient.post(PRAYER_ENDPOINTS.REJECT(id)),
};
