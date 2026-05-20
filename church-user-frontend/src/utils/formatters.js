/**
 * FORMAT UTILITIES
 * Helper functions for formatting dates, times, and text
 */

export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year);
};

export const formatTime = (date, format = "HH:mm") => {
  if (!date) return "";

  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return format.replace("HH", hours).replace("mm", minutes);
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const toTitleCase = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  truncateText,
  capitalizeFirstLetter,
  toTitleCase,
};
