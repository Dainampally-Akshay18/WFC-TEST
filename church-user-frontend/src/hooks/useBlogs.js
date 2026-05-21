/**
 * USE BLOGS HOOK
 * Custom hooks for blog data fetching with React Query
 */

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "../api/blog.api";

/**
 * Hook for fetching all blogs with search and tag filtering
 * @param {Object} options - Configuration
 * @param {string} options.search - Search term
 * @param {string} options.tags - Comma-separated tags
 * @returns {Object} Query result with data, loading, error states
 */
export const useBlogs = (options = {}) => {
  const { search = "", tags = "" } = options;

  return useQuery({
    queryKey: ["blogs", search, tags],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (tags) params.tags = tags;

      const response = await blogApi.getBlogs(params);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching single blog by slug
 * @param {string} slug - Blog URL slug
 * @returns {Object} Query result with blog data, loading, error states
 */
export const useBlogDetails = (slug) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await blogApi.getBlogBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
