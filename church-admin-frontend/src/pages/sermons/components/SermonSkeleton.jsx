import React from 'react';

const SermonSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4 border border-white/50 dark:border-white/10 space-y-3 animate-pulse">
          <div className="flex gap-4">
            {/* Thumbnail Skeleton */}
            <div className="w-24 h-24 rounded-lg bg-black/10 dark:bg-white/10 flex-shrink-0" />
            
            {/* Content Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-full" />
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-2/3" />
              <div className="flex gap-2 mt-3">
                <div className="h-5 bg-black/10 dark:bg-white/10 rounded-full w-20" />
                <div className="h-5 bg-black/10 dark:bg-white/10 rounded-full w-20" />
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-lg" />
              <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-lg" />
              <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SermonSkeleton;
