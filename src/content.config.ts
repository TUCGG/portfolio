import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/);

const projects = defineCollection({
  loader: glob({base: './src/content/projects', pattern: '*.mdx'}),
  schema: ({image}) =>
    z
      .object({
        title: z.string(),
        company: z.string(), // 회사명 또는 '개인'
        start: yearMonth,
        end: yearMonth.optional(),
        role: z.string(),
        stack: z.array(z.string()).min(1),
        summary: z.string().max(80),
        highlights: z.array(z.string()).min(1).max(3),
        order: z.number(),
        links: z
          .object({demo: z.url().optional(), github: z.url().optional(), post: z.url().optional()})
          .default({}),
        cover: image().optional(),
        coverAlt: z.string().optional()
      })
      .refine((d) => !d.cover || d.coverAlt, {message: 'cover가 있으면 coverAlt가 필요합니다', path: ['coverAlt']})
});

export const collections = {projects};
