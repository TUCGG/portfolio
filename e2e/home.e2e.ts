import {expect, test} from '@playwright/test';

import {profile} from '../src/data/profile.ts';
import {formatPeriod} from '../src/lib/period.ts';

test('첫 화면에 이름, 한 줄 소개, PDF 링크가 보인다', async ({page}) => {
  await page.goto('/');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', {level: 1})).toHaveText(profile.name);
  await expect(main.getByText(profile.headline)).toBeVisible();
  await expect(main.getByRole('link', {name: 'PDF 다운로드'})).toHaveAttribute('href', '/resume.pdf');
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

test('메뉴 링크마다 같은 id의 섹션이 하나씩 있다', async ({page}) => {
  await page.goto('/');
  const hrefs = await page
    .getByRole('navigation', {name: '섹션'})
    .getByRole('link')
    .evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) await expect(page.locator(href!)).toHaveCount(1);
});

test('메뉴에서 경력을 누르면 그 링크가 현재 위치로 표시된다', async ({page}) => {
  await page.goto('/');
  const link = page.getByRole('navigation', {name: '섹션'}).getByRole('link', {name: '경력'});
  await link.click();
  await expect(link).toHaveAttribute('aria-current', 'true');
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
