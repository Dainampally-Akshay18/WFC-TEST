/**
 * SERMON DETAILS PAGE
 * Displays full sermon information with metadata
 * Premium typography and glassmorphism UI
 */

import { useParams, useNavigate } from "react-router-dom";
import { useSermonDetails } from "../../hooks/useSermons";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, Play, Calendar, User, Tag } from "lucide-react";

const SermonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const { data: sermon, isLoading, error } = useSermonDetails(id);

  const handleWatchSermon = () => {
    navigate(`/sermons/watch/${id}`);
  };

  const handleBack = () => {
    navigate("/sermons");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background.primary }}
      >
        <div className="text-center">
          <div
            className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: colors.accent.purple }}
          />
          <p style={{ color: colors.text.secondary }}>Loading sermon...</p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background.primary }}
      >
        <div className="text-center">
          <p style={{ color: colors.accent.pink }} className="mb-4">
            Failed to load sermon details.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg"
            style={{
              background: colors.accent.purple,
              color: "#fff",
            }}
          >
            Back to Sermons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          <ArrowLeft size={20} />
          <span>Back to Sermons</span>
        </button>

        {/* Hero Section */}
        <div
          className="rounded-xl overflow-hidden mb-8"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          {/* Thumbnail */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={sermon.thumbnail}
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.4)",
              }}
            >
              <button
                onClick={handleWatchSermon}
                className="p-6 rounded-full transition-transform hover:scale-110"
                style={{
                  background: colors.accent.purple,
                }}
              >
                <Play size={32} style={{ color: "#fff" }} />
              </button>
            </div>

            {/* Status Badge */}
            <div
              className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold"
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
          <div className="p-8">
            {/* Category */}
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
              style={{
                background: isDarkMode
                  ? "rgba(176,38,255,0.2)"
                  : "rgba(109,40,217,0.15)",
                color: colors.accent.purple,
              }}
            >
              {sermon.categoryId?.name || "Uncategorized"}
            </div>

            {/* Title */}
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {sermon.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div
                className="flex items-center gap-2"
                style={{ color: colors.text.secondary }}
              >
                <User size={18} />
                <span>{sermon.speakerName || "Unknown Speaker"}</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: colors.text.secondary }}
              >
                <Calendar size={18} />
                <span>
                  {new Date(sermon.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {sermon.categoryId && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: colors.text.secondary }}
                >
                  <Tag size={18} />
                  <span>{sermon.categoryId.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div
              className="text-lg leading-relaxed whitespace-pre-wrap"
              style={{ color: colors.text.secondary }}
            >
              {sermon.description}
            </div>

            {/* Watch Button */}
            <button
              onClick={handleWatchSermon}
              className="mt-8 px-8 py-3 rounded-lg font-semibold transition-transform hover:scale-105 flex items-center gap-2"
              style={{
                background: colors.accent.purple,
                color: "#fff",
              }}
            >
              <Play size={20} />
              Watch Sermon
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {sermon.categoryId?.description && (
          <div
            className="rounded-xl p-6"
            style={{
              ...glassmorphism.card,
              background: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.45)",
            }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              About {sermon.categoryId.name}
            </h3>
            <p style={{ color: colors.text.secondary }}>
              {sermon.categoryId.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonDetails;
