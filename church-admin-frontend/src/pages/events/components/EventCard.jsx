import React from 'react';
import { Edit, Trash2, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import EventVisibilityBadge from './EventVisibilityBadge';
import EventRoleBadge from './EventRoleBadge';
import { formatEventDate, formatEventTime } from '../utils/eventHelpers';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up group border border-white/50 dark:border-white/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
            {event.title || 'Untitled Event'}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
            {event.description || 'No description provided'}
          </p>
        </div>
        <EventVisibilityBadge visibility={event.visibility} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-[var(--border-glass)]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-[var(--text-secondary)]">{formatEventDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-[var(--text-secondary)]">{formatEventTime(event.time)}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-[var(--text-secondary)] truncate">{event.location || 'No location'}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <EventRoleBadge role={event.createdByRole} />
        {event.branch && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            {event.branch}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-glass)]">
        <button
          onClick={() => onView(event)}
          className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          View Details
          <ArrowRight className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Edit event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event)}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
