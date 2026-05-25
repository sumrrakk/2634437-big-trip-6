const MILLISECONDS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const DateFormat = {
  DAY: {month: 'short', day: '2-digit'},
  TIME: {hour: '2-digit', minute: '2-digit', hour12: false},
  EDIT: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
};

function formatDate(date, format) {
  return new Intl.DateTimeFormat('en-GB', format).format(new Date(date));
}

function formatDay(date) {
  return formatDate(date, DateFormat.DAY).toUpperCase();
}

function formatTime(date) {
  return formatDate(date, DateFormat.TIME);
}

function formatEditDate(date) {
  return formatDate(date, DateFormat.EDIT).replace(',', '');
}

function humanizeDuration(dateFrom, dateTo) {
  const duration = Math.round((new Date(dateTo) - new Date(dateFrom)) / MILLISECONDS_IN_MINUTE);
  const days = Math.floor(duration / (MINUTES_IN_HOUR * HOURS_IN_DAY));
  const hours = Math.floor((duration % (MINUTES_IN_HOUR * HOURS_IN_DAY)) / MINUTES_IN_HOUR);
  const minutes = duration % MINUTES_IN_HOUR;

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  return `${String(minutes).padStart(2, '0')}M`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isPointFuture(point) {
  return new Date(point.dateFrom) > new Date();
}

function isPointPresent(point) {
  const now = new Date();

  return new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now;
}

function isPointPast(point) {
  return new Date(point.dateTo) < new Date();
}

export {formatDay, formatTime, formatEditDate, humanizeDuration, capitalize, isPointFuture, isPointPresent, isPointPast};
