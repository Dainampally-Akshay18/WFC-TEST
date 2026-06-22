import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSermons, useCategories } from "../../hooks/useSermons";
import { Search, Play, Calendar, User, Filter } from "lucide-react";

const Sermons = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: sermons = [], isLoading, error } = useSermons({
    search: debouncedSearch,
    categoryId,
  });

  const { data: categories = [] } = useCategories();

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);

    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleWatchSermon = (sermonId) => {
    navigate(`/sermons/watch/${sermonId}`);
  };

  const handleSermonDetails = (sermonId) => {
    navigate(`/sermons/${sermonId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">
            Sermons
          </h1>
          <p className="text-[#64748B]">
            Watch and explore our sermon collection
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search sermons..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                size={20}
              />
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all appearance-none cursor-pointer bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-[#E2E8F0] border-t-[#2563EB] animate-spin mx-auto mb-4" />
            <p className="text-[#64748B]">Loading sermons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600">
              Failed to load sermons. Please try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sermons.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center">
            <Play size={48} className="mx-auto mb-4 text-[#94A3B8]" />
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No sermons found</h3>
            <p className="text-[#64748B]">
              Try adjusting your filters or search term
            </p>
          </div>
        )}

        {/* Sermons Grid */}
        {!isLoading && !error && sermons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div
                key={sermon._id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                onClick={() => handleSermonDetails(sermon._id)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-[#F5F9FF]">
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWatchSermon(sermon._id);
                      }}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] p-4 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    >
                      <Play size={24} className="text-white fill-white" />
                    </button>
                  </div>

                  {/* Published Badge */}
                  {sermon.isPublished && (
                    <div className="absolute top-3 right-3 bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Published
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {sermon.categoryId?.name && (
                    <div className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-3">
                      {sermon.categoryId.name}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                    {sermon.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#64748B] mb-4 line-clamp-2">
                    {sermon.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{sermon.speakerName || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>
                        {new Date(sermon.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sermons;
