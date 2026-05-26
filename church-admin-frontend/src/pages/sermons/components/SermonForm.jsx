import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import YoutubePreview from './YoutubePreview';
import ThumbnailUpload from './ThumbnailUpload';
import { isValidYoutubeUrl } from '../utils/sermonHelpers';

const SermonForm = ({ initialData, categories, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeLink: '',
    categoryId: '',
    speakerName: '',
    thumbnail: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setThumbnailPreview(initialData.thumbnail);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 3000) {
      newErrors.description = 'Description must not exceed 3000 characters';
    }

    if (!formData.youtubeLink?.trim()) {
      newErrors.youtubeLink = 'YouTube URL is required';
    } else if (!isValidYoutubeUrl(formData.youtubeLink)) {
      newErrors.youtubeLink = 'Please enter a valid YouTube URL (youtube.com or youtu.be)';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (formData.speakerName && formData.speakerName.length > 100) {
      newErrors.speakerName = 'Speaker name must not exceed 100 characters';
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
      title: formData.title.trim(),
      description: formData.description.trim(),
      youtubeLink: formData.youtubeLink.trim(),
      categoryId: formData.categoryId,
      speakerName: formData.speakerName?.trim() || undefined,
    };

    // If there's a new thumbnail file, include it
    if (thumbnailFile) {
      submitData.thumbnailFile = thumbnailFile;
    } else if (thumbnailPreview && !initialData?.thumbnail === thumbnailPreview) {
      submitData.thumbnail = formData.thumbnail;
    }

    onSubmit?.(submitData, thumbnailFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* YouTube Link */}
      <div className="space-y-2">
        <label htmlFor="youtubeLink" className="text-sm font-semibold text-[var(--text-primary)] block">
          YouTube URL *
        </label>
        <input
          id="youtubeLink"
          type="url"
          value={formData.youtubeLink}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, youtubeLink: e.target.value }));
            if (errors.youtubeLink) setErrors((prev) => ({ ...prev, youtubeLink: '' }));
          }}
          placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        {errors.youtubeLink && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.youtubeLink}
          </div>
        )}
      </div>

      {/* YouTube Preview */}
      <YoutubePreview
        youtubeLink={formData.youtubeLink}
        onVideoIdExtracted={(id) => setVideoId(id)}
      />

      {/* Custom Thumbnail Upload */}
      <ThumbnailUpload
        preview={thumbnailPreview}
        onImageSelect={(file, preview) => {
          setThumbnailFile(file);
          setThumbnailPreview(preview);
          if (preview) {
            setFormData((prev) => ({ ...prev, thumbnail: preview }));
          }
        }}
        label="Custom Thumbnail (Optional)"
      />

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold text-[var(--text-primary)] block">
          Sermon Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="e.g., The Power of Faith"
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        {errors.title && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.title}
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
          placeholder="Write a detailed description of the sermon..."
          rows={5}
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{formData.description.length}/3000 characters</span>
        </div>
        {errors.description && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-sm font-semibold text-[var(--text-primary)] block">
          Category *
        </label>
        <select
          id="categoryId"
          value={formData.categoryId}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
            if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: '' }));
          }}
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.categoryId}
          </div>
        )}
      </div>

      {/* Speaker Name */}
      <div className="space-y-2">
        <label htmlFor="speakerName" className="text-sm font-semibold text-[var(--text-primary)] block">
          Speaker Name (Optional)
        </label>
        <input
          id="speakerName"
          type="text"
          value={formData.speakerName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, speakerName: e.target.value }));
            if (errors.speakerName) setErrors((prev) => ({ ...prev, speakerName: '' }));
          }}
          placeholder="e.g., Pastor John Smith"
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        {errors.speakerName && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.speakerName}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all active:scale-95"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Sermon' : 'Create Sermon'}
      </button>
    </form>
  );
};

export default SermonForm;
