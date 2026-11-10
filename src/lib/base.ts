/**
 * 사이트 안 주소에 base 경로(/portfolio)를 붙인다. GitHub Pages 프로젝트 사이트라서 필요하다.
 * import.meta.env를 쓰므로 Astro 컴포넌트에서만 import한다.
 */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
