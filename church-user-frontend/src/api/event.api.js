/**
 * EVENT API
 * Integration with event endpoints
 */

import { apiClient } from "./axios";

export const eventApi = {
  /**
   * Get all visible events for the current user
   * @returns {Promise} Response with events array
   */
  getEvents: async () => {
    try {
      const response = await apiClient.get("/events");
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single event by ID
   * @param {string} id - Event ID (MongoDB ObjectId)
   * @returns {Promise} Response with event data
   */
  getEventById: async (id) => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event details
   * @param {string} eventData.title - Event name
   * @param {string} eventData.description - Event details
   * @param {string} eventData.date - Event date (YYYY-MM-DD format)
   * @param {string} eventData.time - Event time (HH:MM format)
   * @param {string} eventData.location - Event venue
   * @param {string} eventData.visibility - BRANCH or GLOBAL
   * @param {string} eventData.branch - Branch code (required if visibility=BRANCH)
   * @returns {Promise} Response with created event data
   */
  createEvent: async (eventData) => {
    try {
      const response = await apiClient.post("/events", eventData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} updates - Event fields to update
   * @returns {Promise} Response with updated event data
   */
  updateEvent: async (id, updates) => {
    try {
      const response = await apiClient.put(`/events/${id}`, updates);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise} Response with deletion confirmation
   */
  deleteEvent: async (id) => {
    try {
      const response = await apiClient.delete(`/events/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
