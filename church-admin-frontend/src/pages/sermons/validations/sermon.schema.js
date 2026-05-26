import { z } from 'zod';

// YouTube URL validation helper
const isValidYoutubeUrl = (url) => {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}$/;
  return youtubeRegex.test(url);
};

// Extract video ID from YouTube URL
export const extractYoutubeVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
};

// Sermon Category Schema
export const sermonCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Category name must be at least 3 characters')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
});

// Sermon Schema
export const sermonSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(3000, 'Description must not exceed 3000 characters')
    .trim(),
  youtubeLink: z
    .string()
    .refine(isValidYoutubeUrl, 'Please enter a valid YouTube URL (youtube.com or youtu.be)'),
  categoryId: z
    .string()
    .min(1, 'Please select a category'),
  speakerName: z
    .string()
    .max(100, 'Speaker name must not exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
});

export const sermonCategoryFormSchema = sermonCategorySchema;
export const sermonFormSchema = sermonSchema;
