/**
 * PRAYER API
 * Integration with prayer endpoints
 */

import { apiClient } from "./axios";

export const prayerApi = {
  /**
   * Get all prayer requests
   * @returns {Promise} Response with prayers array
   */
  getPrayers: async () => {
    const response = await apiClient.get("/prayers");
    return response;
  },

  /**
   * Get single prayer by ID
   * @param {string} id - Prayer ID
   * @returns {Promise} Response with prayer data
   */
  getPrayerById: async (id) => {
    const response = await apiClient.get(`/prayers/${id}`);
    return response;
  },

  /**
   * Create a new prayer request
   * @param {Object} prayerData - Prayer details
   * @param {string} prayerData.title - Prayer title
   * @param {string} prayerData.description - Prayer description
   * @param {boolean} prayerData.isAnonymous - Anonymous flag
   * @returns {Promise} Response with created prayer data
   */
  createPrayer: async (prayerData) => {
    const response = await apiClient.post("/prayers", prayerData);
    return response;
  },

  /**
   * Update an existing prayer
   * @param {string} id - Prayer ID
   * @param {Object} updates - Prayer fields to update
   * @returns {Promise} Response with updated prayer data
   */
  updatePrayer: async (id, updates) => {
    const response = await apiClient.put(`/prayers/${id}`, updates);
    return response;
  },

  /**
   * Delete a prayer
   * @param {string} id - Prayer ID
   * @returns {Promise} Response with deletion confirmation
   */
  deletePrayer: async (id) => {
    const response = await apiClient.delete(`/prayers/${id}`);
    return response;
  },

  /**
   * Toggle prayed status for a prayer
   * @param {string} id - Prayer ID
   * @returns {Promise} Response with updated prayer count and status
   */
  togglePrayer: async (id) => {
    const response = await apiClient.patch(`/prayers/${id}/pray`);
    return response;
  },

  /**
   * Update prayer status (admin only)
   * @param {string} id - Prayer ID
   * @param {string} status - New status (ACTIVE, PRAYED, ARCHIVED)
   * @returns {Promise} Response with updated prayer data
   */
  updatePrayerStatus: async (id, status) => {
    const response = await apiClient.patch(`/prayers/${id}/status`, { status });
    return response;
  },
};
