export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function scoreCandidate(text, aliases = []) {
  const candidate = normalizeText(text);
  if (!candidate) return 0;
  let best = 0;
  for (const aliasRaw of aliases) {
    const alias = normalizeText(aliasRaw);
    if (!alias) continue;
    if (candidate === alias) best = Math.max(best, 120);
    else if (candidate.startsWith(alias) || candidate.endsWith(alias)) best = Math.max(best, 92 - Math.min(20, candidate.length - alias.length));
    else if (candidate.includes(alias)) best = Math.max(best, 72 - Math.min(20, candidate.length - alias.length));
    else {
      const tokens = alias.split(' ').filter(Boolean);
      const matches = tokens.filter(token => candidate.includes(token)).length;
      if (matches) best = Math.max(best, Math.round((matches / tokens.length) * 50));
    }
  }
  return best;
}

export function chooseOptionValue(options, desired) {
  const target = normalizeText(desired);
  if (!target) return null;
  let fallback = null;
  for (const option of options) {
    const text = normalizeText(option.text);
    const value = normalizeText(option.value);
    if (text === target || value === target) return option.value;
    if (!fallback && (text.includes(target) || target.includes(text))) fallback = option.value;
  }
  return fallback;
}

export function normalizeComparable(value = '') {
  const raw = String(value).trim();
  let match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  return normalizeText(raw);
}
