import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import ThumbnailUpload from './ThumbnailUpload';

const SermonCategoryForm = ({ initialData, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setThumbnailPreview(initialData.thumbnail);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    // If there's a new thumbnail file, it will be handled separately (FormData)
    if (thumbnailPreview && !thumbnailFile) {
      submitData.thumbnail = formData.thumbnail;
    }

    onSubmit?.(submitData, thumbnailFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thumbnail Upload */}
      <ThumbnailUpload
        preview={thumbnailPreview}
        onImageSelect={(file, preview) => {
          setThumbnailFile(file);
          setThumbnailPreview(preview);
          if (preview) {
            setFormData((prev) => ({ ...prev, thumbnail: preview }));
          }
        }}
        label="Category Thumbnail (Optional)"
      />

      {/* Category Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-[var(--text-primary)] block">
          Category Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          placeholder="e.g., Faith, Prayer, Grace"
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        {errors.name && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-[var(--text-primary)] block">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Describe the category and what sermons it will contain..."
          rows={4}
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{formData.description.length}/500 characters</span>
        </div>
        {errors.description && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all active:scale-95"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
};

export default SermonCategoryForm;
