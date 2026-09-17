import test from 'node:test';
import assert from 'node:assert/strict';
import { REGISTRATION_TYPES, getFieldsForType, getManualUploadsForType, TARGET_REGISTER_URL } from '../web/js/schema.js';

test('V1 dùng đúng trang đăng ký CSDL Dược đã chốt', () => {
  assert.equal(TARGET_REGISTER_URL, 'https://csdlduoc.com.vn/auth/register');
});

test('V1 có đúng ba loại hồ sơ đã xác nhận từ ảnh thực tế', () => {
  assert.deepEqual(REGISTRATION_TYPES.map(x => x.id), ['ban_le', 'ban_buon', 'chuoi_nha_thuoc']);
});

test('cơ sở bán lẻ có trường loại hình cơ sở và không có địa chỉ trụ sở riêng', () => {
  const keys = getFieldsForType('ban_le').map(x => x.key);
  assert.ok(keys.includes('facilitySubtype'));
  assert.ok(keys.includes('hasBusinessLocationCode'));
  assert.ok(!keys.includes('headOfficeAddress'));
});

test('cơ sở bán buôn không có trường loại hình bán lẻ', () => {
  const keys = getFieldsForType('ban_buon').map(x => x.key);
  assert.ok(!keys.includes('facilitySubtype'));
  assert.ok(keys.includes('hasBusinessLocationCode'));
});

test('chuỗi nhà thuốc có địa chỉ trụ sở và bốn tài liệu tải thủ công', () => {
  const keys = getFieldsForType('chuoi_nha_thuoc').map(x => x.key);
  assert.ok(keys.includes('headOfficeAddress'));
  assert.equal(getManualUploadsForType('chuoi_nha_thuoc').length, 4);
});
