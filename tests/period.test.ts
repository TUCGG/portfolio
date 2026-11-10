import {test} from 'node:test';
import assert from 'node:assert/strict';

import {formatPeriod} from '../src/lib/period.ts';

test('formatPeriod: 끝이 없으면 현재로 표시한다', () => {
  assert.equal(formatPeriod('2023-03'), '2023.03 – 현재');
});

test('formatPeriod: 시작과 끝을 점으로 표시한다', () => {
  assert.equal(formatPeriod('2023-03', '2024-12'), '2023.03 – 2024.12');
});
