import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';

import {profile} from './src/data/profile.ts';

export default defineConfig({
  site: profile.siteUrl,
  integrations: [mdx()]
});
