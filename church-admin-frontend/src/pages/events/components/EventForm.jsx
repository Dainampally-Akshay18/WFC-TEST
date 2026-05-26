import React, { useState } from 'react';

const EventForm = ({ initialData = null, onSubmit, isLoading = false, branches = [] }) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    visibility: 'GLOBAL',
    branch: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'Date must be in the future';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)) {
      newErrors.time = 'Time must be in HH:MM format';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    } else if (formData.location.length > 100) {
      newErrors.location = 'Location must not exceed 100 characters';
    }

    if (!formData.visibility) {
      newErrors.visibility = 'Visibility is required';
    }

    if (formData.visibility === 'BRANCH' && !formData.branch?.trim()) {
      newErrors.branch = 'Branch is required when visibility is set to BRANCH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Reset branch when visibility changes to GLOBAL
    if (name === 'visibility' && value === 'GLOBAL') {
      setFormData((prev) => ({ ...prev, branch: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter event title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
        {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title}</span>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter event description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
        />
        {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>}
      </div>

      {/* Date and Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          {errors.date && <span className="text-xs text-red-500 mt-1 block">{errors.date}</span>}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Event Time <span className="text-red-500">*</span>
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          {errors.time && <span className="text-xs text-red-500 mt-1 block">{errors.time}</span>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Enter event location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
        {errors.location && <span className="text-xs text-red-500 mt-1 block">{errors.location}</span>}
      </div>

      {/* Visibility and Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visibility */}
        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Visibility <span className="text-red-500">*</span>
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          >
            <option value="GLOBAL">Global</option>
            <option value="BRANCH">Branch</option>
          </select>
          {errors.visibility && <span className="text-xs text-red-500 mt-1 block">{errors.visibility}</span>}
        </div>

        {/* Branch - Show only if visibility is BRANCH */}
        {formData.visibility === 'BRANCH' && (
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            {errors.branch && <span className="text-xs text-red-500 mt-1 block">{errors.branch}</span>}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t border-[var(--border-glass)]">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : isEditing ? (
            'Update Event'
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
