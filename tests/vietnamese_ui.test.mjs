import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const visibleFiles = ['web/index.html','extension/panel.css','extension/target_filler.js','extension/manifest.json'];
const text = visibleFiles.filter(fs.existsSync).map(f => fs.readFileSync(f, 'utf8')).join('\n');

test('giao diện không dùng các nhãn kỹ thuật tiếng Anh đã loại bỏ', () => {
  for (const word of ['Profile', 'Verify', 'Checkpoint', 'Submit', 'Extension']) {
    assert.doesNotMatch(text, new RegExp(`\\b${word}\\b`, 'i'));
  }
});
