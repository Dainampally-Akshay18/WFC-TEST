import React from 'react';

const SermonCategorySkeleton = ({ count = 3, viewMode = 'card' }) => {
  if (viewMode === 'table') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="p-4">
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border-glass)]">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <td key={col} className="p-4">
                      <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-32" />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden border border-white/50 dark:border-white/10 animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full h-40 bg-black/10 dark:bg-white/10" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-black/10 dark:bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-2/3" />
            
            {/* Footer Skeleton */}
            <div className="flex justify-between items-center pt-2 border-t border-[var(--border-glass)]">
              <div className="h-5 bg-black/10 dark:bg-white/10 rounded-full w-16" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-lg" />
                <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonCategorySkeleton;
