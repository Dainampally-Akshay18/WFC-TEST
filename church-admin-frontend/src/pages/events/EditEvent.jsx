import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useEventsStore } from '../../store/eventsStore';
import { toast } from '../../utils/toast';
import EventForm from './components/EventForm';
import EventSkeleton from './components/EventSkeleton';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [branches] = useState(['BRANCH1', 'BRANCH2']); // Mock branches

  const { selectedEvent, isLoading, updateEvent, isMutating, fetchEventDetails } = useEventsStore();

  // Get event from location state or fetch it
  const event = location.state?.event || selectedEvent;

  useEffect(() => {
    if (!event && id) {
      fetchEventDetails(id);
    }
  }, [id, event, fetchEventDetails]);

  const handleSubmit = async (formData) => {
    try {
      // Format the form data according to API requirements
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        visibility: formData.visibility,
        branch: formData.visibility === 'GLOBAL' ? null : formData.branch,
      };

      await updateEvent(id, eventData);

      toast.success('Event updated successfully!');
      // Navigate back to list
      navigate('/admin/events');
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message || 'Failed to update event';
      toast.error(errorMessage);
    }
  };

  if (isLoading && !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Loading...</h1>
        </div>
        <EventSkeleton count={1} variant="card" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/events')}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Events
        </button>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-[var(--text-primary)]">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/events')}
          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
          title="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--text-secondary)]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] animate-slide-in-left">
            Edit Event
          </h1>
          <p className="text-[var(--text-secondary)] animate-slide-in-left mt-1" style={{ animationDelay: '100ms' }}>
            Update the event details below.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl p-8 animate-fade-in-up border border-white/50 dark:border-white/10">
        <EventForm
          initialData={{
            title: event.title,
            description: event.description,
            date: event.date?.split('T')[0], // Convert ISO to YYYY-MM-DD
            time: event.time,
            location: event.location,
            visibility: event.visibility,
            branch: event.branch || '',
          }}
          onSubmit={handleSubmit}
          isLoading={isMutating}
          branches={branches}
        />
      </div>
    </div>
  );
};

export default EditEvent;
