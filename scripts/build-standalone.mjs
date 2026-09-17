import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const sources = [
  'web/js/schema.js',
  'web/js/validation.js',
  'web/js/state.js',
  'web/js/app.js'
];

function transform(source) {
  return source
    .replace(/^import\s+[^;]+;\s*$/gm, '')
    .replace(/^export\s+/gm, '');
}

const parts = [];
for (const path of sources) {
  const source = await readFile(new URL(path, root), 'utf8');
  parts.push(`\n/* ${path} */\n${transform(source).trim()}\n`);
}

const output = `(() => {\n'use strict';\n${parts.join('\n')}\n})();\n`;
await writeFile(new URL('web/js/app-standalone.js', root), output, 'utf8');
console.log('Đã tạo web/js/app-standalone.js');
