/**
 * 기술 배지(img.shields.io, style=for-the-badge). 색과 로고는 Ileriayo/markdown-badges를 따른다.
 * 로고 이름은 Simple Icons slug이고, 목록에 없는 기술은 테마 색 배지로 만든다.
 * Simple Icons에서 빠진 로고(AWS S3, Playwright, SonarQube, Semgrep)는 색만 쓴다.
 */
const THEME = '1B6B4E';

type Badge = {color: string; logo?: string; logoColor?: string};

const BADGES: Record<string, Badge> = {
  typescript: {color: '007ACC', logo: 'typescript', logoColor: 'white'},
  javascript: {color: '323330', logo: 'javascript', logoColor: 'F7DF1E'},
  html: {color: 'E34F26', logo: 'html5', logoColor: 'white'},
  css: {color: '663399', logo: 'css', logoColor: 'white'},
  react: {color: '20232A', logo: 'react', logoColor: '61DAFB'},
  'next.js': {color: '000000', logo: 'nextdotjs', logoColor: 'white'},
  'tanstack query': {color: 'FF4154', logo: 'reactquery', logoColor: 'white'},
  zustand: {color: '443E38'},
  zod: {color: '3E67B1', logo: 'zod', logoColor: 'white'},
  vite: {color: '646CFF', logo: 'vite', logoColor: 'white'},
  'tailwind css': {color: '38B2AC', logo: 'tailwindcss', logoColor: 'white'},
  astro: {color: '2C2052', logo: 'astro', logoColor: 'white'},
  'three.js': {color: '000000', logo: 'threedotjs', logoColor: 'white'},
  i18next: {color: '26A69A', logo: 'i18next', logoColor: 'white'},
  'node.js': {color: '6DA55F', logo: 'nodedotjs', logoColor: 'white'},
  express: {color: '404D59', logo: 'express', logoColor: '61DAFB'},
  nestjs: {color: 'E0234E', logo: 'nestjs', logoColor: 'white'},
  typeorm: {color: 'FE0803', logo: 'typeorm', logoColor: 'white'},
  elasticsearch: {color: '005571', logo: 'elasticsearch', logoColor: 'white'},
  mysql: {color: '4479A1', logo: 'mysql', logoColor: 'white'},
  'aws s3': {color: '569A31'},
  vitest: {color: '252529', logo: 'vitest', logoColor: 'FCC72B'},
  playwright: {color: '2EAD33'},
  sonarqube: {color: '126ED3'},
  semgrep: {color: '1B2F4C'}
};

// shields.io 정적 배지 글자 규칙: '-'는 '--', '_'는 '__'로 쓰고 나머지는 URL 인코딩한다.
const escapeLabel = (text: string) =>
  encodeURIComponent(text.replaceAll('-', '--').replaceAll('_', '__'));

/** 'React 19'처럼 뒤에 붙은 버전은 찾을 때만 무시하고 배지 글자에는 그대로 둔다. */
export function techBadge(name: string): string {
  const key = name
    .toLowerCase()
    .replace(/\s+v?\d[\w.]*$/, '')
    .trim();
  const badge = BADGES[key] ?? {color: THEME};
  const params = new URLSearchParams({style: 'for-the-badge'});
  if (badge.logo) params.set('logo', badge.logo);
  if (badge.logoColor) params.set('logoColor', badge.logoColor);
  return `https://img.shields.io/badge/${escapeLabel(name)}-${badge.color}?${params}`;
}

/** 배지 SVG 시작 태그에서 크기를 읽는다. 배지 글자 길이에 따라 폭이 달라서 미리 알 수 없다. */
export function parseSvgSize(svg: string): {width: number; height: number} | undefined {
  const tag = svg.match(/<svg\b[^>]*>/)?.[0];
  const width = Number(tag?.match(/\bwidth="([\d.]+)"/)?.[1]);
  const height = Number(tag?.match(/\bheight="([\d.]+)"/)?.[1]);
  return width > 0 && height > 0 ? {width: Math.ceil(width), height: Math.ceil(height)} : undefined;
}

const sizeCache = new Map<string, Promise<{width: number; height: number} | undefined>>();

/**
 * 빌드할 때 배지 크기를 한 번씩 받아 img에 width/height를 넣는다.
 * 크기를 모르면 이미지가 로딩되면서 레이아웃이 밀린다. 실패하면 크기 없이 그린다.
 */
export function fetchBadgeSize(url: string): Promise<{width: number; height: number} | undefined> {
  let size = sizeCache.get(url);
  if (!size) {
    size = fetch(url, {signal: AbortSignal.timeout(5000)})
      .then(async (res) => (res.ok ? parseSvgSize(await res.text()) : undefined))
      .catch((error: unknown) => {
        console.warn(`[badge] ${url} 크기를 가져오지 못했습니다: ${error instanceof Error ? error.message : String(error)}`);
        sizeCache.delete(url);
        return undefined;
      });
    sizeCache.set(url, size);
  }
  return size;
}
