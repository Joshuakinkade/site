import {DateTime} from 'luxon';
import marked from 'marked';

export function formatDate(date) {
  return date.setLocale('en-US').toLocaleString(DateTime.DATE_FULL);
}

export function formatDateTime(dateTime) {
  return dateTime.setLocale('en-US').toLocaleString(DateTime.DATETIME_SHORT);
}

export function md(value) {
  if (typeof value == 'string') {
    return marked(value);
  }
  return value;
}