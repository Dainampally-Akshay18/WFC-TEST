/**
 * PRAYERS PAGE
 * Displays all prayer requests with prayed toggle functionality
 * Responsive glassmorphism cards with spiritual aesthetic
 */

import { useNavigate } from "react-router-dom";
import { usePrayers, useTogglePrayer } from "../../hooks/usePrayers";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Heart, Calendar, User, Plus } from "lucide-react";

const Prayers = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();
  const { user } = useAuth();

  const { data: prayers = [], isLoading, error } = usePrayers();
  const togglePrayerMutation = useTogglePrayer();

  const handleTogglePrayer = async (prayerId, e) => {
    e.stopPropagation();
    try {
      await togglePrayerMutation.mutateAsync(prayerId);
    } catch (error) {
      console.error("Failed to toggle prayer:", error);
    }
  };

  const handlePrayerDetails = (prayerId) => {
    navigate(`/prayers/${prayerId}`);
  };

  const handleCreatePrayer = () => {
    navigate("/prayers/create");
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

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: colors.text.primary }}
            >
              Prayer Requests
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Join us in prayer for our community
            </p>
          </div>
          <button
            onClick={handleCreatePrayer}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
            style={{
              background: colors.accent.purple,
              color: "#fff",
            }}
          >
            <Plus size={20} />
            New Prayer
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div
            className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: colors.accent.purple }}
          />
          <p style={{ color: colors.text.secondary }}>Loading prayers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p style={{ color: colors.accent.pink }}>
            Failed to load prayers. Please try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && prayers.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p style={{ color: colors.text.secondary }} className="mb-4">
            No prayer requests yet. Be the first to share.
          </p>
          <button
            onClick={handleCreatePrayer}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              background: colors.accent.purple,
              color: "#fff",
            }}
          >
            Create Prayer Request
          </button>
        </div>
      )}

      {/* Prayers Grid */}
      {!isLoading && !error && prayers.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayers.map((prayer) => (
              <div
                key={prayer._id}
                className="rounded-xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  ...glassmorphism.card,
                  background: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.45)",
                }}
                onClick={() => handlePrayerDetails(prayer._id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold"
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
                    onClick={(e) => handleTogglePrayer(prayer._id, e)}
                    className="transition-transform hover:scale-110"
                    disabled={togglePrayerMutation.isPending}
                  >
                    <Heart
                      size={24}
                      fill={prayer.hasPrayed ? colors.accent.pink : "none"}
                      style={{
                        color: prayer.hasPrayed
                          ? colors.accent.pink
                          : colors.text.muted,
                      }}
                    />
                  </button>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 line-clamp-2"
                  style={{ color: colors.text.primary }}
                >
                  {prayer.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: colors.text.secondary }}
                >
                  {prayer.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs">
                  <div
                    className="flex items-center gap-1"
                    style={{ color: colors.text.muted }}
                  >
                    <User size={14} />
                    <span>{prayer.creatorName}</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    style={{ color: colors.text.muted }}
                  >
                    <Calendar size={14} />
                    <span>
                      {new Date(prayer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Prayer Count */}
                <div
                  className="mt-4 pt-4 flex items-center gap-2"
                  style={{ borderTop: `1px solid ${colors.border.glass}` }}
                >
                  <Heart size={16} style={{ color: colors.accent.pink }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: colors.text.secondary }}
                  >
                    {prayer.prayerCount} {prayer.prayerCount === 1 ? "person" : "people"} prayed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prayers;
