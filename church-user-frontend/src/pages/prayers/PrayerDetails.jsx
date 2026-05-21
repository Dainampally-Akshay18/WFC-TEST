/**
 * PRAYER DETAILS PAGE
 * Displays full prayer request with prayed toggle
 * Premium glassmorphism UI with spiritual aesthetic
 */

import { useParams, useNavigate } from "react-router-dom";
import { usePrayerDetails, useTogglePrayer } from "../../hooks/usePrayers";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, Heart, Calendar, User } from "lucide-react";

const PrayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const { data: prayer, isLoading, error } = usePrayerDetails(id);
  const togglePrayerMutation = useTogglePrayer();

  const handleTogglePrayer = async () => {
    try {
      await togglePrayerMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to toggle prayer:", error);
    }
  };

  const handleBack = () => {
    navigate("/prayers");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return colors.accent.purple;
      case "PRAYED":
        return colors.accent.blue;
      case "ARCHIVED":
        return colors.text.muted;
      default:
        return colors.accent.purple;
    }
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
          <p style={{ color: colors.text.secondary }}>Loading prayer...</p>
        </div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background.primary }}
      >
        <div className="text-center">
          <p style={{ color: colors.accent.pink }} className="mb-4">
            Failed to load prayer details.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg"
            style={{
              background: colors.accent.purple,
              color: "#fff",
            }}
          >
            Back to Prayers
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
          <span>Back to Prayers</span>
        </button>

        {/* Prayer Card */}
        <div
          className="rounded-xl p-8"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: isDarkMode
                  ? "rgba(176,38,255,0.2)"
                  : "rgba(109,40,217,0.15)",
                color: getStatusColor(prayer.status),
              }}
            >
              {prayer.status}
            </div>
            <button
              onClick={handleTogglePrayer}
              disabled={togglePrayerMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 disabled:opacity-50"
              style={{
                background: prayer.hasPrayed
                  ? colors.accent.pink
                  : isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.6)",
                color: prayer.hasPrayed ? "#fff" : colors.text.primary,
                border: `1px solid ${
                  prayer.hasPrayed ? colors.accent.pink : colors.border.glass
                }`,
              }}
            >
              <Heart
                size={20}
                fill={prayer.hasPrayed ? "#fff" : "none"}
              />
              <span>{prayer.hasPrayed ? "Prayed" : "Pray for this"}</span>
            </button>
          </div>

          {/* Title */}
          <h1
            className="text-4xl font-bold mb-6"
            style={{ color: colors.text.primary }}
          >
            {prayer.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div
              className="flex items-center gap-2"
              style={{ color: colors.text.secondary }}
            >
              <User size={18} />
              <span>{prayer.creatorName}</span>
            </div>
            <div
              className="flex items-center gap-2"
              style={{ color: colors.text.secondary }}
            >
              <Calendar size={18} />
              <span>
                {new Date(prayer.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div
            className="text-lg leading-relaxed whitespace-pre-wrap mb-8"
            style={{ color: colors.text.secondary }}
          >
            {prayer.description}
          </div>

          {/* Prayer Count */}
          <div
            className="pt-6 flex items-center gap-3"
            style={{ borderTop: `1px solid ${colors.border.glass}` }}
          >
            <Heart size={24} style={{ color: colors.accent.pink }} />
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                {prayer.prayerCount}
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {prayer.prayerCount === 1 ? "person has" : "people have"} prayed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerDetails;
