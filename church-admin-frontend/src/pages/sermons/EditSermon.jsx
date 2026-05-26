import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSermonStore } from '../../store/sermonStore';
import SermonForm from './components/SermonForm';
import { toast } from '../../utils/toast';

const EditSermon = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedSermon, categories, fetchSermonDetails, updateSermon, fetchCategories, isMutating } = useSermonStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (categories.length === 0) {
          await fetchCategories();
        }
        await fetchSermonDetails(id);
      } catch (error) {
        toast.error('Failed to load sermon details');
        navigate('/admin/sermons');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, fetchSermonDetails, fetchCategories, categories.length, navigate]);

  const handleSubmit = async (formData, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      await updateSermon(id, formData);
      toast.success('Sermon updated successfully');
      navigate('/admin/sermons');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading sermon details...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-white">Edit Sermon</h1>
            <p className="text-gray-400 mt-2">Update the sermon details</p>
          </div>
        </div>

        {/* Form Card */}
        {selectedSermon && (
          <div className="glass-card rounded-2xl p-8 border border-white/50 dark:border-white/10 animate-fade-in-up shadow-[var(--shadow-medium)]">
            <SermonForm
              initialData={selectedSermon}
              categories={categories}
              onSubmit={handleSubmit}
              isLoading={isSubmitting || isMutating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSermon;
