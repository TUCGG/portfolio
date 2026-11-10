import {test} from 'node:test';
import assert from 'node:assert/strict';

import {fetchBadgeSize, parseSvgSize, techBadge} from '../src/lib/tech.ts';

test('techBadge: 알려진 기술은 로고와 공식 색이 있는 shields.io 배지', () => {
  assert.equal(
    techBadge('TypeScript'),
    'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white'
  );
});

test('techBadge: 뒤에 붙은 버전은 찾을 때만 무시하고 배지 글자에는 남긴다', () => {
  assert.equal(
    techBadge('React 19'),
    'https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB'
  );
});

test('techBadge: 모르는 기술은 테마 색 배지이고 글자의 공백과 하이픈을 이스케이프한다', () => {
  assert.equal(techBadge('dnd-kit'), 'https://img.shields.io/badge/dnd--kit-1B6B4E?style=for-the-badge');
  assert.equal(techBadge('IMS CASE'), 'https://img.shields.io/badge/IMS%20CASE-1B6B4E?style=for-the-badge');
});

test('parseSvgSize: 배지 SVG의 width와 height를 읽고 width는 올림한다', () => {
  assert.deepEqual(parseSvgSize('<svg xmlns="http://www.w3.org/2000/svg" width="110.5" height="28" role="img">'), {width: 111, height: 28});
  assert.equal(parseSvgSize('<html>오류</html>'), undefined);
});

test('fetchBadgeSize: 요청이 실패하면 undefined라서 빌드를 멈추지 않는다', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('network');
  });
  t.mock.method(console, 'warn', () => {});
  assert.equal(await fetchBadgeSize('https://img.shields.io/badge/X-000000?style=for-the-badge'), undefined);
});
