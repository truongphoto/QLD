import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('trang nhập liệu chạy trực tiếp từ index.html mà không cần máy chủ web', async () => {
  const html = await read('web/index.html');
  assert.doesNotMatch(html, /<script\s+type=["']module["']/i);
  assert.match(html, /<script\s+defer\s+src=["']\.\/js\/app-standalone\.js(?:\?v=[^"']+)?["']/i);

  const bundle = await read('web/js/app-standalone.js');
  assert.doesNotMatch(bundle, /^\s*import\s/m);
  assert.doesNotMatch(bundle, /^\s*export\s/m);
  assert.match(bundle, /Cơ sở bán lẻ/);
  assert.match(bundle, /renderWizard\(\)/);
});

test('tiện ích cho phép cầu nối với trang index mở bằng file', async () => {
  const manifest = JSON.parse(await read('extension/manifest.json'));
  const bridge = manifest.content_scripts.find(item => item.js?.includes('app_bridge.js'));
  assert.ok(bridge, 'Thiếu cầu nối trang nhập liệu');
  assert.ok(bridge.matches.includes('file:///*'), 'Chưa cho phép trang nhập liệu file://');

  const bridgeJs = await read('extension/app_bridge.js');
  assert.match(bridgeJs, /location\.protocol\s*===\s*['"]file:['"]\s*\?\s*['"]\*['"]/);
});
