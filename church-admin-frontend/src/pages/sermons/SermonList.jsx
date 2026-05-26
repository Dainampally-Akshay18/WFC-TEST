import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid, List, Music } from 'lucide-react';
import { useSermonStore } from '../../store/sermonStore';
import { useSermonCategoryStore } from '../../store/sermonCategoryStore';
import SermonCategoryCard from './components/SermonCategoryCard';
import SermonCategorySkeleton from './components/SermonCategorySkeleton';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { toast } from '../../utils/toast';

const SermonList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  
  const {
    categories,
    filteredCategories,
    isLoading,
    isMutating,
    deleteModalOpen,
    categoryToDelete,
    fetchCategories,
    deleteCategory,
    setDeleteModalOpen,
    setCategoryToDelete,
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
        {/* Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Sermon Categories</h1>
              </div>
              <p className="text-gray-400 mt-2">Browse and manage your sermon collection by category</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate('/admin/sermons/categories/create')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Category</span>
              </button>
              <button
                onClick={() => navigate('/admin/sermons/create')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Sermon</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        {filteredCategories.length > 0 && (
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
        )}

        {/* Content */}
        {isLoading ? (
          <SermonCategorySkeleton count={6} viewMode={viewMode} />
        ) : filteredCategories.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/50 dark:border-white/10 animate-fade-in-up">
            <div className="text-6xl mb-4 opacity-30">🎬</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No sermon categories yet</h2>
            <p className="text-gray-500 mb-6">Create your first sermon category to start organizing your sermon library</p>
            <button
              onClick={() => navigate('/admin/sermons/categories/create')}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all"
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
                onViewSermons={() => navigate(`/admin/sermons/category/${category._id}`)}
                onEdit={() => navigate(`/admin/sermons/categories/edit/${category._id}`)}
                onDelete={() => {
                  setCategoryToDelete(category);
                  setDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up border border-white/50 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-white/20">
                    <th className="p-4 text-sm font-semibold text-gray-300 text-left">Category</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 text-left">Description</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 text-center">Sermons</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 text-left">Created</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="border-b border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm font-medium text-white">{category.name}</td>
                      <td className="p-4 text-sm text-gray-400 max-w-xs truncate">{category.description}</td>
                      <td className="p-4 text-sm text-gray-400 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                          {category.sermonCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/sermons/category/${category._id}`)}
                            className="px-3 py-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View sermons"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/sermons/categories/edit/${category._id}`)}
                            className="px-3 py-1 text-amber-400 hover:text-amber-300 transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToDelete(category);
                              setDeleteModalOpen(true);
                            }}
                            className="px-3 py-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

export default SermonList;
