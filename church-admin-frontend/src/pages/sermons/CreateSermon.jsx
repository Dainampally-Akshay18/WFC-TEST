import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSermonStore } from '../../store/sermonStore';
import SermonForm from './components/SermonForm';
import { toast } from '../../utils/toast';

const CreateSermon = () => {
  const navigate = useNavigate();
  const { createSermon, categories, fetchCategories, isMutating } = useSermonStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const handleSubmit = async (formData, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      await createSermon(formData);
      toast.success('Sermon created successfully');
      navigate('/admin/sermons');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sermons')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Create New Sermon</h1>
            <p className="text-gray-400 mt-2">Add a new sermon to your library with YouTube integration</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/50 dark:border-white/10 animate-fade-in-up shadow-[var(--shadow-medium)]">
          <SermonForm
            categories={categories}
            onSubmit={handleSubmit}
            isLoading={isSubmitting || isMutating}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSermon;
