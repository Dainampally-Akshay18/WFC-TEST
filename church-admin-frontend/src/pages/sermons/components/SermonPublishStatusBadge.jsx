import React from 'react';

const SermonPublishStatusBadge = ({ isPublished }) => {
  if (isPublished) {
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
        <span>✓</span> Published
      </span>
    );
  }
  
  return (
    <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
      <span>✎</span> Draft
    </span>
  );
};

export default SermonPublishStatusBadge;
