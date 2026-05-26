import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSermonCategoryStore } from '../../store/sermonCategoryStore';
import SermonCategoryForm from './components/SermonCategoryForm';
import { toast } from '../../utils/toast';

const CreateSermonCategory = () => {
  const navigate = useNavigate();
  const { createCategory, isMutating } = useSermonCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      // For now, we'll send just the form data
      // If you need to handle file uploads, you can use FormData
      await createCategory(formData);
      toast.success('Category created successfully');
      navigate('/admin/sermons/categories');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sermons/categories')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Create New Category</h1>
            <p className="text-gray-400 mt-2">Add a new sermon category to organize your content</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/50 dark:border-white/10 animate-fade-in-up shadow-[var(--shadow-medium)]">
          <SermonCategoryForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting || isMutating}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSermonCategory;
