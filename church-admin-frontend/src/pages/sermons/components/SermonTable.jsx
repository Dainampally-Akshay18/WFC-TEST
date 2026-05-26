import React from 'react';
import { Edit, Trash2, Play } from 'lucide-react';
import SermonPublishStatusBadge from './SermonPublishStatusBadge';
import { formatCreatedTime } from '../utils/sermonHelpers';

const SermonTable = ({ sermons, onView, onEdit, onDelete, onPublish, onUnpublish }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up shadow-[var(--shadow-medium)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Sermon</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Speaker</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Category</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Created</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sermons.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                  No sermons found.
                </td>
              </tr>
            ) : (
              sermons.map((sermon) => (
                <tr
                  key={sermon._id}
                  className="border-b border-[var(--border-glass)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Sermon Title */}
                  <td className="p-4">
                    <div>
                      <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                        {sermon.title || 'Untitled'}
                      </span>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {sermon.description || 'No description'}
                      </p>
                    </div>
                  </td>
                  
                  {/* Speaker Name */}
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {sermon.speakerName || 'Unknown'}
                  </td>
                  
                  {/* Category */}
                  <td className="p-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {sermon.categoryName || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="p-4">
                    <SermonPublishStatusBadge isPublished={sermon.isPublished} />
                  </td>
                  
                  {/* Created Date */}
                  <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                    {formatCreatedTime(sermon.createdAt)}
                  </td>
                  
                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(sermon)}
                        className="p-1.5 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="View sermon"
                      >
                        <Play className="w-4 h-4" />
                      </button>
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

export default SermonTable;
