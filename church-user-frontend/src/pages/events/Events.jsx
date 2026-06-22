import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Calendar, Clock, MapPin, Eye } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";

const Events = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#F5F9FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">
            Church Events
          </h1>
          <p className="text-[#64748B]">
            Upcoming services, meetings, and community events
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSortBy("upcoming")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              sortBy === "upcoming"
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSortBy("all")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              sortBy === "all"
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]"
            }`}
          >
            All Events
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-4 border-[#E2E8F0] border-t-[#2563EB] animate-spin mx-auto mb-4" />
              <p className="text-[#64748B]">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Failed to load events
                </h3>
                <p className="text-sm text-red-700">
                  {error.message || "An error occurred while fetching events"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedEvents.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-[#94A3B8]" />
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No events available</h3>
            <p className="text-[#64748B]">
              Check back later for upcoming church events
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && sortedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <div
                key={event._id}
                className="w-80 h-100 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => handleEventClick(event._id)}
              >
                {/* Header */}
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#2563EB] transition-colors flex-1">
                      {event.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        event.visibility === "GLOBAL"
                          ? "bg-[#EFF6FF] text-[#2563EB]"
                          : "bg-[#F0FDF4] text-[#16A34A]"
                      }`}
                    >
                      {getVisibilityBadge(event.visibility, event.branch)}
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B] line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-medium">Date</p>
                      <p className="text-sm text-[#0F172A] font-semibold">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-medium">Time</p>
                      <p className="text-sm text-[#0F172A] font-semibold">
                        {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#94A3B8] font-medium">Location</p>
                      <p className="text-sm text-[#0F172A] font-semibold truncate">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
