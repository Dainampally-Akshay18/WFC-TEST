import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import EventVisibilityBadge from './EventVisibilityBadge';
import EventRoleBadge from './EventRoleBadge';
import { formatEventDate, formatEventTime } from '../utils/eventHelpers';

const EventTable = ({ events, onView, onEdit, onDelete }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up shadow-[var(--shadow-medium)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Event</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Date & Time</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Location</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Visibility</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Created By</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="border-b border-[var(--border-glass)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                        {event.title || 'Untitled Event'}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {event.description || 'No description'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                    <div>
                      <div>{formatEventDate(event.date)}</div>
                      <div className="text-xs text-[var(--text-muted)]">{formatEventTime(event.time)}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] max-w-[150px] truncate">
                    {event.location || 'No location'}
                  </td>
                  <td className="p-4">
                    <EventVisibilityBadge visibility={event.visibility} />
                  </td>
                  <td className="p-4">
                    <EventRoleBadge role={event.createdByRole} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(event)}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(event)}
                        className="p-1.5 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(event)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
