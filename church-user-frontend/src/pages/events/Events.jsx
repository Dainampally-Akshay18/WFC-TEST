/**
 * EVENTS PAGE
 * Event listing with upcoming events, filtering, and details
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Calendar, Clock, MapPin, Eye } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useEvents } from "../../hooks/useEvents";

const Events = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();
  const { data: events = [], isLoading, error } = useEvents();
  const [sortBy, setSortBy] = useState("upcoming");

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const getVisibilityBadge = (visibility, branch) => {
    return visibility === "GLOBAL" ? "GLOBAL" : `${branch || "BRANCH"}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1
          className="mb-2 text-4xl font-bold md:text-5xl"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Church Events
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Upcoming services, meetings, and community events
        </p>
      </div>

      {/* SORT OPTIONS */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy("upcoming")}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            background:
              sortBy === "upcoming"
                ? `linear-gradient(135deg, ${colors.accent.purple}60, ${colors.accent.pink}40)`
                : `rgba(255,255,255,0.05)`,
            color: colors.text.primary,
            border: `1px solid ${sortBy === "upcoming" ? colors.accent.purple : colors.border.glass}`,
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setSortBy("all")}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            background:
              sortBy === "all"
                ? `linear-gradient(135deg, ${colors.accent.purple}60, ${colors.accent.pink}40)`
                : `rgba(255,255,255,0.05)`,
            color: colors.text.primary,
            border: `1px solid ${sortBy === "all" ? colors.accent.purple : colors.border.glass}`,
          }}
        >
          All Events
        </button>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" style={{ color: colors.accent.purple }} />
            <p style={{ color: colors.text.secondary }}>Loading events...</p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div
          className="rounded-lg border px-4 py-4"
          style={{
            borderColor: colors.accent.blue,
            background: `rgba(59,130,255,0.1)`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: colors.accent.blue }} />
            <div>
              <h3 className="font-semibold" style={{ color: colors.text.primary }}>
                Failed to load events
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm">
                {error.message || "An error occurred while fetching events"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && sortedEvents.length === 0 && !error && (
        <div className="text-center py-12">
          <Calendar className="mx-auto mb-4 h-12 w-12" style={{ color: colors.text.muted }} />
          <p style={{ color: colors.text.muted }} className="text-lg">
            No events available
          </p>
        </div>
      )}

      {/* EVENTS GRID */}
      {!isLoading && sortedEvents.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event) => (
            <div
              key={event._id}
              style={{
                background: glassmorphism.card.background,
                border: `1px solid ${glassmorphism.card.border}`,
                backdropFilter: glassmorphism.card.backdropFilter,
                boxShadow: shadows.md,
              }}
              className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = glassmorphism.cardHover.background;
                e.currentTarget.style.border = `1px solid ${glassmorphism.cardHover.border}`;
                e.currentTarget.style.boxShadow = glassmorphism.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = glassmorphism.card.background;
                e.currentTarget.style.border = `1px solid ${glassmorphism.card.border}`;
                e.currentTarget.style.boxShadow = shadows.md;
              }}
              onClick={() => handleEventClick(event._id)}
            >
              {/* HEADER WITH VISIBILITY BADGE */}
              <div className="flex items-start justify-between gap-4 border-b p-6" style={{ borderColor: colors.border.glass }}>
                <div className="flex-1 min-w-0">
                  <h3
                    className="mb-2 line-clamp-2 text-lg font-bold transition-colors duration-200"
                    style={{ color: colors.text.primary }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: colors.text.secondary }} className="text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap flex-shrink-0"
                  style={{
                    background: event.visibility === "GLOBAL"
                      ? `rgba(176,38,255,0.2)`
                      : `rgba(59,130,255,0.2)`,
                    color: event.visibility === "GLOBAL" ? colors.accent.purple : colors.accent.blue,
                    border: `1px solid ${event.visibility === "GLOBAL" ? colors.border.glass : colors.border.glass}`,
                  }}
                >
                  {getVisibilityBadge(event.visibility, event.branch)}
                </div>
              </div>

              {/* EVENT DETAILS */}
              <div className="space-y-3 p-6 flex-1">
                {/* DATE */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.purple }} />
                  <p style={{ color: colors.text.secondary }} className="text-sm">
                    {formatDate(event.date)}
                  </p>
                </div>

                {/* TIME */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.blue }} />
                  <p style={{ color: colors.text.secondary }} className="text-sm">
                    {event.time} (24-hour format)
                  </p>
                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.pink }} />
                  <p style={{ color: colors.text.secondary }} className="text-sm truncate">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div
                className="border-t p-4"
                style={{ borderColor: colors.border.glass }}
              >
                <button
                  className="w-full rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
                    color: colors.text.primary,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event._id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
