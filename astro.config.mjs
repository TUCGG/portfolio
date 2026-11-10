import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';

import {profile} from './src/data/profile.ts';

// GitHub Pages 프로젝트 사이트: https://tucgg.github.io/portfolio/
const siteUrl = new URL(profile.siteUrl);

export default defineConfig({
  site: siteUrl.origin,
  base: siteUrl.pathname,
  integrations: [mdx()]
});
