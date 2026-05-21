/**
 * MY PRAYERS PAGE
 * Displays current user's prayer requests with edit/delete functionality
 * Admin status update support
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePrayers,
  useDeletePrayer,
  useUpdatePrayerStatus,
} from "../../hooks/usePrayers";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Heart, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { USER_ROLES } from "../../constants/role.constants";

const MyPrayers = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();
  const { user } = useAuth();

  const { data: allPrayers = [], isLoading, error } = usePrayers();
  const deletePrayerMutation = useDeletePrayer();
  const updateStatusMutation = useUpdatePrayerStatus();

  const [deletingId, setDeletingId] = useState(null);

  // Filter prayers created by current user
  const myPrayers = allPrayers.filter(
    (prayer) => prayer.createdBy === user?.userId
  );

  const isAdmin =
    user?.role === USER_ROLES.LEADER ||
    user?.role === USER_ROLES.MASTER_ADMIN;

  const handleEdit = (prayerId) => {
    navigate(`/prayers/edit/${prayerId}`);
  };

  const handleDelete = async (prayerId) => {
    if (!window.confirm("Are you sure you want to delete this prayer request?")) {
      return;
    }

    setDeletingId(prayerId);
    try {
      await deletePrayerMutation.mutateAsync(prayerId);
    } catch (error) {
      console.error("Failed to delete prayer:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (prayerId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: prayerId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
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

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          <ArrowLeft size={20} />
          <span>Back to All Prayers</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            My Prayer Requests
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Manage your prayer requests
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div
              className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: colors.accent.purple }}
            />
            <p style={{ color: colors.text.secondary }}>Loading prayers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p style={{ color: colors.accent.pink }}>
              Failed to load prayers. Please try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && myPrayers.length === 0 && (
          <div className="text-center py-20">
            <p style={{ color: colors.text.secondary }} className="mb-4">
              You haven't created any prayer requests yet.
            </p>
            <button
              onClick={() => navigate("/prayers/create")}
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
        {!isLoading && !error && myPrayers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPrayers.map((prayer) => (
              <div
                key={prayer._id}
                className="rounded-xl p-6 transition-all duration-300"
                style={{
                  ...glassmorphism.card,
                  background: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.45)",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  {isAdmin ? (
                    <select
                      value={prayer.status}
                      onChange={(e) =>
                        handleStatusChange(prayer._id, e.target.value)
                      }
                      className="px-3 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer"
                      style={{
                        background: isDarkMode
                          ? "rgba(176,38,255,0.2)"
                          : "rgba(109,40,217,0.15)",
                        color: getStatusColor(prayer.status),
                        border: "none",
                      }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PRAYED">PRAYED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  ) : (
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
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(prayer._id)}
                      className="p-2 rounded-lg transition-opacity hover:opacity-80"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Edit size={16} style={{ color: colors.accent.purple }} />
                    </button>
                    <button
                      onClick={() => handleDelete(prayer._id)}
                      disabled={deletingId === prayer._id}
                      className="p-2 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Trash2 size={16} style={{ color: colors.accent.pink }} />
                    </button>
                  </div>
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
                <div className="flex items-center justify-between text-xs mb-4">
                  <div
                    className="flex items-center gap-1"
                    style={{ color: colors.text.muted }}
                  >
                    <Calendar size={14} />
                    <span>
                      {new Date(prayer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {prayer.isAnonymous && (
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                        color: colors.text.muted,
                      }}
                    >
                      Anonymous
                    </span>
                  )}
                </div>

                {/* Prayer Count */}
                <div
                  className="pt-4 flex items-center gap-2"
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
        )}
      </div>
    </div>
  );
};

export default MyPrayers;
