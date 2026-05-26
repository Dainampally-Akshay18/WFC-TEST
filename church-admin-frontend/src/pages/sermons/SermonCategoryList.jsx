import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid, List } from 'lucide-react';
import { useSermonCategoryStore } from '../../store/sermonCategoryStore';
import SermonCategoryCard from './components/SermonCategoryCard';
import SermonCategoryTable from './components/SermonCategoryTable';
import SermonCategorySkeleton from './components/SermonCategorySkeleton';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { toast } from '../../utils/toast';

const SermonCategoryList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  const {
    filteredCategories,
    isLoading,
    isMutating,
    deleteModalOpen,
    categoryToDelete,
    fetchCategories,
    deleteCategory,
    setDeleteModalOpen,
  } = useSermonCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete._id);
      toast.success('Category deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Sermon Categories</h1>
              <p className="text-gray-400 mt-2">Manage sermon categories for better organization</p>
            </div>
            <button
              onClick={() => navigate('/admin/sermons/categories/create')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Category
            </button>
          </div>
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
          <SermonCategorySkeleton count={6} viewMode={viewMode} />
        ) : filteredCategories.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/50 dark:border-white/10 animate-fade-in-up">
            <div className="text-6xl mb-4 opacity-30">📂</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No categories yet</h2>
            <p className="text-gray-500 mb-6">Create your first sermon category to get started</p>
            <button
              onClick={() => navigate('/admin/sermons/categories/create')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
            >
              Create First Category
            </button>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <SermonCategoryCard
                key={category._id}
                category={category}
                onEdit={() => navigate(`/admin/sermons/categories/edit/${category._id}`)}
                onDelete={() => {
                  useSermonCategoryStore.setState({ categoryToDelete: category, deleteModalOpen: true });
                }}
                onViewSermons={() => navigate(`/admin/sermons/category/${category._id}`)}
              />
            ))}
          </div>
        ) : (
          <SermonCategoryTable
            categories={filteredCategories}
            onEdit={(category) => navigate(`/admin/sermons/categories/edit/${category._id}`)}
            onDelete={(category) => {
              useSermonCategoryStore.setState({ categoryToDelete: category, deleteModalOpen: true });
            }}
            onViewSermons={(category) => navigate(`/admin/sermons/category/${category._id}`)}
          />
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && categoryToDelete && (
        <DeleteConfirmationModal
          title={categoryToDelete.name}
          itemType="category"
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isMutating}
        />
      )}
    </div>
  );
};

export default SermonCategoryList;
