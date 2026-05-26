import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSermonCategoryStore } from '../../store/sermonCategoryStore';
import SermonCategoryForm from './components/SermonCategoryForm';
import { toast } from '../../utils/toast';

const EditSermonCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedCategory, categories, updateCategory, isMutating } = useSermonCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const found = categories.find((cat) => cat._id === id);
        if (found) {
          setCategory(found);
        } else {
          toast.error('Category not found');
          navigate('/admin/sermons/categories');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, categories, navigate, showToast]);

  const handleSubmit = async (formData, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      await updateCategory(id, formData);
      toast.success('Category updated successfully');
      navigate('/admin/sermons/categories');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading category...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-white">Edit Category</h1>
            <p className="text-gray-400 mt-2">Update the category details</p>
          </div>
        </div>

        {/* Form Card */}
        {category && (
          <div className="glass-card rounded-2xl p-8 border border-white/50 dark:border-white/10 animate-fade-in-up shadow-[var(--shadow-medium)]">
            <SermonCategoryForm
              initialData={category}
              onSubmit={handleSubmit}
              isLoading={isSubmitting || isMutating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSermonCategory;
