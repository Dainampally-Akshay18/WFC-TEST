import React from 'react';
import { X, Play } from 'lucide-react';
import YoutubePreview from './YoutubePreview';
import SermonPublishStatusBadge from './SermonPublishStatusBadge';
import { formatSermonDate, formatCreatedTime } from '../utils/sermonHelpers';

const SermonDetailsModal = ({ sermon, onClose, onPublish, onUnpublish, isLoading = false }) => {
  if (!sermon) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{sermon.title || 'Sermon Details'}</h2>
            <div className="mt-2">
              <SermonPublishStatusBadge isPublished={sermon.isPublished} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
          {/* YouTube Video */}
          <YoutubePreview youtubeLink={sermon.youtubeLink} />

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Description</h3>
            <p className="text-gray-900 dark:text-white leading-relaxed text-base">{sermon.description || 'No description provided'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            {/* Speaker */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Speaker</p>
              <p className="text-gray-900 dark:text-white font-medium text-base mt-1">{sermon.speakerName || 'Unknown'}</p>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</p>
              <p className="text-gray-900 dark:text-white font-medium text-base mt-1">{sermon.categoryName || 'N/A'}</p>
            </div>

            {/* Created Date */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Created</p>
              <p className="text-gray-900 dark:text-white font-medium text-base mt-1">{formatSermonDate(sermon.createdAt)}</p>
            </div>

            {/* Created By */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Created By</p>
              <p className="text-gray-900 dark:text-white font-medium text-base mt-1">{sermon.createdBy?.name || 'Unknown'}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Sermon ID</p>
              <p className="text-gray-900 dark:text-white font-mono break-all mt-1">{sermon._id}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Last Updated</p>
              <p className="text-gray-900 dark:text-white mt-1">{sermon.updatedAt ? formatCreatedTime(sermon.updatedAt) : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all"
          >
            Close
          </button>
          {!sermon.isPublished ? (
            <button
              onClick={() => onPublish?.(sermon._id)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          ) : (
            <button
              onClick={() => onUnpublish?.(sermon._id)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isLoading ? 'Unpublishing...' : 'Unpublish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SermonDetailsModal;
