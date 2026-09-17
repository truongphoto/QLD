import { TARGET_REGISTER_URL, getFieldsForType, getManualUploadsForType } from './schema.js';

export const STORAGE_KEY = 'truong_gpp_v1_draft';

export function createFillPayload(data, registrationType) {
  const values = {};
  const allowed = new Map(getFieldsForType(registrationType).map(field => [field.key, field]));
  for (const [key, value] of Object.entries(data || {})) {
    const field = allowed.get(key);
    if (!field || field.sendToTarget === false) continue;
    if (typeof value === 'boolean') {
      if (value) values[key] = true;
      continue;
    }
    if (String(value ?? '').trim() !== '') values[key] = value;
  }
  return {
    type: 'TRUONG_GPP_START_FILL',
    schemaVersion: 1,
    runId: `gpp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    targetUrl: TARGET_REGISTER_URL,
    registrationType,
    manualUploads: getManualUploadsForType(registrationType),
    values
  };
}

export function exportDraftJson(data, registrationType) {
  return JSON.stringify({
    product: 'TRƯỜNG GPP',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    registrationType,
    data: data || {}
  }, null, 2);
}

export function importDraftJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.product !== 'TRƯỜNG GPP' || parsed.schemaVersion !== 1 || typeof parsed.data !== 'object') {
    throw new Error('Tệp hồ sơ không đúng định dạng TRƯỜNG GPP V1.');
  }
  if (!['ban_le','ban_buon','chuoi_nha_thuoc'].includes(parsed.registrationType)) {
    throw new Error('Tệp hồ sơ chưa xác định đúng loại cơ sở.');
  }
  return { data: parsed.data, registrationType: parsed.registrationType };
}
