/**
 * NOTIFICATION DETAILS PAGE
 * Displays single notification with full details
 * Automatically marks as read when viewed
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useNotificationDetails,
  useMarkAsRead,
} from "../../hooks/useNotifications";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const { data: notification, isLoading, error } = useNotificationDetails(id);
  const markAsReadMutation = useMarkAsRead();

  // Auto-mark as read when viewed
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsReadMutation.mutate(id);
    }
  }, [notification, id]);

  const handleBack = () => {
    navigate("/notifications");
  };

  const handleViewReference = () => {
    if (notification?.referenceId) {
      switch (notification.type) {
        case "BLOG":
          navigate(`/blogs/${notification.referenceId}`);
          break;
        case "EVENT":
          navigate(`/events/${notification.referenceId}`);
          break;
        case "PRAYER":
          navigate(`/prayers/${notification.referenceId}`);
          break;
        case "SERMON":
          navigate(`/sermons/${notification.referenceId}`);
          break;
        default:
          break;
      }
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      BLOG: "📝",
      EVENT: "📅",
      PRAYER: "🙏",
      APPROVAL: "✅",
      SERMON: "🎤",
    };
    return iconMap[type] || "🔔";
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      BLOG: colors.accent.purple,
      EVENT: colors.accent.blue,
      PRAYER: colors.accent.pink,
      APPROVAL: colors.accent.purple,
      SERMON: colors.accent.purple,
    };
    return colorMap[type] || colors.accent.purple;
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
          <p style={{ color: colors.text.secondary }}>
            Loading notification...
          </p>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background.primary }}
      >
        <div className="text-center">
          <p style={{ color: colors.accent.pink }} className="mb-4">
            Failed to load notification details.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg"
            style={{
              background: colors.accent.purple,
              color: "#fff",
            }}
          >
            Back to Notifications
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
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          <ArrowLeft size={20} />
          <span>Back to Notifications</span>
        </button>

        {/* Notification Card */}
        <div
          className="rounded-xl p-8"
          style={{
            ...glassmorphism.card,
            background: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.45)",
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-6"
            style={{
              background: isDarkMode
                ? "rgba(176,38,255,0.2)"
                : "rgba(109,40,217,0.15)",
            }}
          >
            {getNotificationIcon(notification.type)}
          </div>

          {/* Type Badge */}
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
            style={{
              background: isDarkMode
                ? "rgba(176,38,255,0.2)"
                : "rgba(109,40,217,0.15)",
              color: getNotificationColor(notification.type),
            }}
          >
            {notification.type}
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            {notification.title}
          </h1>

          {/* Message */}
          <p
            className="text-lg leading-relaxed mb-6"
            style={{ color: colors.text.secondary }}
          >
            {notification.message}
          </p>

          {/* Date */}
          <div
            className="flex items-center gap-2 mb-6"
            style={{ color: colors.text.muted }}
          >
            <Calendar size={18} />
            <span>
              {new Date(notification.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* View Reference Button */}
          {notification.referenceId && (
            <button
              onClick={handleViewReference}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
              style={{
                background: colors.accent.purple,
                color: "#fff",
              }}
            >
              <ExternalLink size={20} />
              <span>View Related Content</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
