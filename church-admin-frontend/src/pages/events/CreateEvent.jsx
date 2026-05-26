import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useEventsStore } from '../../store/eventsStore';
import { toast } from '../../utils/toast';
import EventForm from './components/EventForm';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [branches] = useState(['BRANCH1', 'BRANCH2']); // Mock branches
  const { createEvent, isMutating } = useEventsStore();

  const handleSubmit = async (formData) => {
    try {
      // Format the form data according to API requirements
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date, // YYYY-MM-DD
        time: formData.time, // HH:MM
        location: formData.location,
        visibility: formData.visibility,
        branch: formData.visibility === 'GLOBAL' ? null : formData.branch,
      };

      await createEvent(eventData);
      
      toast.success('Event created successfully!');
      navigate('/admin/events');
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message || 'Failed to create event';
      toast.error(errorMessage);
    }
  };

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
            Create New Event
          </h1>
          <p className="text-[var(--text-secondary)] animate-slide-in-left mt-1" style={{ animationDelay: '100ms' }}>
            Fill in the details to create a new church event.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl p-8 animate-fade-in-up border border-white/50 dark:border-white/10">
        <EventForm
          onSubmit={handleSubmit}
          isLoading={isMutating}
          branches={branches}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
