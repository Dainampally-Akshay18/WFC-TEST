import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => {
  return (
    <div 
      className={`glass-card p-6 rounded-2xl flex items-start justify-between animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[var(--text-primary)]">{value}</h3>
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl bg-opacity-20 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
