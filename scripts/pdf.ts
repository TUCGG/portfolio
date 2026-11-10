// 빌드한 /print 페이지를 A4 PDF로 저장한다. `npm run build` 다음에 실행한다.
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

import {chromium} from '@playwright/test';
import {preview} from 'astro';

import {profile} from '../src/data/profile.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'dist/resume.pdf');

// E2E용 preview(4321)와 겹치지 않는 포트를 쓴다.
const server = await preview({root, logLevel: 'error', server: {port: 4329}});
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  // 사이트가 /portfolio 아래에 있으므로 preview도 같은 경로로 연다.
  const base = new URL(profile.siteUrl).pathname.replace(/\/$/, '');
  await page.goto(`http://localhost:${server.port}${base}/print/`, {waitUntil: 'networkidle'});
  // 글꼴이 로딩되기 전에 인쇄하면 PDF에 Pretendard가 빠진다.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.pdf({path: out, format: 'A4', printBackground: true, preferCSSPageSize: true});
  console.log(`PDF 생성: ${out}`);
} finally {
  await browser.close();
  await server.stop();
}
