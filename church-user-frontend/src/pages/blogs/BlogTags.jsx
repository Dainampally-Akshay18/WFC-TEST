/**
 * BLOG TAGS
 * Tag filtering component for blogs
 */

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

export const BlogTags = ({ blogs, selectedTags = [], onTagsChange }) => {
  const { colors } = useTheme();

  const availableTags = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];

    const tagSet = new Set();
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort();
  }, [blogs]);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter((t) => t !== tag);
      onTagsChange(newTags);
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: colors.text.secondary }}
        >
          Filter by Tag
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs transition-colors duration-200"
            style={{ color: colors.accent.blue }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${colors.accent.purple}60, ${colors.accent.pink}40)`
                  : `rgba(255,255,255,0.05)`,
                color: colors.text.primary,
                border: `1px solid ${isSelected ? colors.accent.purple : colors.border.glass}`,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = `rgba(255,255,255,0.1)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = `rgba(255,255,255,0.05)`;
                }
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlogTags;
