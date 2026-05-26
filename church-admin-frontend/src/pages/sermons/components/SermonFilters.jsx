import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSermonStore } from '../../../store/sermonStore';

const SermonFilters = () => {
  const { filters, categories, updateFilters, clearFilters, fetchCategories } = useSermonStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  const hasActiveFilters = filters.search || filters.categoryId || filters.status;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in-up border border-white/50 dark:border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search sermons..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.categoryId}
          onChange={(e) => updateFilters({ categoryId: e.target.value })}
          className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30 font-medium"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SermonFilters;
