/**
 * NOTIFICATIONS PAGE
 * Displays user notifications with pagination and filtering
 * Real-time unread count with polling
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../../hooks/useNotifications";
import { useTheme } from "../../hooks/useTheme";
import { Bell, Check, CheckCheck, Calendar } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, isDarkMode } = useTheme();

  const [page, setPage] = useState(1);
  const [isReadFilter, setIsReadFilter] = useState(undefined);

  const {
    data: notificationData,
    isLoading,
    error,
  } = useNotifications({
    page,
    limit: 20,
    isRead: isReadFilter,
  });

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationData?.notifications || [];
  const pagination = notificationData?.pagination || {};
  const unreadCount = notificationData?.unreadCount || 0;

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync(notification._id);
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // Navigate based on notification type
    if (notification.referenceId) {
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

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
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

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell size={32} style={{ color: colors.accent.purple }} />
              <div>
                <h1
                  className="text-4xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p style={{ color: colors.text.secondary }}>
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105 disabled:opacity-50"
                style={{
                  background: colors.accent.purple,
                  color: "#fff",
                }}
              >
                <CheckCheck size={18} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsReadFilter(undefined)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isReadFilter === undefined ? "scale-105" : ""
              }`}
              style={{
                background:
                  isReadFilter === undefined
                    ? colors.accent.purple
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                color:
                  isReadFilter === undefined ? "#fff" : colors.text.primary,
                border: `1px solid ${
                  isReadFilter === undefined
                    ? colors.accent.purple
                    : colors.border.glass
                }`,
              }}
            >
              All
            </button>
            <button
              onClick={() => setIsReadFilter(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isReadFilter === false ? "scale-105" : ""
              }`}
              style={{
                background:
                  isReadFilter === false
                    ? colors.accent.purple
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                color: isReadFilter === false ? "#fff" : colors.text.primary,
                border: `1px solid ${
                  isReadFilter === false
                    ? colors.accent.purple
                    : colors.border.glass
                }`,
              }}
            >
              Unread
            </button>
            <button
              onClick={() => setIsReadFilter(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isReadFilter === true ? "scale-105" : ""
              }`}
              style={{
                background:
                  isReadFilter === true
                    ? colors.accent.purple
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                color: isReadFilter === true ? "#fff" : colors.text.primary,
                border: `1px solid ${
                  isReadFilter === true
                    ? colors.accent.purple
                    : colors.border.glass
                }`,
              }}
            >
              Read
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div
              className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: colors.accent.purple }}
            />
            <p style={{ color: colors.text.secondary }}>
              Loading notifications...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p style={{ color: colors.accent.pink }}>
              Failed to load notifications. Please try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell size={48} style={{ color: colors.text.muted }} className="mx-auto mb-4" />
            <p style={{ color: colors.text.secondary }}>
              No notifications to display.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className="rounded-xl p-5 transition-all duration-300 hover:scale-102 cursor-pointer"
                style={{
                  ...glassmorphism.card,
                  background: notification.isRead
                    ? isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.3)"
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.6)",
                  border: `1px solid ${
                    notification.isRead
                      ? colors.border.glass
                      : colors.accent.purple
                  }`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: isDarkMode
                        ? "rgba(176,38,255,0.2)"
                        : "rgba(109,40,217,0.15)",
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div
                          className="flex-shrink-0 w-2 h-2 rounded-full"
                          style={{ background: colors.accent.purple }}
                        />
                      )}
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: colors.text.muted }}
                      >
                        <Calendar size={12} />
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: isDarkMode
                            ? "rgba(176,38,255,0.15)"
                            : "rgba(109,40,217,0.1)",
                          color: getNotificationColor(notification.type),
                        }}
                      >
                        {notification.type}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.6)",
                color: colors.text.primary,
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              Previous
            </button>
            <span style={{ color: colors.text.secondary }}>
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.6)",
                color: colors.text.primary,
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
