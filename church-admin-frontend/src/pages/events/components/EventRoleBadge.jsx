import React from 'react';

const EventRoleBadge = ({ role }) => {
  let colorClass = '';

  switch (role) {
    case 'MASTER_ADMIN':
      colorClass = 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30';
      break;
    case 'LEADER':
      colorClass = 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30';
      break;
    case 'USER':
      colorClass = 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30';
      break;
    default:
      colorClass = 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${colorClass}`}>
      {role?.replace('_', ' ') || 'Unknown'}
    </span>
  );
};

export default EventRoleBadge;
