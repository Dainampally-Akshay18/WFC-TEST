/**
 * EVENT DETAILS PAGE
 * Single event view with full details
 */

import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft, Calendar, Clock, MapPin, Eye, User } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useEventDetails } from "../../hooks/useEvents";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();

  const { data: event, isLoading, error } = useEventDetails(id);

  const handleGoBack = () => {
    navigate("/events");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVisibilityBadge = (visibility, branch) => {
    return visibility === "GLOBAL" ? "GLOBAL EVENT" : `${branch || "BRANCH"} EVENT`;
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" style={{ color: colors.accent.purple }} />
          <p style={{ color: colors.text.secondary }}>Loading event...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !event) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 transition-colors duration-200"
          style={{ color: colors.accent.blue }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </button>

        <div
          className="rounded-lg border px-4 py-6 text-center"
          style={{
            borderColor: colors.accent.blue,
            background: `rgba(59,130,255,0.1)`,
          }}
        >
          <AlertCircle className="mx-auto mb-3 h-8 w-8" style={{ color: colors.accent.blue }} />
          <h2 className="mb-2 text-xl font-bold" style={{ color: colors.text.primary }}>
            Event not found
          </h2>
          <p style={{ color: colors.text.secondary }}>
            {error?.message || "The event you're looking for doesn't exist"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BACK BUTTON */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 transition-colors duration-200"
        style={{ color: colors.accent.blue }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.7";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </button>

      {/* HEADER SECTION */}
      <div className="space-y-4">
        <h1
          className="text-4xl font-bold md:text-5xl lg:text-6xl"
          style={{ color: colors.text.primary }}
        >
          {event.title}
        </h1>

        {/* VISIBILITY BADGE */}
        <div
          className="inline-block rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: event.visibility === "GLOBAL"
              ? `rgba(176,38,255,0.2)`
              : `rgba(59,130,255,0.2)`,
            color: event.visibility === "GLOBAL" ? colors.accent.purple : colors.accent.blue,
            border: `1px solid ${colors.border.glass}`,
          }}
        >
          {getVisibilityBadge(event.visibility, event.branch)}
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
        }}
      />

      {/* KEY EVENT INFO - CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* DATE CARD */}
        <div
          className="rounded-lg p-6"
          style={{
            background: glassmorphism.card.background,
            border: `1px solid ${glassmorphism.card.border}`,
            backdropFilter: glassmorphism.card.backdropFilter,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5" style={{ color: colors.accent.purple }} />
            <p style={{ color: colors.text.secondary }} className="text-sm font-medium">
              Date
            </p>
          </div>
          <p style={{ color: colors.text.primary }} className="text-lg font-bold">
            {formatDate(event.date)}
          </p>
        </div>

        {/* TIME CARD */}
        <div
          className="rounded-lg p-6"
          style={{
            background: glassmorphism.card.background,
            border: `1px solid ${glassmorphism.card.border}`,
            backdropFilter: glassmorphism.card.backdropFilter,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5" style={{ color: colors.accent.blue }} />
            <p style={{ color: colors.text.secondary }} className="text-sm font-medium">
              Time
            </p>
          </div>
          <p style={{ color: colors.text.primary }} className="text-lg font-bold">
            {event.time}
          </p>
        </div>

        {/* LOCATION CARD */}
        <div
          className="rounded-lg p-6"
          style={{
            background: glassmorphism.card.background,
            border: `1px solid ${glassmorphism.card.border}`,
            backdropFilter: glassmorphism.card.backdropFilter,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5" style={{ color: colors.accent.pink }} />
            <p style={{ color: colors.text.secondary }} className="text-sm font-medium">
              Location
            </p>
          </div>
          <p style={{ color: colors.text.primary }} className="text-lg font-bold">
            {event.location}
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
        }}
      />

      {/* DESCRIPTION SECTION */}
      <div
        className="rounded-lg p-8"
        style={{
          background: glassmorphism.card.background,
          border: `1px solid ${glassmorphism.card.border}`,
          backdropFilter: glassmorphism.card.backdropFilter,
        }}
      >
        <h2
          className="mb-4 text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          About This Event
        </h2>
        <p
          style={{
            color: colors.text.secondary,
            lineHeight: "1.8",
            fontSize: "16px",
          }}
        >
          {event.description}
        </p>
      </div>

      {/* EVENT METADATA */}
      <div
        className="rounded-lg p-6"
        style={{
          background: glassmorphism.card.background,
          border: `1px solid ${glassmorphism.card.border}`,
          backdropFilter: glassmorphism.card.backdropFilter,
        }}
      >
        <h3
          className="mb-4 text-lg font-bold"
          style={{ color: colors.text.primary }}
        >
          Event Information
        </h3>
        <div className="space-y-3">
          {/* CREATED BY ROLE */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4" style={{ color: colors.accent.purple }} />
            <p style={{ color: colors.text.secondary }} className="text-sm">
              <span className="font-medium">Created by:</span> {event.createdByRole}
            </p>
          </div>

          {/* VISIBILITY INFO */}
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4" style={{ color: colors.accent.blue }} />
            <p style={{ color: colors.text.secondary }} className="text-sm">
              <span className="font-medium">Visibility:</span> {event.visibility}
              {event.branch && ` (${event.branch})`}
            </p>
          </div>

          {/* CREATED AT */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4" style={{ color: colors.accent.pink }} />
            <p style={{ color: colors.text.secondary }} className="text-sm">
              <span className="font-medium">Posted:</span>{" "}
              {new Date(event.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={handleGoBack}
          className="flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200"
          style={{
            background: `rgba(255,255,255,0.05)`,
            color: colors.text.primary,
            border: `1px solid ${colors.border.glass}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(255,255,255,0.1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(255,255,255,0.05)`;
          }}
        >
          Back to Events
        </button>
        <button
          className="flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            color: colors.text.primary,
          }}
        >
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
