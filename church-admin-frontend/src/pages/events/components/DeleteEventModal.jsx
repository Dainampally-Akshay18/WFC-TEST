import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteEventModal = ({ event, onConfirm, onCancel, isLoading = false }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-scale-in border border-white/50 dark:border-white/10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-[var(--text-primary)] text-center mb-2">
          Delete Event?
        </h3>
        <p className="text-[var(--text-secondary)] text-center mb-2">
          Are you sure you want to permanently delete this event?
        </p>
        <p className="text-[var(--text-muted)] text-center text-sm mb-6 font-medium">
          "{event?.title}"
        </p>

        {/* Warning */}
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-6">
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ This action cannot be undone. Users will no longer receive notifications for this event.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-300/20 hover:bg-gray-300/30 dark:bg-gray-600/20 dark:hover:bg-gray-600/30 text-[var(--text-primary)] font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
