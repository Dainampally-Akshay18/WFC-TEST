import React from 'react';

const EventSkeleton = ({ count = 3, variant = 'card' }) => {
  if (variant === 'table') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="p-4">
                    <div className="h-3 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-full animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border-glass)]">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
          {/* Title */}
          <div className="h-5 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-lg w-3/4"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-lg"></div>
            <div className="h-3 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-lg w-5/6"></div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-[var(--border-glass)]">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded"></div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            {[1, 2].map((j) => (
              <div key={j} className="h-6 w-20 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-md"></div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-end pt-4 border-t border-[var(--border-glass)]">
            <div className="h-4 w-24 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded"></div>
            <div className="flex gap-2">
              {[1, 2].map((j) => (
                <div key={j} className="h-8 w-8 bg-gradient-to-r from-gray-300/20 to-gray-200/20 dark:from-gray-600/20 dark:to-gray-500/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventSkeleton;
