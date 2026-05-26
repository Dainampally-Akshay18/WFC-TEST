import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useEventsStore } from '../../store/eventsStore';
import { toast } from '../../utils/toast';
import EventFilters from './components/EventFilters';
import EventCard from './components/EventCard';
import EventTable from './components/EventTable';
import EventSkeleton from './components/EventSkeleton';
import DeleteEventModal from './components/DeleteEventModal';
import EventDetailsModal from './components/EventDetailsModal';

const EventList = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('card'); // 'card' or 'table'
  const [branches] = useState(['BRANCH1', 'BRANCH2']); // Mock branches, replace with actual

  const {
    filteredEvents,
    isLoading,
    isMutating,
    error,
    selectedEvent,
    eventToDelete,
    detailsModalOpen,
    deleteModalOpen,
    setDetailsModalOpen,
    setDeleteModalOpen,
    setSelectedEvent,
    setEventToDelete,
    fetchEvents,
    deleteEvent,
  } = useEventsStore();

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle view event
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    navigate(`/admin/events/edit/${event._id}`, { state: { event } });
  };

  // Handle delete event confirmation
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (eventToDelete?._id) {
      try {
        await deleteEvent(eventToDelete._id);
        toast.success('Event deleted successfully!');
      } catch (err) {
        const errorMessage = err?.response?.data?.error?.message || 'Failed to delete event';
        toast.error(errorMessage);
      }
    }
  };

  // Handle close modals
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] animate-slide-in-left">
            Events Management
          </h1>
          <p className="text-[var(--text-secondary)] animate-slide-in-left mt-1" style={{ animationDelay: '100ms' }}>
            Create and manage church events and schedules.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/events/create')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg active:scale-95 animate-fade-in"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <EventFilters branches={branches} />

      {/* View Type Toggle */}
      <div className="flex gap-2 glass-card rounded-lg p-1 w-fit animate-fade-in-up">
        <button
          onClick={() => setViewType('card')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            viewType === 'card'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Card View
        </button>
        <button
          onClick={() => setViewType('table')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            viewType === 'table'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Table View
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <EventSkeleton count={6} variant={viewType} />
      ) : filteredEvents.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in-up">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No events found</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            {filteredEvents.length === 0 && '📝 Create your first event to get started.'}
          </p>
          <button
            onClick={() => navigate('/admin/events/create')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all hover:shadow-lg"
          >
            Create Event
          </button>
        </div>
      ) : viewType === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onView={handleViewEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EventTable
          events={filteredEvents}
          onView={handleViewEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modals */}
      {detailsModalOpen && selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={handleCloseDetailsModal} isLoading={isLoading} />
      )}

      {deleteModalOpen && eventToDelete && (
        <DeleteEventModal
          event={eventToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          isLoading={isMutating}
        />
      )}
    </div>
  );
};

export default EventList;
