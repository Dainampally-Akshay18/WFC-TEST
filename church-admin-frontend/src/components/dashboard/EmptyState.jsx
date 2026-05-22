import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ message = "No statistics data available." }) => {
  return (
    <div className="glass-card flex flex-col items-center justify-center p-12 rounded-2xl animate-fade-in text-center h-64">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Data Found</h3>
      <p className="text-[var(--text-secondary)]">{message}</p>
    </div>
  );
};

export default EmptyState;
