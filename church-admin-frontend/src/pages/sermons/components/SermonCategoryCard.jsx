import React from 'react';
import { Edit, Trash2, Play } from 'lucide-react';
import { formatCreatedTime } from '../utils/sermonHelpers';

const SermonCategoryCard = ({ category, onEdit, onDelete, onViewSermons, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect?.(category)}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up group border border-white/50 dark:border-white/10 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
        {category.thumbnail ? (
          <img
            src={category.thumbnail}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl opacity-30">🎬</div>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {category.name || 'Untitled Category'}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
            {category.description || 'No description provided'}
          </p>
        </div>

        {/* Meta Info */}
        <div className="py-2 border-y border-[var(--border-glass)] text-xs text-[var(--text-secondary)] space-y-1">
          <div className="flex justify-between">
            <span>Sermons:</span>
            <span className="font-semibold text-[var(--text-primary)]">{category.sermonCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatCreatedTime(category.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewSermons?.(category);
            }}
            className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Play className="w-3 h-3" />
            View Sermons
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(category);
              }}
              className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Edit category"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(category);
              }}
              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonCategoryCard;
