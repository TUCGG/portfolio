# 포트폴리오 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이직 지원용 포트폴리오 정적 사이트와 같은 내용의 A4 PDF를 만들고 GitHub Pages에 자동 배포한다.

**Architecture:** Astro 7 정적 사이트다. 경력·연락처는 `src/data/profile.ts`, 프로젝트는 Content Collection(`.mdx` 1개 = 1개 프로젝트)에서 읽는다. velog 글은 빌드할 때 RSS로 가져온다. 빌드 결과의 `/print` 페이지를 Playwright로 PDF로 만들어 `dist/resume.pdf`에 둔다.

**Tech Stack:** Astro 7.4.x, @astrojs/mdx 8.1.x, astro/zod(zod 4), pretendard 1.3.x, @playwright/test 1.65.x, Node 24 내장 test runner, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-11-10-portfolio-design.md`

## Global Constraints

- Node 24 LTS. `.nvmrc`는 `24`. Astro 7.4.x는 Node `>=22.23.4`가 필요하다. 로컬은 nvm으로 설치한다.
- dependencies: `astro@^7.4.8`, `@astrojs/mdx@^8.1.3`, `pretendard@^1.3.9`. devDependencies: `@playwright/test@^1.65.0`. 이 밖의 패키지(React, Tailwind, XML 파서, Vitest 등)는 추가하지 않는다.
- `src/lib/*.ts`와 `src/data/profile.ts`는 `astro:*`를 import하지 않는다. TS는 지울 수 있는 문법만 쓴다(enum, 파라미터 프로퍼티 금지). 상대 경로 import는 `.ts` 확장자까지 쓴다. Node `--test`와 Playwright가 바로 읽기 위해서다.
- 화면 문구는 한국어, `<html lang="ko">`.
- velog 피드는 `https://v2.velog.io/rss/@lsh7315`. 타임아웃 5000ms, 최근 글 5개.
- PDF는 A4, 1~2페이지, `@page { size: A4; margin: 12mm; }`.
- 색 토큰: 본문 `#1a1a1a`, 보조 `#555555`, 링크 `#0b57d0`, 배경 `#ffffff`. 모두 흰 배경 대비 4.5:1 이상. `:focus-visible` outline을 지우지 않는다.
- 글꼴: `BaseLayout`에서 `pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css`를 import하고 `font-family: 'Pretendard Variable', Pretendard, sans-serif`.
- 테스트 파일 이름: 단위 `tests/*.test.ts`, E2E `e2e/*.e2e.ts`.
- GitHub Actions 버전: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`.
- 사내 프로젝트의 고객사명과 내부 화면은 사용자가 공개 범위를 확인하기 전까지 넣지 않는다.
- push와 GitHub 저장소 생성은 사용자가 승인한 뒤에만 한다.

## Review Focus

1. 화면 너비 375px에서 긴 기술명이나 URL 때문에 가로 스크롤이 생기면 안 된다. Task 1에서 `/`, Task 2에서 상세 페이지를 검사한다.
2. 재직 중이거나 진행 중인 항목(`end` 없음)은 "2023.03 – 현재"로 표시해야 한다. Task 1의 `formatPeriod`에서 검사한다.
3. velog 글 본문(description)에 `<link>`나 `</item>` 문자열이 있어도 목록이 깨지면 안 된다. Task 3의 fixture에서 검사한다.
4. 글꼴이 로딩되기 전에 인쇄되면 PDF에 Pretendard가 빠진다. Task 4에서 PDF에 글꼴이 들어갔는지 검사한다.
5. 키보드로 이동할 때 포커스 위치가 보여야 한다. Task 1에서 검사한다.

---

### Task 1: 기본 틀, 첫 화면, 경력, 기술 스택, 404

**Files:**
- Create: `.nvmrc`, `.gitignore`, `package.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`
- Create: `src/data/profile.ts`, `src/lib/period.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Create: `src/components/Hero.astro`, `src/components/Career.astro`, `src/components/Skills.astro`
- Create: `src/pages/index.astro`, `src/pages/404.astro`
- Test: `tests/period.test.ts`, `e2e/home.e2e.ts`

**Interfaces:**
- Produces:
  - `src/data/profile.ts`: `export type Profile`(스펙 6.1과 같음, `velogHandle` 포함), `export const profile`
  - `src/lib/period.ts`: `formatPeriod(start: string, end?: string): string`. `YYYY-MM`을 `YYYY.MM`으로 바꾼다. 구분자는 ` – `(en dash), `end`가 없으면 `현재`.
  - `src/layouts/BaseLayout.astro` props: `{title: string; description: string; noindex?: boolean}`
  - npm scripts: `dev`, `build`, `preview`, `test`, `pdf`, `test:e2e`, `verify`(Task 4에서 `pdf` 구현)

- [ ] **Step 1: 사용자에게 값을 받는다**

개인 메일, GitHub 아이디, 입사 연월(YYYY-MM)을 묻는다. 한 줄 소개와 기술 스택은 초안을 써서 보여주고 Task 6에서 다듬는다.

- [ ] **Step 2: git 작성자를 개인 메일로 바꾼다**

rebase는 작업 트리가 깨끗해야 한다. `docs/`에 커밋하지 않은 변경이 있으면 먼저 `git add docs && git commit -m "docs: 구현 계획 추가"`.

```bash
git config user.email "<개인 메일>"
git rebase -r --root --exec "git commit --amend --no-edit --reset-author"
git log --format='%h %ae %s'
```

Expected: 모든 커밋의 작성자 메일이 개인 메일이다. 아직 push한 적이 없어서 히스토리를 다시 써도 된다.

- [ ] **Step 3: Node 24와 패키지를 준비한다**

```bash
nvm install 24 && nvm use 24 && node -v
```

Expected: `v24.x`. 이어서 `.nvmrc`(`24`), `.gitignore`(`node_modules`, `dist`, `.astro`, `test-results`, `playwright-report`), `package.json`(`"type": "module"`, `"private": true`, Global Constraints의 의존성)을 만든다.

scripts:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "node --test \"tests/*.test.ts\"",
  "pdf": "node scripts/pdf.ts",
  "test:e2e": "playwright test",
  "verify": "npm test && npm run build && npm run pdf && npm run test:e2e"
}
```

`npm install && npx playwright install chromium`

- [ ] **Step 4: 설정 파일을 만든다**

- `astro.config.mjs`: `site: profile.siteUrl`(`./src/data/profile.ts`에서 import). `integrations: [mdx()]`
- `tsconfig.json`: `{"extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"]}`
- `playwright.config.ts`:
  - `testDir: 'e2e'`, `testMatch: '**/*.e2e.ts'`
  - `use.baseURL: 'http://localhost:4321'`
  - `webServer: {command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI}`
  - projects는 chromium 하나
  - webServer에서 build하지 않는다. build가 `dist/resume.pdf`를 지우기 때문이다.

- [ ] **Step 5: 실패하는 단위 테스트를 쓴다** (`tests/period.test.ts`)

```ts
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {formatPeriod} from '../src/lib/period.ts';

test('formatPeriod: 끝이 없으면 현재로 표시한다', () => {
  assert.equal(formatPeriod('2023-03'), '2023.03 – 현재');
});

test('formatPeriod: 시작과 끝을 점으로 표시한다', () => {
  assert.equal(formatPeriod('2023-03', '2024-12'), '2023.03 – 2024.12');
});
```

Run: `npm test`
Expected: FAIL (`period.ts` 없음)

- [ ] **Step 6: `formatPeriod`와 `profile.ts`를 구현한다**

- `profile.ts`의 고정값:
  - `name: '이상현'`
  - `velog: 'https://velog.io/@lsh7315'`, `velogHandle: 'lsh7315'`
  - `siteUrl: 'https://<GitHub 아이디>.github.io'`
  - `career[0]`: `company: '버블콘'`, `team: '개발사업부 UX개발팀'`, `start: <입사 연월>`
- 나머지(`headline`, `role`, `achievements`, `skills`, `pinnedPosts`)는 Step 1의 초안을 넣는다. `pinnedPosts`는 Task 3 전까지 빈 배열이어도 된다.

Run: `npm test`
Expected: PASS 2

- [ ] **Step 7: 실패하는 E2E를 쓴다** (`e2e/home.e2e.ts`)

`profile`은 `../src/data/profile.ts`, `formatPeriod`는 `../src/lib/period.ts`에서 import한다.

```ts
test('첫 화면에 이름, 한 줄 소개, PDF 링크가 보인다', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1})).toHaveText(profile.name);
  await expect(page.getByText(profile.headline)).toBeVisible();
  await expect(page.getByRole('link', {name: 'PDF 다운로드'})).toHaveAttribute('href', '/resume.pdf');
});

test('경력에 재직 기간이 보인다', async ({page}) => {
  await page.goto('/');
  const c = profile.career[0];
  await expect(page.getByText(formatPeriod(c.start, c.end))).toBeVisible();
});

test('375px 너비에서 가로 스크롤이 없다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 800});
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('Tab으로 이동하면 포커스 표시가 보인다', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

test('없는 주소는 404 페이지를 보여준다', async ({page}) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('link', {name: '첫 화면으로'})).toHaveAttribute('href', '/');
});
```

Run: `npm run build && npm run test:e2e`
Expected: FAIL (페이지 없음)

- [ ] **Step 8: 레이아웃, 컴포넌트, 페이지를 구현한다**

- `BaseLayout`:
  - `<html lang="ko">`, `<title>`, `meta description`
  - `og:title`, `og:description`, `og:image`(`new URL('/og.png', Astro.site)`)
  - `noindex`면 `<meta name="robots" content="noindex">`
  - pretendard CSS와 `global.css`를 import한다.
- `global.css`:
  - Global Constraints의 색 토큰을 CSS 변수로 둔다.
  - `overflow-wrap: anywhere`로 긴 단어가 줄바꿈되게 한다.
  - `:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }`
- `Hero`: `h1` 이름, 한 줄 소개, 링크(메일 `mailto:`, GitHub, velog, `PDF 다운로드` → `/resume.pdf`)
- `Career`: `<section aria-labelledby>` + `h2` "경력". 항목마다 회사·팀·`formatPeriod`·역할·성과 목록을 둔다.
- `Skills`: `h2` "기술 스택". 그룹별 목록.
- `index.astro`: Hero → Career → Skills. Task 2와 3에서 그 사이에 섹션을 넣는다.
- `404.astro`: `h1` "페이지를 찾을 수 없습니다", `첫 화면으로` 링크.

Run: `npm run build && npm run test:e2e`
Expected: PASS 5

- [ ] **Step 9: 커밋**

```bash
git add -A && git commit -m "feat: Astro 기본 틀과 첫 화면, 경력, 기술 스택"
```

---

### Task 2: 프로젝트 컬렉션, 카드, 상세 페이지

**Files:**
- Create: `src/content.config.ts`, `src/lib/projects.ts`, `src/components/ProjectCard.astro`, `src/pages/projects/[slug].astro`
- Create: `src/content/projects/cmi5-courseware-v2.mdx`(샘플. Task 6에서 다시 씀)
- Modify: `src/pages/index.astro`(Career와 Skills 사이에 프로젝트 섹션)
- Test: `tests/projects.test.ts`, `e2e/projects.e2e.ts`

**Interfaces:**
- Consumes: `BaseLayout`, `formatPeriod`(Task 1)
- Produces:
  - 컬렉션 `projects`. 스키마는 스펙 6.2 그대로이며 `astro/zod`의 `z`를 쓴다.
  - `src/lib/projects.ts`: `sortProjects<T extends {id: string; data: {order: number}}>(entries: T[]): T[]`. `order` 오름차순, 같으면 `id` 오름차순. 입력 배열은 바꾸지 않는다.
  - `ProjectCard.astro` props: `{project: CollectionEntry<'projects'>}`. 마크업은 `<article>` 안에 `<h3><a href="/projects/{id}/">{title}</a></h3>`, 이어서 summary, highlights, 회사·기간, 스택.
  - 상세 URL: `/projects/{entry.id}/`

- [ ] **Step 1: 실패하는 단위 테스트를 쓴다** (`tests/projects.test.ts`)

```ts
test('sortProjects: order 오름차순, 같으면 id 오름차순', () => {
  const input = [
    {id: 'b', data: {order: 1}},
    {id: 'a', data: {order: 1}},
    {id: 'c', data: {order: 0}}
  ];
  assert.deepEqual(sortProjects(input).map((e) => e.id), ['c', 'a', 'b']);
  assert.deepEqual(input.map((e) => e.id), ['b', 'a', 'c']);
});
```

Run: `npm test`
Expected: FAIL

- [ ] **Step 2: `sortProjects`를 구현한다** (`toSorted` 사용)

Run: `npm test`
Expected: PASS

- [ ] **Step 3: 컬렉션과 샘플 프로젝트를 만든다**

- `content.config.ts`: 스펙 6.2의 스키마를 그대로 쓴다. import 경로는 `defineCollection`은 `astro:content`, `glob`은 `astro/loaders`, `z`는 `astro/zod`.
- 샘플 `cmi5-courseware-v2.mdx`: 모든 필수 필드를 채운다. 본문은 `## 문제`, `## 역할`, `## 해결`, `## 결과` 제목만 두고 각 한 문장. `cover`는 넣지 않는다.

Run: `npm run build`
Expected: 성공

- [ ] **Step 4: 스키마 검증을 손으로 확인한다**

- 샘플에서 `summary`를 지우고 `npm run build`를 실행해 실패하는지 본다. 확인 후 되돌린다.
- `cover: ./없는파일.png`를 넣고 다시 빌드해 실패하는지 본다. 확인 후 되돌린다.

Expected: 두 경우 모두 빌드가 실패하고 오류 메시지에 필드 이름이 나온다.

- [ ] **Step 5: 실패하는 E2E를 쓴다** (`e2e/projects.e2e.ts`)

```ts
test('첫 프로젝트 카드를 누르면 같은 제목의 상세 페이지로 간다', async ({page}) => {
  await page.goto('/');
  const card = page.getByRole('article').first();
  const title = (await card.getByRole('heading').innerText()).trim();
  await card.getByRole('link', {name: title}).click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText(title);
});

test('상세 페이지는 375px 너비에서 가로 스크롤이 없다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 800});
  await page.goto('/projects/cmi5-courseware-v2/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
```

Run: `npm run build && npm run test:e2e`
Expected: 새 테스트 2개 FAIL

- [ ] **Step 6: 카드, 프로젝트 섹션, 상세 페이지를 구현한다**

- `index.astro`: `h2` "프로젝트" 섹션에 `sortProjects(await getCollection('projects'))`를 `ProjectCard`로 렌더링한다.
- `[slug].astro`:
  - `getStaticPaths`는 컬렉션 전체에서 `params: {slug: entry.id}`를 만든다.
  - 머리말: `h1` 제목, 회사, `formatPeriod`, 역할, 스택, 있는 링크만 표시한다.
  - `cover`가 있으면 `astro:assets`의 `<Image src={cover} alt={coverAlt}>`.
  - 본문은 `render(entry)`의 `<Content />`.

Run: `npm test && npm run build && npm run test:e2e`
Expected: 모두 PASS

- [ ] **Step 7: 커밋**

```bash
git add -A && git commit -m "feat: 프로젝트 컬렉션과 상세 페이지"
```

---

### Task 3: velog 글

**Files:**
- Create: `src/lib/velog.ts`, `src/components/Posts.astro`, `tests/fixtures/velog-rss.xml`
- Modify: `src/pages/index.astro`(프로젝트와 Skills 사이에 기술 글 섹션), `src/data/profile.ts`(`pinnedPosts` 2~3개)
- Test: `tests/velog.test.ts`, `e2e/home.e2e.ts`(테스트 1개 추가)

**Interfaces:**
- Consumes: `profile.velogHandle`, `profile.pinnedPosts`(Task 1)
- Produces (`src/lib/velog.ts`):
  - `export type Post = {title: string; url: string; publishedAt: Date}`
  - `export type PinnedPost = {title: string; url: string}`
  - `parseVelogRss(xml: string): Post[]`
  - `fetchVelogPosts(handle: string, limit = 5): Promise<Post[]>`. URL은 `https://v2.velog.io/rss/@${handle}`, `signal: AbortSignal.timeout(5000)`. 실패하거나 응답이 `!res.ok`면 `console.warn` 후 `[]`.
  - `mergePosts(pinned: PinnedPost[], recent: Post[]): {pinned: PinnedPost[]; recent: Post[]}`. recent에서 pinned와 URL이 같은 글을 뺀다.
  - `Posts.astro` props: `{pinned: PinnedPost[]; recent: Post[]}`

- [ ] **Step 1: fixture를 만든다** (`tests/fixtures/velog-rss.xml`)

velog 실제 형식(item 안 순서: title → link → guid → pubDate → description)을 따른 손으로 쓴 피드다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
<title>TUCG.log</title><link>https://velog.io/</link>
<item>
  <title><![CDATA[첫 글 & 테스트]]></title>
  <link>https://velog.io/@lsh7315/first</link>
  <guid>https://velog.io/@lsh7315/first</guid>
  <pubDate>Mon, 02 Nov 2026 07:58:22 GMT</pubDate>
  <description><![CDATA[<p>본문에 <link>가짜</link>와 </item>이 있다</p>]]></description>
</item>
<item>
  <title>둘째 글 &amp; &lt;태그&gt;</title>
  <link>https://velog.io/@lsh7315/second</link>
  <pubDate>Sun, 01 Nov 2026 01:00:00 GMT</pubDate>
</item>
<item>
  <title><![CDATA[링크 없는 글]]></title>
  <pubDate>Sat, 31 Oct 2026 01:00:00 GMT</pubDate>
</item>
<item>
  <title><![CDATA[날짜가 깨진 글]]></title>
  <link>https://velog.io/@lsh7315/bad-date</link>
  <pubDate>not a date</pubDate>
</item>
</channel></rss>
```

- [ ] **Step 2: 실패하는 단위 테스트를 쓴다** (`tests/velog.test.ts`)

fixture는 `readFileSync(new URL('./fixtures/velog-rss.xml', import.meta.url), 'utf8')`로 읽는다.

```ts
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
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('network'); });
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
  assert.deepEqual(mergePosts(pinned, recent).recent.map((p) => p.url), ['https://velog.io/@lsh7315/b']);
});
```

Run: `npm test`
Expected: velog 테스트 FAIL

- [ ] **Step 3: `velog.ts`를 구현한다**

`parseVelogRss` 순서:

```
1. <description><![CDATA[ ... ]]></description> 블록을 모두 지운다
   (CDATA 안에는 "]]>"가 나올 수 없어서 끝 위치가 확실하다)
2. <item>...</item>을 하나씩 뽑는다
3. 각 item에서 title, link, pubDate의 첫 값을 뽑는다
   - CDATA면 안의 문자열을 그대로 쓴다
   - 아니면 &amp; &lt; &gt; &quot; &#39; 를 푼다
4. title이나 link가 없거나, new Date(pubDate)가 Invalid Date면 건너뛴다
```

Run: `npm test`
Expected: 모두 PASS

- [ ] **Step 4: 기술 글 섹션을 붙이고 E2E를 추가한다**

- `profile.pinnedPosts`에 velog의 대표 글 2~3개(제목, URL)를 넣는다. 사용자에게 고르게 하고, 정하기 전에는 React 19.3 글과 CASS v2 글을 초안으로 쓴다.
- `index.astro`는 빌드할 때 `mergePosts(profile.pinnedPosts, await fetchVelogPosts(profile.velogHandle))`를 `Posts`에 넘긴다.
- `Posts`: `h2` "기술 글". "대표 글" 목록과 "최근 글" 목록을 둔다. 최근 글에는 날짜(`YYYY.MM.DD`)를 붙이고, 최근 글이 없으면 그 목록은 렌더링하지 않는다. 맨 아래에 velog 전체 보기 링크를 둔다.
- `e2e/home.e2e.ts`에 추가:

```ts
test('기술 글 섹션에 대표 글이 보인다', async ({page}) => {
  await page.goto('/');
  for (const p of profile.pinnedPosts) {
    await expect(page.getByRole('link', {name: p.title})).toHaveAttribute('href', p.url);
  }
});
```

Run: `npm test && npm run build && npm run test:e2e`
Expected: 모두 PASS. 빌드 로그에 velog 경고가 없다.

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "feat: velog 대표 글과 최근 글 목록"
```

---

### Task 4: 인쇄 페이지와 PDF

**Files:**
- Create: `src/pages/print.astro`, `scripts/pdf.ts`
- Test: `e2e/print.e2e.ts`

**Interfaces:**
- Consumes: `profile`, `formatPeriod`, `sortProjects`, 컬렉션 `projects`, `BaseLayout`(`noindex`)
- Produces: `npm run pdf` → `dist/resume.pdf`(build 다음에 실행)

- [ ] **Step 1: 실패하는 E2E를 쓴다** (`e2e/print.e2e.ts`)

```ts
test('/print는 검색 제외 표시가 있다', async ({page}) => {
  await page.goto('/print/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('/resume.pdf는 1~2페이지이고 Pretendard 글꼴이 들어 있다', async ({request}) => {
  const res = await request.get('/resume.pdf');
  expect(res.status()).toBe(200);
  const pdf = (await res.body()).toString('latin1');
  const pages = pdf.match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0;
  expect(pages).toBeGreaterThanOrEqual(1);
  expect(pages).toBeLessThanOrEqual(2);
  expect(pdf).toContain('Pretendard');
});
```

Run: `npm run build && npm run test:e2e`
Expected: 두 테스트 FAIL

- [ ] **Step 2: `print.astro`를 구현한다**

- `BaseLayout`에 `noindex`를 넘긴다.
- 내용: 이름, 한 줄 소개, 메일, 사이트 주소(`profile.siteUrl`), 경력, 프로젝트(정렬 후 제목, 회사, 기간, 역할, 스택, highlights, `{siteUrl}/projects/{id}/`), 기술 스택. 이미지는 넣지 않는다.
- 인쇄 규칙은 `<style is:global>`에 둔다. `@page { size: A4; margin: 12mm; }`, 본문 10pt 안팎, 링크는 주소가 보이게 쓴다.

- [ ] **Step 3: `scripts/pdf.ts`를 구현한다**

```
- import {preview} from 'astro', import {chromium} from '@playwright/test'
- root = fileURLToPath(new URL('..', import.meta.url))
- server = await preview({root, logLevel: 'error'})
- try:
    chromium.launch → newPage
    → goto(`http://localhost:${server.port}/print/`, {waitUntil: 'networkidle'})
    → page.evaluate(() => document.fonts.ready)
    → page.pdf({path: <root>/dist/resume.pdf, format: 'A4', printBackground: true, preferCSSPageSize: true})
    → browser.close
- finally: server.stop()
```

실패하면 예외를 그대로 던져 종료 코드가 0이 아니게 한다.

Run: `npm run verify`
Expected: 모두 PASS. `dist/resume.pdf`를 열어 한글 글꼴과 줄바꿈을 눈으로 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add -A && git commit -m "feat: 인쇄 페이지와 PDF 생성"
```

---

### Task 5: 배포 워크플로

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run verify`(Task 4), `.nvmrc`(Task 1)

- [ ] **Step 1: 워크플로를 만든다**

```yaml
name: deploy
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 21 * * *' # 한국 06:00, velog 새 글 반영
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run verify
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: 로컬에서 같은 명령을 확인한다**

Run: `npm ci && npm run verify`
Expected: 모두 PASS

- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "ci: GitHub Pages 배포 워크플로"
```

- [ ] **Step 4: 사용자 승인 후 저장소를 연결한다**

- 사용자가 할 일:
  - GitHub에 공개 저장소 `<GitHub 아이디>.github.io`를 만든다.
  - Settings → Pages → Source를 "GitHub Actions"로 지정한다.
- 사용자가 push를 승인하면 `git remote add origin ...` 후 `git push -u origin main`.

Expected: Actions의 deploy 실행이 성공하고 `https://<GitHub 아이디>.github.io/`와 `/resume.pdf`가 열린다.

---

### Task 6: 콘텐츠 작성

**Files:**
- Create/Modify: `src/content/projects/*.mdx`(3~4개), `src/data/profile.ts`
- Create: `public/og.png`, `src/assets/projects/*`(공개 가능한 화면이 있을 때만)

**Interfaces:**
- Consumes: 스펙 6.2 스키마(Task 2), `profile`(Task 1)

- [ ] **Step 1: 자료를 모은다**

읽기만 한다.
- 저장소: `~/Documents/workspace/cmi5-courseware-v2`, `~/Documents/workspace/cass-v2`, `~/Documents/workspace/bbc-homepage`의 README, `package.json`, 주요 구조
- velog 글: "SCORM에서 xAPI, cmi5까지", "기존 데이터를 깨지 않고 리뉴얼하기"

- [ ] **Step 2: 초안을 쓴다**

- 프로젝트 3개(사내)의 `.mdx` 초안을 쓴다. 본문은 `## 문제`, `## 역할`, `## 해결`, `## 결과` 순서다.
- 수치를 모르는 곳은 비워 두지 말고 사용자에게 물을 목록으로 따로 모은다.
- 고객사명과 내부 화면은 넣지 않는다.
- 샘플 `cmi5-courseware-v2.mdx`는 이 초안으로 바꾼다.

- [ ] **Step 3: 사용자 검토를 받는다**

다음을 확인받는다.
- 프로젝트별 공개 범위
- 성과 수치
- 사이드 프로젝트 1개
- 한 줄 소개, 기술 스택, 대표 글

받은 대로 고친다.

- [ ] **Step 4: OG 이미지를 만든다**

```bash
npm run build && (npm run preview &) && npx playwright screenshot --viewport-size=1200,630 http://localhost:4321/ public/og.png
```

preview 프로세스는 확인 후 종료한다.

- [ ] **Step 5: 확인한다**

Run: `npm run verify`
Expected: 모두 PASS. 실제 내용으로도 PDF가 2페이지 이하다. 넘으면 highlights를 줄이고, 글자 크기는 줄이지 않는다.

- [ ] **Step 6: 커밋**

```bash
git add -A && git commit -m "content: 프로젝트와 프로필 내용 작성"
```
