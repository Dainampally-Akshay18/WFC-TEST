import { formatDistanceToNow } from 'date-fns';

// Extract YouTube video ID from URL
export const extractYoutubeVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Get YouTube thumbnail URL
export const getYoutubeThumbnailUrl = (videoId, quality = 'maxresdefault') => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

// Get embedded YouTube player HTML
export const getYoutubeEmbedUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

// Validate YouTube URL
export const isValidYoutubeUrl = (url) => {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}$/;
  return youtubeRegex.test(url);
};

// Format sermon date
export const formatSermonDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format created time
export const formatCreatedTime = (createdAt) => {
  if (!createdAt) return 'N/A';
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch {
    return 'N/A';
  }
};

// Get publish status badge config
export const getPublishStatusConfig = (isPublished) => {
  if (isPublished) {
    return {
      label: 'Published',
      color: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
      icon: '✓',
    };
  }
  return {
    label: 'Draft',
    color: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    icon: '✎',
  };
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get sermon preview text
export const getSermonPreview = (description, maxLength = 120) => {
  return truncateText(description, maxLength);
};
