import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useUserStore } from '../../../store/userStore';

const UserFilters = () => {
  const { filters, updateFilters, clearFilters } = useUserStore();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  return (
    <div className="glass-card p-4 rounded-xl mb-6 animate-fade-in flex flex-col md:flex-row gap-4 justify-between items-center">
      <form onSubmit={handleSearch} className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search users..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--border-glass)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-[var(--text-primary)]"
        />
      </form>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg border border-[var(--border-glass)]">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        
        <select
          value={filters.role}
          onChange={(e) => updateFilters({ role: e.target.value })}
          className="bg-transparent border border-[var(--border-glass)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Roles</option>
          <option value="MASTER_ADMIN">Master Admin</option>
          <option value="LEADER">Leader</option>
          <option value="USER">User</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="bg-transparent border border-[var(--border-glass)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={filters.branch}
          onChange={(e) => updateFilters({ branch: e.target.value })}
          className="bg-transparent border border-[var(--border-glass)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Branches</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>

        {(filters.search || filters.role || filters.status || filters.branch) && (
          <button
            onClick={() => {
              setLocalSearch('');
              clearFilters();
            }}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-red-500 transition-colors flex items-center justify-center flex-shrink-0"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
