import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'PENDING':
      colorClass = 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30';
      break;
    case 'APPROVED':
      colorClass = 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30';
      break;
    case 'REJECTED':
      colorClass = 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30';
      break;
    default:
      colorClass = 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
