import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';

import {fetchVelogPosts, mergePosts, parseVelogRss} from '../src/lib/velog.ts';

const xml = readFileSync(new URL('./fixtures/velog-rss.xml', import.meta.url), 'utf8');

test('parseVelogRss: 정상 항목만 순서대로 뽑고 description 내용에 속지 않는다', () => {
  assert.deepEqual(parseVelogRss(xml), [
    {title: '첫 글 & 테스트', url: 'https://velog.io/@lsh7315/first', publishedAt: new Date('2026-11-02T07:58:22Z')},
    {title: '둘째 글 & <태그>', url: 'https://velog.io/@lsh7315/second', publishedAt: new Date('2026-11-01T01:00:00Z')}
  ]);
});

test('parseVelogRss: 빈 문자열이나 HTML은 빈 배열', () => {
  assert.deepEqual(parseVelogRss(''), []);
  assert.deepEqual(parseVelogRss('<html><body>오류</body></html>'), []);
});

test('fetchVelogPosts: 요청이 실패하면 빈 배열', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('network');
  });
  t.mock.method(console, 'warn', () => {});
  assert.deepEqual(await fetchVelogPosts('lsh7315'), []);
});

test('fetchVelogPosts: 200이 아니면 빈 배열', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('error', {status: 500}));
  t.mock.method(console, 'warn', () => {});
  assert.deepEqual(await fetchVelogPosts('lsh7315'), []);
});

test('fetchVelogPosts: 피드 주소로 요청하고 limit만큼 자른다', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response(xml));
  const posts = await fetchVelogPosts('lsh7315', 1);
  assert.equal(fetchMock.mock.calls[0].arguments[0], 'https://v2.velog.io/rss/@lsh7315');
  assert.equal(posts.length, 1);
});

test('mergePosts: recent가 비면 pinned만 남는다', () => {
  const pinned = [{title: 'A', url: 'https://velog.io/@lsh7315/a'}];
  assert.deepEqual(mergePosts(pinned, []), {pinned, recent: []});
});

test('mergePosts: pinned와 같은 URL은 recent에서 뺀다', () => {
  const pinned = [{title: 'A', url: 'https://velog.io/@lsh7315/a'}];
  const recent = [
    {title: 'A', url: 'https://velog.io/@lsh7315/a', publishedAt: new Date('2026-11-01')},
    {title: 'B', url: 'https://velog.io/@lsh7315/b', publishedAt: new Date('2026-10-01')}
  ];
  assert.deepEqual(
    mergePosts(pinned, recent).recent.map((p) => p.url),
    ['https://velog.io/@lsh7315/b']
  );
});
