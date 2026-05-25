import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const DateFormat = {
  DAY: 'MMM DD',
  INFO_DATE: 'D MMM',
  INFO_DATE_WITH_MONTH: 'D MMM',
  TIME: 'HH:mm',
  EDIT: 'DD/MM/YY HH:mm',
};

function formatDate(date, format) {
  return dayjs(date).format(format);
}

function formatDay(date) {
  return formatDate(date, DateFormat.DAY).toUpperCase();
}

function formatTime(date) {
  return formatDate(date, DateFormat.TIME);
}

function formatInfoDate(date) {
  return formatDate(date, DateFormat.INFO_DATE);
}

function formatEditDate(date) {
  return formatDate(date, DateFormat.EDIT).replace(',', '');
}

function humanizeDuration(dateFrom, dateTo) {
  const pointDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(pointDuration.asDays());
  const hours = pointDuration.hours();
  const minutes = pointDuration.minutes();

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

export {formatDay, formatTime, formatInfoDate, formatEditDate, humanizeDuration, capitalize, isPointFuture, isPointPresent, isPointPast};
