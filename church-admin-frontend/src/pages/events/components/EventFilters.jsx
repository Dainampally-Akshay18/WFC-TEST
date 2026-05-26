import React from 'react';
import { Search, X } from 'lucide-react';
import { useEventsStore } from '../../../store/eventsStore';

const EventFilters = ({ branches = [] }) => {
  const { filters, updateFilters, clearFilters, applyFilters } = useEventsStore();

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleVisibilityChange = (e) => {
    updateFilters({ visibility: e.target.value });
  };

  const handleBranchChange = (e) => {
    updateFilters({ branch: e.target.value });
  };

  const handleDateFromChange = (e) => {
    updateFilters({ dateFrom: e.target.value });
  };

  const handleDateToChange = (e) => {
    updateFilters({ dateTo: e.target.value });
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    clearFilters();
    applyFilters();
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== '');

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up space-y-4 border border-white/50 dark:border-white/10">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search events by title or description..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Visibility Filter */}
        <select
          value={filters.visibility}
          onChange={handleVisibilityChange}
          className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value="">All Visibility</option>
          <option value="GLOBAL">Global Events</option>
          <option value="BRANCH">Branch Events</option>
        </select>

        {/* Branch Filter */}
        <select
          value={filters.branch}
          onChange={handleBranchChange}
          className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        {/* Date From */}
        <input
          type="date"
          value={filters.dateFrom}
          onChange={handleDateFromChange}
          className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          placeholder="From Date"
        />

        {/* Date To */}
        <input
          type="date"
          value={filters.dateTo}
          onChange={handleDateToChange}
          className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          placeholder="To Date"
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all hover:shadow-lg active:scale-95"
          >
            Apply
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
