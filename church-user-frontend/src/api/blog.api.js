/**
 * BLOG API
 * Integration with blog endpoints
 */

import { apiClient } from "./axios";

export const blogApi = {
  /**
   * Get all published blogs with optional search and tag filtering
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term for title/content
   * @param {string} params.tags - Comma-separated tags filter
   * @returns {Promise} Response with blogs array
   */
  getBlogs: async (params = {}) => {
    try {
      const response = await apiClient.get("/blogs", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single blog by slug with full content
   * @param {string} slug - Blog URL slug
   * @returns {Promise} Response with blog data including full content
   */
  getBlogBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/blogs/${slug}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
