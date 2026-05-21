/**
 * BRANCH EVENTS
 * Reusable component for displaying branch-specific events
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Calendar, Clock, MapPin } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useEvents } from "../../hooks/useEvents";

export const BranchEvents = ({ branchCode, title = "Branch Events" }) => {
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();
  const { data: events = [], isLoading, error } = useEvents();

  const branchEvents = useMemo(() => {
    return events
      .filter(
        (event) =>
          event.visibility === "BRANCH" &&
          event.branch === branchCode
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, branchCode]);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
            Failed to load branch events
          </p>
        </div>
      </div>
    );
  }

  if (branchEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto mb-3 h-8 w-8" style={{ color: colors.text.muted }} />
        <p style={{ color: colors.text.muted }}>No branch events at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-bold"
        style={{ color: colors.text.primary }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {branchEvents.map((event) => (
          <div
            key={event._id}
            style={{
              background: glassmorphism.card.background,
              border: `1px solid ${glassmorphism.card.border}`,
              backdropFilter: glassmorphism.card.backdropFilter,
              boxShadow: shadows.md,
            }}
            className="group cursor-pointer rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
            onClick={() => handleEventClick(event._id)}
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
          >
            {/* TITLE */}
            <h3
              className="mb-3 line-clamp-2 text-lg font-bold"
              style={{ color: colors.text.primary }}
            >
              {event.title}
            </h3>

            {/* DESCRIPTION */}
            <p
              className="mb-4 line-clamp-2 text-sm"
              style={{ color: colors.text.secondary }}
            >
              {event.description}
            </p>

            {/* DATE, TIME, LOCATION */}
            <div className="space-y-2 border-t pt-4" style={{ borderColor: colors.border.glass }}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.purple }} />
                <span style={{ color: colors.text.secondary }} className="text-sm">
                  {formatDate(event.date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.blue }} />
                <span style={{ color: colors.text.secondary }} className="text-sm">
                  {event.time}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.pink }} />
                <span style={{ color: colors.text.secondary }} className="text-sm truncate">
                  {event.location}
                </span>
              </div>
            </div>

            {/* BRANCH BADGE */}
            <div className="mt-4">
              <div
                className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: `rgba(59,130,255,0.15)`,
                  color: colors.accent.blue,
                  border: `1px solid ${colors.border.glass}`,
                }}
              >
                {event.branch} Event
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchEvents;
