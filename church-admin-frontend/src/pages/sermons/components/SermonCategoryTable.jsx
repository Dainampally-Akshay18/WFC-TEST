import React from 'react';
import { Edit, Trash2, Play } from 'lucide-react';
import { formatCreatedTime } from '../utils/sermonHelpers';

const SermonCategoryTable = ({ categories, onEdit, onDelete, onViewSermons }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up shadow-[var(--shadow-medium)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Thumbnail</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Category</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Description</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] text-center">Sermons</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Created By</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Created</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-[var(--border-glass)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden flex-shrink-0">
                      {category.thumbnail ? (
                        <img
                          src={category.thumbnail}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                      )}
                    </div>
                  </td>
                  
                  {/* Category Name */}
                  <td className="p-4">
                    <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                      {category.name || 'Untitled'}
                    </span>
                  </td>
                  
                  {/* Description */}
                  <td className="p-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate">
                    {category.description || 'No description'}
                  </td>
                  
                  {/* Sermon Count */}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-sm">
                      {category.sermonCount || 0}
                    </span>
                  </td>
                  
                  {/* Created By */}
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {category.createdBy?.name || 'Unknown'}
                  </td>
                  
                  {/* Created Date */}
                  <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                    {formatCreatedTime(category.createdAt)}
                  </td>
                  
                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewSermons?.(category)}
                        className="p-1.5 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="View sermons in this category"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(category)}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(category)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SermonCategoryTable;
