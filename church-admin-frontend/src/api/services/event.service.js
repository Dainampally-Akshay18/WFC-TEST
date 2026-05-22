import axiosClient from '../client/axiosClient';
import { EVENT_ENDPOINTS } from '../endpoints/event.endpoints';

export const eventService = {
  getEvents: (params) => axiosClient.get(EVENT_ENDPOINTS.LIST, { params }),
  
  getEvent: (id) => axiosClient.get(EVENT_ENDPOINTS.GET(id)),
  
  createEvent: (eventData) => axiosClient.post(EVENT_ENDPOINTS.CREATE, eventData),
  
  updateEvent: (id, eventData) => axiosClient.put(EVENT_ENDPOINTS.UPDATE(id), eventData),
  
  deleteEvent: (id) => axiosClient.delete(EVENT_ENDPOINTS.DELETE(id)),
  
  publishEvent: (id) => axiosClient.post(EVENT_ENDPOINTS.PUBLISH(id)),
  
  unpublishEvent: (id) => axiosClient.post(EVENT_ENDPOINTS.UNPUBLISH(id)),
};
