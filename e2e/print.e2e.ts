import {expect, test} from '@playwright/test';

test('/print는 검색 제외 표시가 있다', async ({page}) => {
  const res = await page.goto('/print/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('/resume.pdf의 메일과 프로젝트 주소는 누를 수 있는 링크다', async ({request}) => {
  const pdf = (await (await request.get('/resume.pdf')).body()).toString('latin1');
  expect(pdf).toMatch(/\/URI\s*\(mailto:/);
  expect(pdf).toMatch(/\/URI\s*\(https:\/\/tucgg\.github\.io\/projects\//);
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
