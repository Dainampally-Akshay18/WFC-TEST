/**
 * SERMON CATEGORY PAGE
 * Category-based sermon filtering with reusable UI
 * Displays sermons filtered by selected category
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSermons, useCategories } from "../../hooks/useSermons";
import { useTheme } from "../../hooks/useTheme";
import { Play, Calendar, User, Filter } from "lucide-react";

const SermonCategory = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const {
    data: sermons = [],
    isLoading: sermonsLoading,
    error,
  } = useSermons({
    categoryId: selectedCategoryId,
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleWatchSermon = (sermonId) => {
    navigate(`/sermons/watch/${sermonId}`);
  };

  const handleSermonDetails = (sermonId) => {
    navigate(`/sermons/${sermonId}`);
  };

  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  );

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
          Sermon Categories
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Browse sermons by category
        </p>
      </div>

      {/* Category Filter */}
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
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} style={{ color: colors.accent.purple }} />
            <h2
              className="text-xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Select Category
            </h2>
          </div>

          {categoriesLoading ? (
            <p style={{ color: colors.text.secondary }}>
              Loading categories...
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleCategorySelect("")}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategoryId === "" ? "scale-105" : ""
                }`}
                style={{
                  background:
                    selectedCategoryId === ""
                      ? colors.accent.purple
                      : isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.6)",
                  color:
                    selectedCategoryId === "" ? "#fff" : colors.text.primary,
                  border: `1px solid ${
                    selectedCategoryId === ""
                      ? colors.accent.purple
                      : colors.border.glass
                  }`,
                }}
              >
                All Sermons
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategorySelect(category._id)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategoryId === category._id ? "scale-105" : ""
                  }`}
                  style={{
                    background:
                      selectedCategoryId === category._id
                        ? colors.accent.purple
                        : isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.6)",
                    color:
                      selectedCategoryId === category._id
                        ? "#fff"
                        : colors.text.primary,
                    border: `1px solid ${
                      selectedCategoryId === category._id
                        ? colors.accent.purple
                        : colors.border.glass
                    }`,
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Selected Category Description */}
          {selectedCategory && (
            <div
              className="mt-6 p-4 rounded-lg"
              style={{
                background: isDarkMode
                  ? "rgba(176,38,255,0.1)"
                  : "rgba(109,40,217,0.08)",
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              <h3
                className="font-bold mb-2"
                style={{ color: colors.accent.purple }}
              >
                {selectedCategory.name}
              </h3>
              <p style={{ color: colors.text.secondary }}>
                {selectedCategory.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {sermonsLoading && (
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
      {!sermonsLoading && !error && sermons.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p style={{ color: colors.text.secondary }}>
            No sermons found in this category.
          </p>
        </div>
      )}

      {/* Sermons Grid */}
      {!sermonsLoading && !error && sermons.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <p style={{ color: colors.text.secondary }}>
              {sermons.length} sermon{sermons.length !== 1 ? "s" : ""} found
            </p>
          </div>
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

export default SermonCategory;
