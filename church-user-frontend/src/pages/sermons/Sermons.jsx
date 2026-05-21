/**
 * SERMONS PAGE
 * Displays all sermons with search and category filtering
 * Responsive grid layout with glassmorphism cards
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSermons, useCategories } from "../../hooks/useSermons";
import { useTheme } from "../../hooks/useTheme";
import { Search, Play, Calendar, User, Filter } from "lucide-react";

const Sermons = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: sermons = [], isLoading, error } = useSermons({
    search: debouncedSearch,
    categoryId,
  });

  const { data: categories = [] } = useCategories();

  // Debounced search handler
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
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          Sermons
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Watch and explore our sermon collection
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className="p-6 rounded-xl"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: colors.text.muted }}
              />
              <input
                type="text"
                placeholder="Search sermons..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                  border: `1px solid ${colors.border.glass}`,
                  color: colors.text.primary,
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: colors.text.muted }}
              />
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all appearance-none cursor-pointer"
                style={{
                  background: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                  border: `1px solid ${colors.border.glass}`,
                  color: colors.text.primary,
                }}
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
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div
            className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: colors.accent.purple }}
          />
          <p style={{ color: colors.text.secondary }}>Loading sermons...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p style={{ color: colors.accent.pink }}>
            Failed to load sermons. Please try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && sermons.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p style={{ color: colors.text.secondary }}>
            No sermons found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Sermons Grid */}
      {!isLoading && !error && sermons.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div
                key={sermon._id}
                className="rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  ...glassmorphism.card,
                  background: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.45)",
                }}
                onClick={() => handleSermonDetails(sermon._id)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWatchSermon(sermon._id);
                      }}
                      className="p-4 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: colors.accent.purple,
                      }}
                    >
                      <Play size={24} style={{ color: "#fff" }} />
                    </button>
                  </div>

                  {/* Published/Draft Badge */}
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: sermon.isPublished
                        ? colors.accent.purple
                        : colors.accent.pink,
                      color: "#fff",
                    }}
                  >
                    {sermon.isPublished ? "Published" : "Draft"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category */}
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.accent.purple }}
                  >
                    {sermon.categoryId?.name || "Uncategorized"}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2"
                    style={{ color: colors.text.primary }}
                  >
                    {sermon.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {sermon.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div
                      className="flex items-center gap-1"
                      style={{ color: colors.text.muted }}
                    >
                      <User size={14} />
                      <span>{sermon.speakerName || "Unknown"}</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      style={{ color: colors.text.muted }}
                    >
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
        </div>
      )}
    </div>
  );
};

export default Sermons;
