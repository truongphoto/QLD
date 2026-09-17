import { getFieldsForType } from './schema.js';

export function normalizePhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length >= 10) digits = `0${digits.slice(2)}`;
  return digits;
}

export function normalizeDate(value = '') {
  const raw = String(value).trim();
  let y, m, d;
  let match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) [, y, m, d] = match;
  else {
    match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!match) return '';
    [, d, m, y] = match;
  }
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  if (date.getUTCFullYear() !== Number(y) || date.getUTCMonth() + 1 !== Number(m) || date.getUTCDate() !== Number(d)) return '';
  return iso;
}

export function validateDossier(data = {}, registrationType = 'ban_le') {
  const errors = {};
  for (const field of getFieldsForType(registrationType)) {
    const raw = data[field.key];
    const value = field.type === 'checkbox' ? Boolean(raw) : String(raw ?? '').trim();
    if (field.required && !value) errors[field.key] = `${field.label} là thông tin bắt buộc.`;
    if (!value || field.type === 'checkbox') continue;
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.key] = 'Địa chỉ thư điện tử chưa đúng định dạng.';
    if (field.type === 'tel') {
      const phone = normalizePhone(value);
      if (phone.length < 9 || phone.length > 11) errors[field.key] = 'Số điện thoại chưa đúng định dạng.';
    }
    if (field.type === 'date' && !normalizeDate(value)) errors[field.key] = 'Ngày chưa đúng định dạng.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
