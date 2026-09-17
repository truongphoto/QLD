import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getFieldGroupsForType, getFieldsForType, PROVINCE_OPTIONS, getWardOptions } from '../web/js/schema.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const expectedGroups = [
  'dinh_danh_co_so',
  'vi_tri_dia_ly',
  'thong_tin_lien_lac',
  'giay_chung_nhan_kinh_doanh_duoc',
  'nhan_than_nguoi_phu_trach',
  'chung_chi_hanh_nghe'
];

test('mỗi loại hồ sơ chia dữ liệu thành sáu nhóm nhập và nhóm thứ bảy là tổng duyệt', () => {
  for (const type of ['ban_le', 'ban_buon', 'chuoi_nha_thuoc']) {
    const groups = getFieldGroupsForType(type);
    assert.equal(groups.length, 6);
    assert.deepEqual(groups.map(group => group.id), expectedGroups);
    const allKeys = groups.flatMap(group => group.fields.map(field => field.key));
    assert.equal(new Set(allKeys).size, allKeys.length, `Trùng trường ở ${type}`);
  }
});

test('bán lẻ có đúng cấu trúc trường theo bảy nhóm đã chốt', () => {
  const groups = getFieldGroupsForType('ban_le');
  assert.deepEqual(groups[0].fields.map(x => x.key), [
    'facilitySubtype', 'facilityName', 'taxCode', 'organizationIdentifier'
  ]);
  assert.deepEqual(groups[1].fields.map(x => x.key), [
    'province', 'ward', 'businessAddress'
  ]);
  assert.deepEqual(groups[2].fields.map(x => x.key), ['contactPhone', 'contactEmail']);
  assert.deepEqual(groups[3].fields.map(x => x.key), [
    'drugBusinessCertificateNumber', 'drugBusinessCertificateIssueDate', 'drugBusinessCertificateIssuer'
  ]);
  assert.deepEqual(groups[4].fields.map(x => x.key), ['responsibleProfessionalName', 'qualification']);
  assert.deepEqual(groups[5].fields.map(x => x.key), [
    'practiceCertificateNumber', 'practiceCertificateIssueDate', 'practiceCertificateIssuer'
  ]);
});

test('loại hình bán lẻ chỉ hiển thị Nhà thuốc và Quầy thuốc ở V1', () => {
  const field = getFieldsForType('ban_le').find(x => x.key === 'facilitySubtype');
  assert.deepEqual(field.options, ['Nhà thuốc', 'Quầy thuốc']);
});

test('không còn trường Quận/Huyện trong bất kỳ loại hồ sơ nào', () => {
  for (const type of ['ban_le', 'ban_buon', 'chuoi_nha_thuoc']) {
    const keys = getFieldsForType(type).map(x => x.key);
    assert.equal(keys.includes('district'), false);
  }
});

test('Tỉnh/Thành phố ưu tiên Đồng Tháp và Xã/Phường Đồng Tháp dùng danh sách hiện hành', () => {
  assert.equal(PROVINCE_OPTIONS[0], 'Đồng Tháp');
  assert.equal(PROVINCE_OPTIONS.length, 34);
  const province = getFieldsForType('ban_le').find(x => x.key === 'province');
  assert.equal(province.type, 'select');
  assert.equal(province.defaultValue, 'Đồng Tháp');

  const wards = getWardOptions('Đồng Tháp');
  assert.equal(wards.length, 102);
  assert.ok(wards.includes('Phường Mỹ Tho'));
  assert.ok(wards.includes('Phường Cao Lãnh'));
  assert.ok(wards.includes('Phường Sa Đéc'));
  assert.ok(wards.includes('Xã Tân Hồng'));
});

test('trang nhập liệu hiển thị bảy bước và chỉ một vùng nhóm tại một thời điểm', async () => {
  const html = await read('web/index.html');
  assert.match(html, /Nhóm <span id="currentStepNumber">1<\/span>\/7/);
  assert.match(html, /id="wizardStage"/);
  assert.match(html, /id="dossierForm"/);
  assert.match(html, /id="finishPanel"/);
  assert.doesNotMatch(html, /id="typePanel"/);
});

test('nhóm tổng duyệt có bảng tóm tắt và hỗ trợ chỉnh sửa nhanh từng dòng', async () => {
  const html = await read('web/index.html');
  const app = await read('web/js/app.js');
  assert.match(html, /id="reviewList"/);
  assert.match(app, /data-edit-field/);
  assert.match(app, /Chỉnh sửa/);
});

test('giao diện gọn trong một màn hình và không dùng thanh cuộn trang', async () => {
  const html = await read('web/index.html');
  const css = await read('web/css/app.css');
  const app = await read('web/js/app.js');
  assert.match(css, /html,body\{[^}]*height:100%[^}]*overflow:hidden/s);
  assert.match(css, /\.wizard-shell\{[^}]*height:calc\(100dvh - 58px\)/s);
  assert.doesNotMatch(html, /class="card utility-card"/);
  assert.doesNotMatch(html, /class="footer"/);
  assert.doesNotMatch(app, /scrollIntoView/);
});

test('màn hình chỉ giữ các thành phần cần thiết cho nhóm đang nhập', async () => {
  const html = await read('web/index.html');
  assert.doesNotMatch(html, /progress-help/);
  assert.doesNotMatch(html, /Xuất hồ sơ/);
  assert.doesNotMatch(html, /Nhập hồ sơ/);
  assert.doesNotMatch(html, /Xóa bản nháp/);
});


test('nhóm vị trí tự đổi danh sách Xã/Phường theo Tỉnh/Thành phố và mặc định Đồng Tháp', async () => {
  const app = await read('web/js/app.js');
  assert.match(app, /getWardOptions/);
  assert.match(app, /event\.target\?\.name === 'province'/);
  assert.match(app, /defaultValue:'Đồng Tháp'|defaultValue:\s*'Đồng Tháp'/);
});

test('nút cài tiện ích không tải ZIP mà mở Cửa hàng Chrome', async () => {
  const html = await read('web/index.html');
  assert.match(html, /id="installExtensionBtn"/);
  assert.match(html, />CÀI TIỆN ÍCH NGAY</);
  assert.doesNotMatch(html, /installExtensionBtn[^>]+download/);
  assert.doesNotMatch(html, /TIEN_ICH_TRINH_DUYET\.zip/);
  assert.match(html, /chromewebstore\.google\.com/);
});


test('sau khi quay lại từ cửa hàng trang tự tải lại để nhận tiện ích vừa cài', async () => {
  const app = await read('web/js/app.js');
  assert.match(app, /sessionStorage\.setItem\(['"]truong_gpp_waiting_install['"]/);
  assert.match(app, /window\.addEventListener\(['"]focus['"]/);
  assert.match(app, /window\.location\.reload\(\)/);
});
