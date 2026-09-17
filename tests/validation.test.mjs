import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDossier, normalizeDate, normalizePhone } from '../web/js/validation.js';

const validRetail = {
  province:'Đồng Tháp',
  ward:'Phường Cao Lãnh',
  drugBusinessCertificateNumber:'ĐKKDD-123',
  facilitySubtype:'Nhà thuốc',
  facilityName:'Nhà thuốc An Tâm',
  taxCode:'1234567890',
  businessAddress:'12 Nguyễn Trãi',
  drugBusinessCertificateIssueDate:'2026-09-17',
  drugBusinessCertificateIssuer:'Sở Y tế',
  responsibleProfessionalName:'Nguyễn Văn A',
  qualification:'Dược sĩ đại học',
  practiceCertificateNumber:'CCHND-12345',
  practiceCertificateIssueDate:'2025-01-15',
  practiceCertificateIssuer:'Sở Y tế',
  contactPhone:'0829076979',
  contactEmail:'demo@example.com'
};

test('chuẩn hóa số điện thoại Việt Nam', () => {
  assert.equal(normalizePhone(' 0829 076 979 '), '0829076979');
  assert.equal(normalizePhone('+84 829 076 979'), '0829076979');
});

test('chuẩn hóa ngày về dạng năm-tháng-ngày', () => {
  assert.equal(normalizeDate('17/09/2026'), '2026-09-17');
  assert.equal(normalizeDate('2026-09-17'), '2026-09-17');
  assert.equal(normalizeDate('31/02/2026'), '');
});

test('hồ sơ bán lẻ đầy đủ không có lỗi chặn', () => {
  const result = validateDossier(validRetail, 'ban_le');
  assert.deepEqual(result.errors, {});
  assert.equal(result.isValid, true);
});

test('thiếu trường bắt buộc và thư điện tử sai được báo rõ', () => {
  const result = validateDossier({...validRetail, facilityName:'', contactEmail:'abc@'}, 'ban_le');
  assert.equal(result.isValid, false);
  assert.match(result.errors.facilityName, /bắt buộc/i);
  assert.match(result.errors.contactEmail, /thư điện tử/i);
});

test('chuỗi nhà thuốc bắt buộc có địa chỉ trụ sở nhưng không đòi loại hình bán lẻ', () => {
  const chain = {...validRetail};
  delete chain.facilitySubtype;
  const missing = validateDossier(chain, 'chuoi_nha_thuoc');
  assert.match(missing.errors.headOfficeAddress, /bắt buộc/i);
  chain.headOfficeAddress = '100 Đường A';
  const complete = validateDossier(chain, 'chuoi_nha_thuoc');
  assert.equal(complete.errors.facilitySubtype, undefined);
  assert.equal(complete.errors.headOfficeAddress, undefined);
});
