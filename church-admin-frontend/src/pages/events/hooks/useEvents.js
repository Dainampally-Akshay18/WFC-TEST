import { useEventsStore } from '../../store/eventsStore';

export const useEvents = () => {
  const store = useEventsStore();
  
  return {
    // State
    events: store.events,
    filteredEvents: store.filteredEvents,
    selectedEvent: store.selectedEvent,
    isLoading: store.isLoading,
    isMutating: store.isMutating,
    error: store.error,
    detailsModalOpen: store.detailsModalOpen,
    deleteModalOpen: store.deleteModalOpen,
    eventToDelete: store.eventToDelete,
    filters: store.filters,

    // Actions
    fetchEvents: store.fetchEvents,
    createEvent: store.createEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    publishEvent: store.publishEvent,
    unpublishEvent: store.unpublishEvent,
    fetchEventDetails: store.fetchEventDetails,

    // Filter Actions
    updateFilters: store.updateFilters,
    clearFilters: store.clearFilters,
    applyFilters: store.applyFilters,

    // UI Actions
    setDetailsModalOpen: store.setDetailsModalOpen,
    setDeleteModalOpen: store.setDeleteModalOpen,
    setSelectedEvent: store.setSelectedEvent,
    setEventToDelete: store.setEventToDelete,
  };
};
