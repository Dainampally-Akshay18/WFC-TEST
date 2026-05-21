/**
 * WATCH SERMON PAGE
 * Embedded YouTube player with sermon details
 * Responsive video container with proper aspect ratio
 */

import { useParams, useNavigate } from "react-router-dom";
import { useSermonDetails } from "../../hooks/useSermons";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const WatchSermon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const { data: sermon, isLoading, error } = useSermonDetails(id);

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
            Failed to load sermon.
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
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          <ArrowLeft size={20} />
          <span>Back to Sermons</span>
        </button>

        {/* Video Player Section */}
        <div
          className="rounded-xl overflow-hidden mb-8"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${sermon.youtubeVideoId}`}
              title={sermon.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Sermon Details */}
          <div className="p-6">
            {/* Category Badge */}
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
              className="text-3xl font-bold mb-4"
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
              className="text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: colors.text.secondary }}
            >
              {sermon.description}
            </div>
          </div>
        </div>

        {/* Category Info */}
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

export default WatchSermon;
