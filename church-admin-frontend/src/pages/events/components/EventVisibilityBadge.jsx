import React from 'react';

const EventVisibilityBadge = ({ visibility }) => {
  let colorClass = '';
  let icon = '';

  switch (visibility) {
    case 'GLOBAL':
      colorClass =
        'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30';
      icon = '🌍';
      break;
    case 'BRANCH':
      colorClass =
        'bg-gradient-to-r from-emerald-500/20 to-orange-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30';
      icon = '🏢';
      break;
    default:
      colorClass = 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30';
      icon = '📅';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md inline-flex items-center gap-1 ${colorClass}`}>
      <span>{icon}</span>
      {visibility || 'Unknown'}
    </span>
  );
};

export default EventVisibilityBadge;
