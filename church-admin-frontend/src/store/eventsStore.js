import { create } from 'zustand';
import { eventService } from '../api/services/event.service';

export const useEventsStore = create((set, get) => ({
  events: [],
  filteredEvents: [],
  selectedEvent: null,
  isLoading: false,
  isMutating: false,
  error: null,
  detailsModalOpen: false,
  deleteModalOpen: false,
  eventToDelete: null,
  
  filters: {
    search: '',
    visibility: '',
    branch: '',
    dateFrom: '',
    dateTo: '',
  },

  // UI Actions
  setDetailsModalOpen: (open) => set({ detailsModalOpen: open }),
  setDeleteModalOpen: (open) => set({ deleteModalOpen: open }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setEventToDelete: (event) => set({ eventToDelete: event }),

  // Filter Actions
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        search: '',
        visibility: '',
        branch: '',
        dateFrom: '',
        dateTo: '',
      },
    }),

  // Apply filters to events array
  applyFilters: () => {
    const { events, filters } = get();
    
    let filtered = [...events];

    // Search by title or description
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by visibility
    if (filters.visibility) {
      filtered = filtered.filter((event) => event.visibility === filters.visibility);
    }

    // Filter by branch
    if (filters.branch) {
      filtered = filtered.filter((event) => event.branch === filters.branch);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter((event) => new Date(event.date) >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      filtered = filtered.filter((event) => new Date(event.date) <= dateTo);
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    set({ filteredEvents: filtered });
  },

  // Fetch all events
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventService.getEvents();
      set({ events: response.data || [], isLoading: false });
      // Apply filters after fetching
      get().applyFilters();
    } catch (error) {
      set({
        error: error?.response?.data?.error?.message || 'Failed to fetch events',
        isLoading: false,
      });
    }
  },

  // Create event
  createEvent: async (eventData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await eventService.createEvent(eventData);
      const newEvent = response.data || {};
      
      set((state) => ({
        events: [newEvent, ...state.events],
        isMutating: false,
      }));
      
      // Reapply filters
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to create event';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await eventService.updateEvent(id, eventData);
      const updatedEvent = response.data || {};
      
      set((state) => ({
        events: state.events.map((event) =>
          event._id === id ? { ...event, ...updatedEvent } : event
        ),
        selectedEvent: state.selectedEvent?._id === id ? { ...state.selectedEvent, ...updatedEvent } : state.selectedEvent,
        isMutating: false,
      }));
      
      // Reapply filters
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to update event';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    set({ isMutating: true, error: null });
    try {
      await eventService.deleteEvent(id);
      
      set((state) => ({
        events: state.events.filter((event) => event._id !== id),
        selectedEvent: state.selectedEvent?._id === id ? null : state.selectedEvent,
        eventToDelete: null,
        deleteModalOpen: false,
        isMutating: false,
      }));
      
      // Reapply filters
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to delete event';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Publish event (optimistic update)
  publishEvent: async (id) => {
    set({ isMutating: true, error: null });
    try {
      // Optimistic update
      set((state) => ({
        events: state.events.map((event) =>
          event._id === id ? { ...event, published: true } : event
        ),
      }));

      await eventService.publishEvent(id);
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to publish event';
      set({ error: errorMsg });
      // Revert optimistic update
      await get().fetchEvents();
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  // Unpublish event (optimistic update)
  unpublishEvent: async (id) => {
    set({ isMutating: true, error: null });
    try {
      // Optimistic update
      set((state) => ({
        events: state.events.map((event) =>
          event._id === id ? { ...event, published: false } : event
        ),
      }));

      await eventService.unpublishEvent(id);
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to unpublish event';
      set({ error: errorMsg });
      // Revert optimistic update
      await get().fetchEvents();
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  // Fetch single event
  fetchEventDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventService.getEvent(id);
      set({ selectedEvent: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data?.error?.message || 'Failed to fetch event',
        isLoading: false,
      });
    }
  },
}));
