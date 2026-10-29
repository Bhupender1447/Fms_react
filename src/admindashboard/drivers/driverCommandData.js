import { BASE_URL } from '../../config';

export const driverName = driver => [driver.fname, driver.lname].filter(Boolean).join(' ').trim() || 'Unnamed driver';
export const contactFields = [
  ['fname', 'First name', 100], ['lname', 'Last name', 100], ['phone', 'Phone', 50], ['email', 'Email', 60],
  ['address1', 'Address line 1', 200], ['address2', 'Address line 2', 200], ['city', 'City', 100],
  ['state', 'State / Province', 100], ['zip', 'Postal / ZIP code', 50], ['country', 'Country', 50],
];
export const contactDraft = driver => Object.fromEntries(contactFields.map(([field]) => [field, String(driver[field] ?? '')]));

export function validateContact(draft) {
  const errors = {};
  if (!draft.fname.trim()) errors.fname = 'First name is required.';
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
  contactFields.forEach(([field, , max]) => { if (draft[field].length > max) errors[field] = `Use ${max} characters or fewer.`; });
  return errors;
}

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export function dateLabel(value) {
  return validDate(value) ? value : value ? 'Unavailable (invalid date)' : 'Unavailable';
}

export function dateAttention(driver, now = new Date()) {
  const values = [validDate(driver.expiarydate), validDate(driver.fastexpdate)];
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (values.some(date => date && date.getTime() <= today + 12 * 86400000)) return true;
  return values.every(Boolean) ? false : null;
}

export function photoUrl(image) {
  if (typeof image !== 'string' || !image.trim()) return null;
  try {
    const base = new URL(BASE_URL, window.location.origin);
    const url = new URL(image, base);
    return ['http:', 'https:'].includes(url.protocol) && [base.origin, window.location.origin].includes(url.origin) ? url.href : null;
  } catch (error) {
    return null;
  }
}
