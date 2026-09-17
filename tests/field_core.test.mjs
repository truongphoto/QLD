import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText, scoreCandidate, chooseOptionValue, normalizeComparable } from '../extension/field_core.js';

test('normalizeText removes Vietnamese diacritics and punctuation', () => {
  assert.equal(normalizeText('Số Chứng chỉ HÀNH NGHỀ'), 'so chung chi hanh nghe');
});

test('candidate with exact alias scores higher than partial match', () => {
  const aliases = ['tên cơ sở', 'ten co so'];
  const exact = scoreCandidate('Tên cơ sở', aliases);
  const partial = scoreCandidate('Tên cơ sở kinh doanh dược', aliases);
  assert.ok(exact > partial);
  assert.ok(exact >= 100);
});

test('select option matcher ignores accents and case', () => {
  const options = [
    { value: '1', text: 'Nhà thuốc' },
    { value: '2', text: 'Quầy thuốc' }
  ];
  assert.equal(chooseOptionValue(options, 'nha thuoc'), '1');
});

test('normalizeComparable makes common date formats comparable', () => {
  assert.equal(normalizeComparable('17/09/2026'), normalizeComparable('2026-09-17'));
});
