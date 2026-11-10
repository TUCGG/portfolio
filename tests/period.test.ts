import {test} from 'node:test';
import assert from 'node:assert/strict';

import {formatDuration, formatPeriod, monthsBetween} from '../src/lib/period.ts';

test('formatPeriod: 끝이 없으면 현재로 표시한다', () => {
  assert.equal(formatPeriod('2023-03'), '2023.03 – 현재');
});

test('formatPeriod: 시작과 끝을 점으로 표시한다', () => {
  assert.equal(formatPeriod('2023-03', '2024-12'), '2023.03 – 2024.12');
});

test('monthsBetween: 시작 달과 끝 달을 모두 센다', () => {
  assert.equal(monthsBetween('2020-12', '2023-02'), 27);
  assert.equal(monthsBetween('2015-12', '2016-04'), 5);
});

test('monthsBetween: 끝이 없으면 오늘(한국 시간)이 속한 달까지 센다', () => {
  assert.equal(monthsBetween('2023-02', undefined, new Date('2026-11-10T00:00:00+09:00')), 46);
  // 한국은 이미 12월 1일이지만 UTC로는 11월 30일인 순간
  assert.equal(monthsBetween('2026-11', undefined, new Date('2026-11-30T16:00:00Z')), 2);
});

test('formatDuration: 개월 수를 년과 개월로 표시한다', () => {
  assert.equal(formatDuration(27), '2년 3개월');
  assert.equal(formatDuration(11), '11개월');
  assert.equal(formatDuration(24), '2년');
});
