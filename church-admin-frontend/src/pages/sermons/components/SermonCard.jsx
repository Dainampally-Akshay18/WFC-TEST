import React from 'react';
import { Edit, Trash2, Play, Download } from 'lucide-react';
import SermonPublishStatusBadge from './SermonPublishStatusBadge';
import { formatCreatedTime, getYoutubeThumbnailUrl } from '../utils/sermonHelpers';

const SermonCard = ({ sermon, onView, onEdit, onDelete, onPublish, onUnpublish }) => {
  const thumbnailUrl = sermon.thumbnail || getYoutubeThumbnailUrl(sermon.youtubeVideoId);

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up group border border-white/50 dark:border-white/10">
      {/* Thumbnail */}
      <div className="relative w-full h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={sermon.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl opacity-30">🎥</div>
          </div>
        )}
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onView?.(sermon)}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            title="View sermon"
          >
            <Play className="w-5 h-5" />
          </button>
        </div>
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <SermonPublishStatusBadge isPublished={sermon.isPublished} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {sermon.title || 'Untitled Sermon'}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {sermon.speakerName || 'Unknown Speaker'}
          </p>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {sermon.description || 'No description provided'}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          {sermon.categoryName && (
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              {sermon.categoryName}
            </span>
          )}
        </div>

        {/* Created Time */}
        <p className="text-xs text-[var(--text-muted)]">
          {formatCreatedTime(sermon.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-glass)]">
          <button
            onClick={() => onView?.(sermon)}
            className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Download className="w-3 h-3" />
            View
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(sermon)}
              className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Edit sermon"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(sermon)}
              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete sermon"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Publish/Unpublish Actions */}
        <div className="flex gap-2 pt-2">
          {!sermon.isPublished ? (
            <button
              onClick={() => onPublish?.(sermon._id)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors border border-emerald-500/30"
            >
              Publish
            </button>
          ) : (
            <button
              onClick={() => onUnpublish?.(sermon._id)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 rounded-lg transition-colors border border-amber-500/30"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SermonCard;
