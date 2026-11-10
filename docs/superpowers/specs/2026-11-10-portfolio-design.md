# 포트폴리오 사이트 설계

- 작성일: 2026-11-10
- 상태: 검토 대기

## 1. 목적

이직 지원에 쓸 개인 포트폴리오를 만든다. 보는 사람은 채용 담당자와 기술 면접관이다.
웹사이트 하나를 만들고, 같은 내용을 PDF로도 뽑아 첨부 파일로 낸다. 마감은 없고 계속 갱신한다.

## 2. 성공 기준

- 면접관이 첫 화면부터 3분 안에 "어떤 개발자이고 무엇을 했는지" 알 수 있다.
- 프로젝트 하나를 추가할 때 `.mdx` 파일 하나만 추가하면 된다.
- PDF는 사이트 데이터로 자동 생성되고 A4 2페이지 이내다.
- velog에 새 글을 쓰면 하루 안에 사이트에 반영된다.

## 3. 범위

포함:
- 첫 화면, 경력, 프로젝트(사내 + 개인), 기술 글, 기술 스택
- 프로젝트 상세 페이지
- PDF 생성과 다운로드 링크
- GitHub Pages 자동 배포

제외:
- 다크 모드, 다국어(한국어만)
- 연락 폼(메일 링크로 대신), 방문자 분석, CMS
- 블로그 직접 운영(글은 velog에 그대로 두고 목록만 가져옴)
- React 컴포넌트(인터랙션이 필요해질 때 `@astrojs/react` 추가)
- 페이지별 OG 이미지 생성(정적 이미지 하나 사용)

## 4. 기술 선택

2026-11-10 npm 기준으로 확인한 버전이다.

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Astro 7.4.x | Node `>=22.23.4` 필요 |
| 콘텐츠 | Content Collections + `@astrojs/mdx` 8.1.x | `src/content.config.ts`, `glob()` 로더 |
| 스키마 | `astro/zod` (zod 4) | frontmatter 검증 |
| 스타일 | 일반 CSS + CSS 변수 | Tailwind 등 추가 안 함 |
| 글꼴 | `pretendard` 1.3.x 패키지의 dynamic subset CSS | OFL 라이선스. 브라우저가 쓰는 글자 조각만 받는다(전체 파일은 약 2MB). PDF 글꼴도 고정 |
| PDF | `playwright` 1.65.x | `page.pdf()` |
| 단위 테스트 | Node 내장 `node --test` | TS는 Node 타입 제거 기능으로 실행 |
| E2E | `@playwright/test` 1.65.x | |
| Node | 24 LTS (`.nvmrc`) | 로컬 Node 22.21.1은 Astro 7 요구 버전보다 낮음 |
| 배포 | GitHub Actions + GitHub Pages | |

## 5. 구조

```
portfolio/
  .nvmrc                       # 24
  astro.config.mjs             # site URL, mdx
  src/
    content.config.ts          # projects 컬렉션 스키마
    content/projects/*.mdx     # 프로젝트 1개 = 파일 1개
    data/profile.ts            # 이름, 소개, 연락처, 경력, 스택, 대표 글
    lib/velog.ts               # RSS 가져오기와 파싱 (Astro 의존 없음)
    layouts/BaseLayout.astro   # <html lang="ko">, title, description, OG
    components/                # Astro 컴포넌트 (Hero, Career, ProjectCard, Posts, Skills)
    pages/
      index.astro
      projects/[slug].astro
      print.astro
      404.astro
    styles/global.css
  public/
    og.png
  scripts/pdf.ts               # dist/print → dist/resume.pdf
  tests/                       # 단위 테스트, fixtures/velog-rss.xml
  e2e/                         # Playwright
  .github/workflows/deploy.yml
```

데이터 흐름:

```
src/content/projects/*.mdx ─┐
src/data/profile.ts ────────┼─> astro build ─> dist/ (/, /projects/*, /print)
velog RSS (빌드할 때 요청) ──┘                      │
                                     scripts/pdf.ts ─┴─> dist/resume.pdf
dist/ ─> GitHub Pages
```

## 6. 데이터

### 6.1 profile.ts

경력과 연락처는 이 파일 하나에서만 고친다.

```ts
type Profile = {
  name: string;
  headline: string;                 // 한 줄 소개
  email: string;                    // 개인 메일
  github: string;                   // URL
  velog: string;                    // https://velog.io/@lsh7315
  velogHandle: string;              // lsh7315 (RSS 주소에 사용)
  siteUrl: string;
  about: string[];                  // 소개 문단 2~3개
  career: {
    company: string;
    team: string;
    start: string;                  // YYYY-MM
    end?: string;                   // 없으면 재직 중
    role: string;
    achievements: string[];         // 숫자로 보여줄 수 있는 성과 위주
  }[];
  skills: {group: string; items: string[]}[];
  pinnedPosts: {title: string; url: string}[];   // 고정할 대표 글 2~3개
  education: {school: string; major: string; start: string; end?: string; status: string}[];  // 비면 섹션 숨김
  certificates: {name: string; issuer: string; date: string}[];                              // 비면 섹션 숨김
};

export const profile = {...} satisfies Profile;
```

### 6.2 projects 컬렉션

```ts
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/);

const projects = defineCollection({
  loader: glob({base: './src/content/projects', pattern: '*.mdx'}),
  schema: ({image}) =>
    z.object({
      title: z.string(),
      company: z.string(),                       // 회사명 또는 '개인'
      start: yearMonth,
      end: yearMonth.optional(),
      role: z.string(),
      stack: z.array(z.string()).min(1),
      summary: z.string().max(80),               // 카드에 쓰는 한 줄
      highlights: z.array(z.string()).min(1).max(3), // 카드와 PDF에 쓰는 핵심 성과
      order: z.number(),
      links: z
        .object({demo: z.url().optional(), github: z.url().optional(), post: z.url().optional()})
        .default({}),
      cover: image().optional(),
      coverAlt: z.string().optional()
    })
    .refine((d) => !d.cover || d.coverAlt, {message: 'cover가 있으면 coverAlt가 필요합니다', path: ['coverAlt']})
});
```

본문은 `## 문제`, `## 역할`, `## 해결`, `## 결과` 순서로 쓴다. 스키마로 강제하지 않고 작성 규칙으로 둔다.
사내 프로젝트는 소스 링크 없이 설명, 다이어그램, 공개 가능한 화면만 넣는다.

## 7. 페이지

| 경로 | 내용 |
|---|---|
| `/` | 한 페이지. 왼쪽 고정 메뉴 + 섹션: 소개 → 경력(회사별 프로젝트) → 프로젝트(개인) → 기술 글 → 기술 스택 → 학력·자격(있을 때만) → 연락처 |
| `/projects/[slug]` | 제목, 회사, 기간, 역할, 스택, 링크, 커버 이미지, 본문 |
| `/print` | PDF 원본. 메뉴에 노출하지 않고 `noindex`. 이미지 없이 연락처, 사이트 주소, 경력, 프로젝트(제목, 회사, 기간, 역할, 스택, highlights, 상세 주소), 스택, 학력·자격(있을 때만) |
| `/404` | 첫 화면 링크 |

### 7.1 첫 화면 구성과 디자인

구성은 사용자가 준 참고 사이트(`yoohyeok.github.io/u-it`)를 따른다. 왼쪽 고정 메뉴에 섹션 링크를 두고, 오른쪽에 섹션을 차례로 놓는다. 참고 사이트보다 덜어낸다: 진한 색 블록, 전부 대문자 라벨, 이력서 수준의 교육 세부 내용은 쓰지 않는다.

```
데스크톱(1024px 이상)
+-------------+---------------------------------------------+
| 이상현       | 이상현                                      |
| 프론트엔드   | 한 줄 소개                                   |
|             | 메일   GitHub   velog   PDF 다운로드         |
| 소개         | 소개 문단                                    |
| 경력  ▌     |                                             |
| 프로젝트     | 경력                                         |
| 기술 글      | 버블콘 개발사업부 UX개발팀      2023.02 – 현재 |
| 기술 스택    |  │ cmi5 코스웨어 v2           2024.xx – ...  |
| 학력·자격    |  │ 요약 / 핵심 성과 / 기술 / 자세히 보기      |
| 연락처       |  │ CASS v2 ...                               |
+-------------+---------------------------------------------+
모바일: 메뉴가 위쪽 고정 막대가 되고 링크는 막대 안에서만 가로로 스크롤한다.
```

- 소개 섹션(`#about`)의 `h1`이 이름이다. 사이드 메뉴의 이름은 제목 요소가 아니다.
- 경력은 회사 아래에 그 회사의 프로젝트(`company`가 같은 항목)를 세로 선으로 이은 타임라인으로 보여준다. 이 타임라인이 페이지에서 유일하게 눈에 띄는 장치다. 실제로 시간 순서가 있는 내용이라 세로 선을 쓴다.
- `company`가 `'개인'`인 프로젝트는 "프로젝트" 섹션에 따로 둔다.
- 날짜는 오른쪽 정렬, `font-variant-numeric: tabular-nums`.
- 카드, 그림자, 그라데이션을 쓰지 않는다. 항목 사이는 여백과 얇은 구분선으로 나눈다.
- 메뉴는 화면에 보이는 섹션의 링크에 `aria-current="true"`와 강조 막대를 표시한다(작은 inline script, `IntersectionObserver`). 스크립트가 없어도 링크는 동작한다.
- 부드러운 스크롤은 `prefers-reduced-motion: no-preference`일 때만 쓴다.
- 색: 본문 `#16202a`, 보조 `#5b6672`, 강조 `#0e6b57`, 배경 `#ffffff`, 메뉴 배경 `#f4f6f5`, 구분선 `#dde3e0`. 글자색은 모두 배경 대비 4.5:1 이상.
- 글꼴은 Pretendard 하나만 쓴다. 이름은 800, 자간 -0.03em. 본문은 16px, 줄 간격 1.7, 본문 폭 최대 720px.

### 7.2 기타

- `/print`는 `@page { size: A4; margin: 12mm; }`를 쓴다.
- `BaseLayout`은 페이지마다 `title`, `description`, `og:title`, `og:description`, `og:image(/og.png)`를 넣는다.
- `/resume.pdf`는 빌드 후에 생성되므로 `astro dev`에서는 404다.

## 8. velog 글

`src/lib/velog.ts`에 함수 세 개를 둔다. Astro를 import하지 않아 Node에서 바로 테스트할 수 있다.

```ts
type Post = {title: string; url: string; publishedAt: Date};

parseVelogRss(xml: string): Post[]               // 순수 함수
fetchVelogPosts(handle: string, limit = 5): Promise<Post[]>  // 실패하면 [] 반환 + console.warn
mergePosts(pinned, recent): {pinned, recent}     // recent에서 pinned와 같은 URL 제거
```

- 피드 주소: `https://v2.velog.io/rss/@lsh7315` (2026-11-10 응답 200 확인)
- 요청 타임아웃은 5초(`AbortSignal.timeout(5000)`).
- XML 라이브러리 없이 정규식으로 `<item>`의 `title`(CDATA 포함), `link`, `pubDate`만 뽑는다. 기본 엔티티(`&amp; &lt; &gt; &quot; &#39;`)는 풀어 준다. `title`이나 `link`가 없는 항목은 건너뛴다.
- 화면에는 "대표 글"(pinnedPosts)과 "최근 글"(RSS 최신 5개)을 나눠 보여준다.
- 정적 사이트라서 새 글은 다시 빌드해야 반영된다. 배포 워크플로가 매일 한 번 빌드한다.

## 9. PDF

`npm run pdf`(빌드 후 실행):

```
astro preview 실행 → chromium으로 /print 열기 → document.fonts.ready 대기
→ page.pdf({path: 'dist/resume.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true})
→ preview 종료
```

- 지원할 때는 사이트에서 `/resume.pdf`를 내려받아 첨부한다.
- 2페이지 초과 여부는 E2E에서 검사한다.

## 10. 배포

- 저장소: 공개 저장소 `<github-id>.github.io`. 사용자 사이트라서 `base` 경로가 필요 없다.
- GitHub 저장소 설정에서 Pages 배포 방식을 "GitHub Actions"로 한 번 지정한다.
- `.github/workflows/deploy.yml`:

```
트리거: main push, 매일 21:00 UTC(한국 06:00), 수동 실행
build job: checkout → setup-node(.nvmrc) → npm ci → playwright chromium 설치
           → npm test → npm run build → npm run pdf → npm run test:e2e
           → upload-pages-artifact(dist)
deploy job: deploy-pages
```

- 커스텀 도메인은 필요할 때 붙인다.

## 11. 오류 처리

| 상황 | 동작 |
|---|---|
| velog RSS 실패, 타임아웃, 0건 파싱 | 경고 로그만 남기고 빌드 계속. 최근 글 없이 대표 글만 표시 |
| 프로젝트 frontmatter 누락이나 형식 오류 | 빌드 실패 |
| `cover` 이미지 경로 오류, `coverAlt` 누락 | 빌드 실패 |
| PDF 생성 실패 | 워크플로 실패. 배포하지 않으며 이전 배포가 유지됨 |
| 단위 테스트나 E2E 실패 | 배포하지 않음 |

## 12. 접근성

- 시맨틱 마크업: `header`, `main`, `section`과 제목 계층(`h1` 하나)
- 모든 이미지에 대체 텍스트(`<Image alt>`, `coverAlt` 스키마 검증)
- 키보드 포커스 표시를 지우지 않는다.
- 본문 글자색과 배경의 명암비는 4.5:1 이상
- 외부 링크는 링크 텍스트로 목적지를 알 수 있게 쓴다.

## 13. 테스트

단위(`node --test tests/`):
- `parseVelogRss`: 저장한 피드 샘플(`tests/fixtures/velog-rss.xml`)에서 제목·주소·날짜를 뽑는다. CDATA와 엔티티를 처리한다. 깨진 항목은 건너뛴다. 빈 문자열이나 XML이 아닌 입력은 `[]`.
- `fetchVelogPosts`: `globalThis.fetch`를 mock해서 실패하면 `[]`를 반환하는지 확인.
- `mergePosts`: recent가 비어 있으면 pinned만 남는다. 중복 URL을 제거한다.

E2E(`@playwright/test`, preview 서버 대상):
- `/`에 이름, 한 줄 소개, `/resume.pdf` 링크가 보인다.
- 첫 프로젝트 카드를 누르면 상세 페이지로 이동하고 제목이 같다.
- `/print`를 PDF로 만들면 2페이지 이하다.
- 없는 주소는 404 페이지를 보여준다.

## 14. 구현 순서

단계마다 테스트를 통과시키고 커밋한다.

1. Node 24 준비, Astro 7 최소 템플릿, `BaseLayout`, `global.css`, Pretendard, `profile.ts`, 첫 화면·경력·스택
2. projects 컬렉션, 카드, 상세 페이지(샘플 프로젝트 1개)
3. `velog.ts`와 단위 테스트, 기술 글 섹션
4. `/print`, `scripts/pdf.ts`, E2E
5. 배포 워크플로
6. 콘텐츠: 프로젝트 3~4개 초안을 저장소와 velog 글을 바탕으로 작성하고 사용자 검토

## 15. 사용자에게 받아야 할 값

설계 결정이 아니라 콘텐츠 값이다. 해당 단계에서 받는다.

- GitHub 아이디(저장소 이름과 사이트 주소)
- 공개할 개인 메일(회사 메일은 쓰지 않는다)
- 한 줄 소개, 경력(입사 연월, 팀, 역할), 성과 수치
- 사내 프로젝트별 공개 범위(회사명, 고객사명, 화면)와 공개 가능한 화면 캡처
- 개인·사이드 프로젝트 1개 선정
- 대표 글 2~3개

## 16. 주의

- 로컬 Node 22.21.1은 Astro 7 요구 버전(`>=22.23.4`)보다 낮아 Node 24로 올려야 한다.
- git 전역 이메일이 회사 메일이다. 첫 push 전에 이 저장소에 개인 메일을 설정하고 기존 커밋 작성자를 바꾼다.
- 사내 프로젝트의 고객사명과 내부 화면은 공개 범위를 확인하기 전까지 넣지 않는다.
- velog RSS는 공식 API가 아니어서 형식이 바뀔 수 있다. 그래도 빌드는 깨지지 않는다.
