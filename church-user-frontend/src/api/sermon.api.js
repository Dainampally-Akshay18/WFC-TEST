/**
 * SERMON API
 * Integration with sermon endpoints
 */

import { apiClient } from "./axios";

export const sermonApi = {
  // ===== CATEGORY METHODS =====

  /**
   * Get all sermon categories
   * @returns {Promise} Response with categories array
   */
  getCategories: async () => {
    const response = await apiClient.get("/sermons/categories");
    return response;
  },

  /**
   * Create a new sermon category
   * @param {Object} categoryData - Category details
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description
   * @returns {Promise} Response with created category data
   */
  createCategory: async (categoryData) => {
    const response = await apiClient.post("/sermons/categories", categoryData);
    return response;
  },

  /**
   * Update a sermon category
   * @param {string} id - Category ID
   * @param {Object} updates - Category fields to update
   * @returns {Promise} Response with updated category data
   */
  updateCategory: async (id, updates) => {
    const response = await apiClient.put(`/sermons/categories/${id}`, updates);
    return response;
  },

  /**
   * Delete a sermon category
   * @param {string} id - Category ID
   * @returns {Promise} Response with deletion confirmation
   */
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/sermons/categories/${id}`);
    return response;
  },

  // ===== SERMON METHODS =====

  /**
   * Get all sermons with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.categoryId - Filter by category ID (optional)
   * @param {string} params.search - Search in title/description (optional)
   * @returns {Promise} Response with sermons array
   */
  getSermons: async (params = {}) => {
    const response = await apiClient.get("/sermons", { params });
    return response;
  },

  /**
   * Get single sermon by ID
   * @param {string} id - Sermon ID (MongoDB ObjectId)
   * @returns {Promise} Response with sermon data
   */
  getSermonById: async (id) => {
    const response = await apiClient.get(`/sermons/${id}`);
    return response;
  },

  /**
   * Create a new sermon
   * @param {Object} sermonData - Sermon details
   * @param {string} sermonData.title - Sermon title
   * @param {string} sermonData.description - Sermon description
   * @param {string} sermonData.youtubeLink - YouTube video URL
   * @param {string} sermonData.categoryId - Category ID
   * @param {string} sermonData.speakerName - Speaker name (optional)
   * @param {string} sermonData.thumbnail - Custom thumbnail URL (optional)
   * @returns {Promise} Response with created sermon data
   */
  createSermon: async (sermonData) => {
    const response = await apiClient.post("/sermons", sermonData);
    return response;
  },

  /**
   * Update an existing sermon
   * @param {string} id - Sermon ID
   * @param {Object} updates - Sermon fields to update
   * @returns {Promise} Response with updated sermon data
   */
  updateSermon: async (id, updates) => {
    const response = await apiClient.put(`/sermons/${id}`, updates);
    return response;
  },

  /**
   * Delete a sermon
   * @param {string} id - Sermon ID
   * @returns {Promise} Response with deletion confirmation
   */
  deleteSermon: async (id) => {
    const response = await apiClient.delete(`/sermons/${id}`);
    return response;
  },

  /**
   * Publish a sermon
   * @param {string} id - Sermon ID
   * @returns {Promise} Response with published sermon data
   */
  publishSermon: async (id) => {
    const response = await apiClient.patch(`/sermons/${id}/publish`);
    return response;
  },

  /**
   * Unpublish a sermon
   * @param {string} id - Sermon ID
   * @returns {Promise} Response with unpublished sermon data
   */
  unpublishSermon: async (id) => {
    const response = await apiClient.patch(`/sermons/${id}/unpublish`);
    return response;
  },
};
