import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Grid, List, Trash2, Edit } from 'lucide-react';
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
  const [categoryDeleteMode, setCategoryDeleteMode] = useState(false);

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
    setSermonToDelete,
  } = useSermonStore();

  const { categories, deleteCategory, isMutating: categoryMutating, setDeleteModalOpen: setCategoryDeleteModalOpen, deleteModalOpen: categoryDeleteModalOpen, categoryToDelete, setCategoryToDelete } = useSermonCategoryStore();

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
          navigate('/admin/sermons');
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
  }, [categoryId, categories, navigate, fetchSermons]);

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

  const handleDeleteCategory = async () => {
    if (!category) return;

    try {
      await deleteCategory(category._id);
      toast.success('Category deleted successfully');
      navigate('/admin/sermons');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Cinematic Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-slate-900/40 to-slate-900">
          {category?.thumbnail ? (
            <img
              src={category.thumbnail}
              alt={category.name}
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/sermons')}
              className="p-2 hover:bg-white/10 backdrop-blur-md rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/sermons/categories/edit/${category?._id}`)}
                className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition-colors"
                title="Edit category"
              >
                <Edit className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setCategoryDeleteMode(true)}
                className="p-3 bg-red-500/10 backdrop-blur-md hover:bg-red-500/20 rounded-lg transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                {category?.name}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-md max-w-2xl">
                {category?.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="glass-card px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                <div className="text-sm text-gray-300">Total Sermons</div>
                <div className="text-2xl font-bold text-white">{categorySermons.length}</div>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                <div className="text-sm text-gray-300">Published</div>
                <div className="text-2xl font-bold text-emerald-400">{categorySermons.filter(s => s.isPublished).length}</div>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                <div className="text-sm text-gray-300">Created</div>
                <div className="text-2xl font-bold text-white">{new Date(category?.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-lg p-2 w-full md:w-fit">
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
            <button
              onClick={() => navigate('/admin/sermons/create')}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Sermon to Category
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <SermonSkeleton count={6} />
          ) : categorySermons.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/50 dark:border-white/10 animate-fade-in-up">
              <div className="text-6xl mb-4 opacity-30">📂</div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No sermons in this category</h2>
              <p className="text-gray-500 mb-6">Add your first sermon to start building this collection</p>
              <button
                onClick={() => navigate('/admin/sermons/create')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
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
                    setSermonToDelete(sermon);
                    setDeleteModalOpen(true);
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
                setSermonToDelete(sermon);
                setDeleteModalOpen(true);
              }}
              onPublish={(sermonId) => handlePublish(sermonId)}
              onUnpublish={(sermonId) => handleUnpublish(sermonId)}
            />
          )}
        </div>
      </div>

      {/* Delete Sermon Modal */}
      {deleteModalOpen && sermonToDelete && (
        <DeleteConfirmationModal
          title={sermonToDelete.title}
          itemType="sermon"
          onConfirm={handleDeleteSermon}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isMutating}
        />
      )}

      {/* Delete Category Modal */}
      {categoryDeleteMode && (
        <DeleteConfirmationModal
          title={category?.name}
          itemType="category"
          onConfirm={handleDeleteCategory}
          onCancel={() => setCategoryDeleteMode(false)}
          isLoading={categoryMutating}
        />
      )}

      {/* Sermon Details Modal */}
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
