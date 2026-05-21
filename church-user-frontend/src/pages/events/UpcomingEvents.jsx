/**
 * UPCOMING EVENTS
 * Reusable component for displaying upcoming events section
 */

import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Calendar, Clock, MapPin } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useEvents } from "../../hooks/useEvents";

export const UpcomingEvents = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();
  const { data: events = [], isLoading, error } = useEvents();

  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.accent.purple }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg border px-4 py-4"
        style={{
          borderColor: colors.accent.blue,
          background: `rgba(59,130,255,0.1)`,
        }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" style={{ color: colors.accent.blue }} />
          <p style={{ color: colors.text.secondary }} className="text-sm">
            Failed to load upcoming events
          </p>
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.text.muted }}>No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <div
          key={event._id}
          style={{
            background: glassmorphism.card.background,
            border: `1px solid ${glassmorphism.card.border}`,
            backdropFilter: glassmorphism.card.backdropFilter,
            boxShadow: shadows.sm,
          }}
          className="group cursor-pointer rounded-lg p-4 transition-all duration-300 hover:shadow-md"
          onClick={() => handleEventClick(event._id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = glassmorphism.cardHover.background;
            e.currentTarget.style.border = `1px solid ${glassmorphism.cardHover.border}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = glassmorphism.card.background;
            e.currentTarget.style.border = `1px solid ${glassmorphism.card.border}`;
          }}
        >
          <div className="flex gap-4">
            {/* DATE BADGE */}
            <div
              className="flex flex-col items-center justify-center rounded-lg px-3 py-2 flex-shrink-0"
              style={{
                background: `rgba(176,38,255,0.15)`,
                border: `1px solid ${colors.accent.purple}40`,
              }}
            >
              <p style={{ color: colors.accent.purple }} className="text-xs font-bold uppercase">
                {formatDate(event.date).split(" ")[0]}
              </p>
              <p style={{ color: colors.accent.purple }} className="text-sm font-bold">
                {formatDate(event.date).split(" ")[1]}
              </p>
            </div>

            {/* EVENT INFO */}
            <div className="flex-1 min-w-0">
              <h4
                className="line-clamp-1 font-semibold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                {event.title}
              </h4>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" style={{ color: colors.accent.blue }} />
                  <span style={{ color: colors.text.secondary }}>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" style={{ color: colors.accent.pink }} />
                  <span style={{ color: colors.text.secondary }} className="truncate">
                    {event.location}
                  </span>
                </div>
              </div>
            </div>

            {/* VISIBILITY BADGE */}
            <div
              className="rounded-full px-2 py-1 text-xs font-medium flex-shrink-0"
              style={{
                background:
                  event.visibility === "GLOBAL"
                    ? `rgba(176,38,255,0.15)`
                    : `rgba(59,130,255,0.15)`,
                color:
                  event.visibility === "GLOBAL"
                    ? colors.accent.purple
                    : colors.accent.blue,
                border: `1px solid ${colors.border.glass}`,
              }}
            >
              {event.visibility === "GLOBAL" ? "Global" : event.branch}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;
