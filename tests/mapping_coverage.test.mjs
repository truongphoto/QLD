import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { REGISTRATION_TYPES, getFieldsForType } from '../web/js/schema.js';

const source = fs.readFileSync('extension/target_filler.js','utf8');

test('mọi trường của ba loại hồ sơ đều có ánh xạ trong bộ tự điền', () => {
  const keys = new Set(REGISTRATION_TYPES.flatMap(type => getFieldsForType(type.id).map(field => field.key)));
  for (const key of keys) {
    assert.match(source, new RegExp(`\\b${key}\\b`), `Thiếu ánh xạ cho ${key}`);
  }
});

test('bộ tự điền không đụng vào ô tải tệp hoặc mã xác nhận', () => {
  assert.match(source, /not\(\[type="file"\]\)/);
  assert.doesNotMatch(source, /captcha[^'"\n]*\.value\s*=/i);
  assert.doesNotMatch(source, /Đăng ký['"]\)\.click|submit\(\)/i);
});
