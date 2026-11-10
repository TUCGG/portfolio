import {expect, test} from '@playwright/test';

test('첫 프로젝트 항목을 누르면 같은 제목의 상세 페이지로 간다', async ({page}) => {
  await page.goto('/');
  const entry = page.getByRole('article').first();
  const title = (await entry.getByRole('heading').innerText()).trim();
  await entry.getByRole('link', {name: title}).click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText(title);
});

test('경력의 프로젝트마다 이름이 있는 구조도가 있다', async ({page}) => {
  await page.goto('/');
  const entries = page.locator('#career article');
  const count = await entries.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const diagram = entries.nth(i).getByRole('region', {name: '구조도'}).getByRole('img');
    await expect(diagram).toHaveAccessibleName(/\S/);
  }
});

test('상세 페이지는 375px 너비에서 가로 스크롤이 없다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 800});
  const res = await page.goto('/projects/cmi5-courseware-v2/');
  expect(res?.status()).toBe(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
