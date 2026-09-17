import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }

test('tiện ích dùng MV3 và chỉ xin quyền cố định đúng miền CSDL Dược', () => {
  const manifest = JSON.parse(read('extension/manifest.json'));
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.host_permissions, ['https://csdlduoc.com.vn/*']);
  assert.ok(!manifest.optional_host_permissions);
  assert.ok(manifest.permissions.includes('storage'));
  assert.ok(manifest.permissions.includes('tabs'));
  assert.ok(!manifest.permissions.includes('scripting'));
});

test('tiện ích tự nạp bộ điền trên CSDL Dược và cầu nối chỉ chạy ở trang TRƯỜNG GPP', () => {
  const manifest = JSON.parse(read('extension/manifest.json'));
  const target = manifest.content_scripts.find(x => x.js?.includes('target_filler.js'));
  const bridge = manifest.content_scripts.find(x => x.js?.includes('app_bridge.js'));
  assert.deepEqual(target.matches, ['https://csdlduoc.com.vn/*']);
  assert.ok(bridge.matches.includes('https://truongphoto.github.io/*'));
  assert.ok(bridge.matches.includes('https://truong-gpp.github.io/*'));
});

test('mã tiện ích không có thực thi mã từ xa và không tự bấm đăng ký', () => {
  const source = ['extension/service_worker.js','extension/target_filler.js','extension/app_bridge.js']
    .filter(fs.existsSync).map(read).join('\n');
  assert.doesNotMatch(source, /eval\s*\(/);
  assert.doesNotMatch(source, /new\s+Function\s*\(/);
  assert.doesNotMatch(source, /importScripts\s*\(\s*['"]https?:/);
  assert.doesNotMatch(source, /clickFinalSubmit|solveCaptcha|uploadFileAutomatically/);
});

test('dữ liệu phiên chỉ do tiến trình nền quản lý, không mở kho phiên trực tiếp cho trang đích', () => {
  const target = read('extension/target_filler.js');
  const worker = read('extension/service_worker.js');
  assert.doesNotMatch(target, /chrome\.storage\.session/);
  assert.doesNotMatch(worker, /chrome\.storage\.session/);
  assert.match(worker, /chrome\.storage\.local/);
  assert.match(worker, /GET_PENDING/);
  assert.match(worker, /CLEAR_PENDING/);
  assert.match(worker, /TRUONG_GPP_FILL_NOW/);
  assert.match(target, /TRUONG_GPP_FILL_NOW/);
});
