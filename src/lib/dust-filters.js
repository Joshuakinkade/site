import {DateTime} from 'luxon';
import marked from 'marked';

export function formatDate(date) {
  // TODO: Get locale from browser
  return date.setLocale('en-US').toLocaleString(DateTime.DATE_FULL);
}

export function formatDateTime(dateTime) {
  // TODO: Get locale from browser
  return dateTime.setLocale('en-US').toLocaleString(DateTime.DATETIME_SHORT);
}

// TODO: Don't trim in the middle of html tags
export function snippet(value) {
  if (typeof value === 'string') {
    // Cut the string down to 128 characters and remove any trailing (or leading) white-space
    return value.substr(0,256).trim();
  }
  return value;
}

export function md(value) {
  if (typeof value == 'string') {
    return marked(value);
  }
  return value;
}