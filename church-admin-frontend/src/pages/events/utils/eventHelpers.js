import { formatDistanceToNow } from 'date-fns';

export const formatEventDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatEventTime = (timeString) => {
  // timeString is in HH:MM format
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return 'N/A';
  const hour = parseInt(hours, 10);
  const minute = minutes;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
};

export const formatEventDateTime = (eventDate, eventTime) => {
  const dateStr = formatEventDate(eventDate);
  const timeStr = formatEventTime(eventTime);
  return `${dateStr} at ${timeStr}`;
};

export const formatCreatedTime = (createdAt) => {
  if (!createdAt) return 'N/A';
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch {
    return 'N/A';
  }
};

export const isUpcomingEvent = (eventDate) => {
  const eventTime = new Date(eventDate);
  const now = new Date();
  return eventTime > now;
};

export const isEventToday = (eventDate) => {
  const eventTime = new Date(eventDate);
  const today = new Date();
  return (
    eventTime.getDate() === today.getDate() &&
    eventTime.getMonth() === today.getMonth() &&
    eventTime.getFullYear() === today.getFullYear()
  );
};

export const isEventTomorrow = (eventDate) => {
  const eventTime = new Date(eventDate);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    eventTime.getDate() === tomorrow.getDate() &&
    eventTime.getMonth() === tomorrow.getMonth() &&
    eventTime.getFullYear() === tomorrow.getFullYear()
  );
};

export const getDaysUntilEvent = (eventDate) => {
  const eventTime = new Date(eventDate);
  const now = new Date();
  const timeDiff = eventTime - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const canEditEvent = (event, userRole, userBranch, userId) => {
  if (userRole === 'MASTER_ADMIN') return true;
  if (userRole === 'LEADER' && event.branch === userBranch) return true;
  if (userRole === 'USER' && event.createdBy === userId) return true;
  return false;
};

export const canDeleteEvent = (event, userRole, userBranch, userId) => {
  return canEditEvent(event, userRole, userBranch, userId);
};

export const getVisibilityIcon = (visibility) => {
  switch (visibility) {
    case 'GLOBAL':
      return '🌍';
    case 'BRANCH':
      return '🏢';
    default:
      return '📅';
  }
};
