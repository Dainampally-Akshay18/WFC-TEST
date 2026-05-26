import React from 'react';
import { X, Calendar, Clock, MapPin, User } from 'lucide-react';
import EventVisibilityBadge from './EventVisibilityBadge';
import EventRoleBadge from './EventRoleBadge';
import { formatEventDate, formatEventTime, formatCreatedTime } from '../utils/eventHelpers';

const EventDetailsModal = ({ event, onClose, isLoading = false }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{event.title || 'Event Details'}</h2>
            <EventVisibilityBadge visibility={event.visibility} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Description</h3>
            <p className="text-gray-900 dark:text-white leading-relaxed text-base">{event.description || 'No description provided'}</p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-base">{formatEventDate(event.date) || 'Invalid Date'}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-base">{formatEventTime(event.time) || 'N/A'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-base">{event.location || 'No location'}</p>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Creator Information</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <User className="w-5 h-5 text-indigo-600" />
              <div className="flex-1 flex items-center gap-2">
                <EventRoleBadge role={event.createdByRole} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{formatCreatedTime(event.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Branch Info (if applicable) */}
          {event.branch && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Branch</h3>
              <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                <span className="text-gray-900 dark:text-white font-medium">{event.branch}</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Event ID</p>
              <p className="text-gray-900 dark:text-white font-mono break-all mt-1">{event._id}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Created</p>
              <p className="text-gray-900 dark:text-white mt-1">{event.createdAt ? new Date(event.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
