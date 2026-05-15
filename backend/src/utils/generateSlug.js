/**
 * ============================================
 * SLUG GENERATOR UTILITY
 * ============================================
 * 
 * Generates SEO-friendly URL slugs from titles
 * Used for blog posts, articles, etc.
 * 
 * Examples:
 * "How to Strengthen Faith" → "how-to-strengthen-faith"
 * "The Power of Prayer!!!" → "the-power-of-prayer"
 */

export const generateSlug = (title) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title must be a non-empty string');
  }

  return title
    .toLowerCase()           // Convert to lowercase
    .trim()                  // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')    // Replace spaces with hyphens
    .replace(/-+/g, '-')     // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default generateSlug;
