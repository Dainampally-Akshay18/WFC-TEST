import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card h-[400px] rounded-2xl" />
        <div className="glass-card h-[400px] rounded-2xl" />
      </div>
      <div className="glass-card h-[400px] rounded-2xl" />
    </div>
  );
};

export default DashboardSkeleton;
