import {expect, test} from '@playwright/test';

import {profile} from '../src/data/profile.ts';
import {formatPeriod} from '../src/lib/period.ts';

test('첫 화면 제목은 한 줄 소개이고 이름과 PDF 링크가 보인다', async ({page}) => {
  await page.goto('./');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', {level: 1})).toHaveText('꾸준히 배우고, 배운 것을 실무로 연결하는 프론트엔드 개발자');
  await expect(main.getByText(profile.name, {exact: true})).toBeVisible();
  await expect(main.getByRole('link', {name: 'PDF 다운로드'})).toHaveAttribute('href', '/portfolio/resume.pdf');
});

test('경력에 재직 기간이 보인다', async ({page}) => {
  await page.goto('./');
  const c = profile.career[0];
  await expect(page.getByText(formatPeriod(c.start, c.end))).toBeVisible();
});

test('경력에 회사가 모두 보이고 총 경력이 보인다', async ({page}) => {
  await page.goto('./');
  const career = page.locator('#career');
  for (const c of profile.career) await expect(career.getByRole('heading', {name: c.company, exact: true})).toBeVisible();
  await expect(career.getByText(/^총 \d+년( \d+개월)?$/)).toBeVisible();
});

test('학력 섹션에 학교가 모두 보인다', async ({page}) => {
  await page.goto('./');
  const education = page.locator('#education');
  expect(profile.education.length).toBeGreaterThan(0);
  for (const e of profile.education) await expect(education.getByText(e.school, {exact: true})).toBeVisible();
});

test('연봉 정보는 공개하지 않는다', async ({page}) => {
  await page.goto('./');
  await expect(page.getByText(/연봉|만원/)).toHaveCount(0);
});

test('375px 너비에서 가로 스크롤이 없다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 800});
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('메뉴 링크마다 같은 id의 섹션이 하나씩 있다', async ({page}) => {
  await page.goto('./');
  const hrefs = await page
    .getByRole('navigation', {name: '섹션'})
    .getByRole('link')
    .evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) await expect(page.locator(href!)).toHaveCount(1);
});

test('메뉴에서 경력을 누르면 그 링크가 현재 위치로 표시된다', async ({page}) => {
  await page.goto('./');
  const link = page.getByRole('navigation', {name: '섹션'}).getByRole('link', {name: '경력'});
  await link.click();
  await expect(link).toHaveAttribute('aria-current', 'true');
});

test('Tab으로 이동하면 포커스 표시가 보인다', async ({page}) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

test('기술 글 섹션에 대표 글이 보인다', async ({page}) => {
  await page.goto('./');
  for (const p of profile.pinnedPosts) {
    await expect(page.getByRole('link', {name: p.title})).toHaveAttribute('href', p.url);
  }
});

test('프로필 사진이 데스크톱과 모바일에서 보인다', async ({page}) => {
  const photo = page.getByRole('img', {name: `${profile.name} 프로필 사진`});
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto('./');
  await expect(photo).toBeVisible();
  await page.setViewportSize({width: 375, height: 812});
  await expect(photo).toBeVisible();
});

test('기술 스택은 기술 이름을 대체 텍스트로 가진 shields.io 배지다', async ({page}) => {
  await page.goto('./');
  const badge = page.locator('#skills').getByRole('img', {name: 'TypeScript', exact: true});
  await expect(badge).toHaveAttribute('src', /^https:\/\/img\.shields\.io\/badge\/TypeScript-/);
});

test('취미 섹션에 취미가 모두 보이고 온라인 게임은 없다', async ({page}) => {
  await page.goto('./');
  const section = page.locator('#interests');
  for (const i of profile.interests) await expect(section.getByText(i.name, {exact: true})).toBeVisible();
  await expect(section.getByText('온라인 게임')).toHaveCount(0);
});

test('취미 사진은 처음에 볼링이고 버튼을 누르면 바뀐다', async ({page}) => {
  await page.goto('./');
  const section = page.locator('#interests');
  const bowling = section.getByRole('button', {name: '볼링'});
  const gym = section.getByRole('button', {name: '헬스'});
  await expect(bowling).toHaveAttribute('aria-pressed', 'true');
  await expect(section.getByRole('img', {name: /볼링/})).toBeVisible();
  await expect(section.getByRole('img', {name: /헬스/})).toBeHidden();

  await gym.click();
  await expect(gym).toHaveAttribute('aria-pressed', 'true');
  await expect(bowling).toHaveAttribute('aria-pressed', 'false');
  await expect(section.getByRole('img', {name: /헬스/})).toBeVisible();
  await expect(section.getByRole('img', {name: /볼링/})).toBeHidden();
});

test('큰 화면에서 처음 열거나 소개를 누르면 소개가 현재 위치다', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 1300});
  await page.goto('./');
  const nav = page.getByRole('navigation', {name: '섹션'});
  const about = nav.getByRole('link', {name: '소개'});
  await expect(about).toHaveAttribute('aria-current', 'true');
  await nav.getByRole('link', {name: '경력'}).click();
  await about.click();
  await page.waitForTimeout(1000); // 부드러운 스크롤이 끝난 뒤에도 유지되는지 본다
  await expect(about).toHaveAttribute('aria-current', 'true');
});

test('메뉴를 누른 뒤 스크롤바 등으로 직접 내리면 현재 위치가 따라간다', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto('./');
  const nav = page.getByRole('navigation', {name: '섹션'});
  await nav.getByRole('link', {name: '경력'}).click();
  await page.waitForTimeout(1000);
  // 휠 이벤트 없이 스크롤 위치만 바꾼다(스크롤바 끌기와 같다).
  await page.evaluate(() => window.scrollTo({top: document.getElementById('posts')!.offsetTop, behavior: 'instant'}));
  await expect(nav.getByRole('link', {name: '기술 글'})).toHaveAttribute('aria-current', 'true');
});

test('모바일에서 #contact로 열면 연락처가 현재 위치다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto('./#contact');
  // 배지 이미지가 모두 로딩되어 레이아웃이 자리 잡은 뒤에도 유지되는지 본다.
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
  const nav = page.getByRole('navigation', {name: '섹션'});
  await expect(nav.getByRole('link', {name: '연락처'})).toHaveAttribute('aria-current', 'true');
});

test('모바일 메뉴 링크의 포커스 표시가 잘리지 않을 여백이 있다', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto('./');
  const nav = page.getByRole('navigation', {name: '섹션'});
  const list = (await nav.locator('ul').boundingBox())!;
  const link = (await nav.getByRole('link', {name: '경력'}).boundingBox())!;
  expect(link.y - list.y).toBeGreaterThanOrEqual(4);
  expect(list.y + list.height - (link.y + link.height)).toBeGreaterThanOrEqual(4);
});

test('없는 주소는 404 페이지를 보여준다', async ({page}) => {
  const res = await page.goto('no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('link', {name: '첫 화면으로'})).toHaveAttribute('href', '/portfolio/');
});
