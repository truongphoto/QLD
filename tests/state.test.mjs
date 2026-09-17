import test from 'node:test';
import assert from 'node:assert/strict';
import { createFillPayload, exportDraftJson, importDraftJson, normalizeDraftData } from '../web/js/state.js';

test('gói điền luôn dùng đúng trang đăng ký CSDL Dược và loại hồ sơ', () => {
  const payload = createFillPayload({facilityName:'Nhà thuốc A', contactEmail:''}, 'ban_le');
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.targetUrl, 'https://csdlduoc.com.vn/auth/register');
  assert.equal(payload.registrationType, 'ban_le');
  assert.deepEqual(payload.values, {facilityName:'Nhà thuốc A'});
  assert.ok(payload.runId.startsWith('gpp_'));
});

test('giá trị ô đánh dấu chỉ gửi khi đã chọn', () => {
  const payload = createFillPayload({hasBusinessLocationCode:false, facilityName:'A'}, 'ban_buon');
  assert.equal(Object.prototype.hasOwnProperty.call(payload.values, 'hasBusinessLocationCode'), false);
  const checked = createFillPayload({hasBusinessLocationCode:true}, 'ban_buon');
  assert.equal(checked.values.hasBusinessLocationCode, true);
});

test('xuất và nhập hồ sơ giữ nguyên loại cơ sở cùng dữ liệu', () => {
  const draft = {facilityName:'Nhà thuốc A', taxCode:'123456789'};
  const text = exportDraftJson(draft, 'chuoi_nha_thuoc');
  const parsed = importDraftJson(text);
  assert.deepEqual(parsed.data, draft);
  assert.equal(parsed.registrationType, 'chuoi_nha_thuoc');
});

test('gói điền gửi thẳng Tỉnh/Thành phố và Xã/Phường, không còn cấp Quận/Huyện', () => {
  const payload = createFillPayload({
    province: 'Đồng Tháp',
    ward: 'Phường Cao Lãnh',
    facilityName: 'Nhà thuốc A',
    businessAddress: '123 đường A'
  }, 'ban_le');
  assert.deepEqual(payload.values, {
    province: 'Đồng Tháp',
    ward: 'Phường Cao Lãnh',
    facilityName: 'Nhà thuốc A',
    businessAddress: '123 đường A'
  });
  assert.equal(Object.prototype.hasOwnProperty.call(payload.values, 'district'), false);
});


test('hồ sơ cũ thiếu Tỉnh/Thành phố tự mặc định Đồng Tháp', () => {
  assert.deepEqual(normalizeDraftData({ facilityName: 'Nhà thuốc A' }), { facilityName: 'Nhà thuốc A', province: 'Đồng Tháp' });
  assert.deepEqual(normalizeDraftData({ province: '' }), { province: 'Đồng Tháp' });
  assert.deepEqual(normalizeDraftData({ province: 'Cần Thơ' }), { province: 'Cần Thơ' });
});
