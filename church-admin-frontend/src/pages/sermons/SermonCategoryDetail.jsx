import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Grid, List } from 'lucide-react';
import { useSermonStore } from '../../store/sermonStore';
import { useSermonCategoryStore } from '../../store/sermonCategoryStore';
import SermonCard from './components/SermonCard';
import SermonTable from './components/SermonTable';
import SermonSkeleton from './components/SermonSkeleton';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SermonDetailsModal from './components/SermonDetailsModal';
import { toast } from '../../utils/toast';

const SermonCategoryDetail = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [viewMode, setViewMode] = useState('card');
  const [category, setCategory] = useState(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  const {
    sermons,
    selectedSermon,
    isLoading,
    isMutating,
    deleteModalOpen,
    detailsModalOpen,
    sermonToDelete,
    fetchSermons,
    deleteSermon,
    publishSermon,
    unpublishSermon,
    setDeleteModalOpen,
    setDetailsModalOpen,
    setSelectedSermon,
  } = useSermonStore();

  const { categories } = useSermonCategoryStore();

  // Filter sermons by category
  const categorySermons = sermons.filter((s) => s.categoryId === categoryId);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const found = categories.find((cat) => cat._id === categoryId);
        if (found) {
          setCategory(found);
        } else {
          toast.error('Category not found');
          navigate('/admin/sermons/categories');
          return;
        }
      } finally {
        setIsLoadingCategory(false);
      }
    };

    const loadSermons = async () => {
      await fetchSermons();
    };

    loadCategory();
    loadSermons();
  }, [categoryId, categories, navigate, showToast, fetchSermons]);

  const handleDeleteSermon = async () => {
    if (!sermonToDelete) return;

    try {
      await deleteSermon(sermonToDelete._id);
      toast.success('Sermon deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete sermon');
    }
  };

  const handlePublish = async (sermonId) => {
    try {
      await publishSermon(sermonId);
      toast.success('Sermon published successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to publish sermon');
    }
  };

  const handleUnpublish = async (sermonId) => {
    try {
      await unpublishSermon(sermonId);
      toast.success('Sermon unpublished successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to unpublish sermon');
    }
  };

  if (isLoadingCategory) {
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/sermons/categories')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white">{category?.name || 'Category'}</h1>
            <p className="text-gray-400 mt-2">{category?.description}</p>
          </div>
          <button
            onClick={() => navigate('/admin/sermons/create')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Sermon
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-lg p-2 w-fit">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
              viewMode === 'card'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            Card View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            Table View
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <SermonSkeleton count={6} />
        ) : categorySermons.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/50 dark:border-white/10 animate-fade-in-up">
            <div className="text-6xl mb-4 opacity-30">📂</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No sermons in this category</h2>
            <p className="text-gray-500 mb-6">Add your first sermon to this category</p>
            <button
              onClick={() => navigate('/admin/sermons/create')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
            >
              Create First Sermon
            </button>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySermons.map((sermon) => (
              <SermonCard
                key={sermon._id}
                sermon={sermon}
                onView={() => {
                  setSelectedSermon(sermon);
                  setDetailsModalOpen(true);
                }}
                onEdit={() => navigate(`/admin/sermons/edit/${sermon._id}`)}
                onDelete={() => {
                  useSermonStore.setState({ sermonToDelete: sermon, deleteModalOpen: true });
                }}
                onPublish={() => handlePublish(sermon._id)}
                onUnpublish={() => handleUnpublish(sermon._id)}
              />
            ))}
          </div>
        ) : (
          <SermonTable
            sermons={categorySermons}
            onView={(sermon) => {
              setSelectedSermon(sermon);
              setDetailsModalOpen(true);
            }}
            onEdit={(sermon) => navigate(`/admin/sermons/edit/${sermon._id}`)}
            onDelete={(sermon) => {
              useSermonStore.setState({ sermonToDelete: sermon, deleteModalOpen: true });
            }}
            onPublish={(sermonId) => handlePublish(sermonId)}
            onUnpublish={(sermonId) => handleUnpublish(sermonId)}
          />
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && sermonToDelete && (
        <DeleteConfirmationModal
          title={sermonToDelete.title}
          itemType="sermon"
          onConfirm={handleDeleteSermon}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isMutating}
        />
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedSermon && (
        <SermonDetailsModal
          sermon={selectedSermon}
          onClose={() => setDetailsModalOpen(false)}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          isLoading={isMutating}
        />
      )}
    </div>
  );
};

export default SermonCategoryDetail;
