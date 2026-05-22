import { format, formatDistance, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr);
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
