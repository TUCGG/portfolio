import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  use: {baseURL: 'http://localhost:4321'},
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  // build는 하지 않는다(build가 dist/resume.pdf를 지운다). --ignore-lock: Astro 7이 에이전트 환경에서 preview를 백그라운드로 띄우지 않게 한다.
  webServer: {command: 'npx astro preview --ignore-lock', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI}
});
