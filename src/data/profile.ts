export type Profile = {
  name: string;
  headline: string;
  email: string;
  github: string;
  velog: string;
  velogHandle: string;
  siteUrl: string;
  about: string[];
  career: {
    company: string;
    team: string;
    start: string; // YYYY-MM
    end?: string; // 없으면 재직 중
    role: string;
    achievements: string[];
  }[];
  skills: {group: string; items: string[]}[];
  pinnedPosts: {title: string; url: string}[];
  education: {school: string; major: string; start: string; end?: string; status: string}[];
  certificates: {name: string; issuer: string; date: string}[];
};

// 경력과 연락처는 이 파일에서만 고친다.
export const profile: Profile = {
  name: '이상현',
  headline: '이러닝 표준(cmi5, xAPI) 기반 학습 서비스를 만드는 프론트엔드 개발자',
  email: 'asoeg7315@naver.com',
  github: 'https://github.com/TUCGG',
  velog: 'https://velog.io/@lsh7315',
  velogHandle: 'lsh7315',
  siteUrl: 'https://tucgg.github.io',
  about: [
    '버블콘 개발사업부 UX개발팀에서 이러닝 코스웨어와 역량 관리 솔루션의 프론트엔드를 개발합니다.',
    '새 기술은 샘플 프로젝트로 직접 검증한 뒤 문서로 정리해 팀에 공유합니다. React 19.3, Playwright, TypeScript 7 같은 주제를 다뤄 왔습니다.'
  ],
  career: [
    {
      company: '버블콘',
      team: '개발사업부 UX개발팀',
      start: '2023-02',
      role: '프론트엔드 개발',
      achievements: [
        '이러닝 코스웨어, 역량 관리 솔루션, 회사 홈페이지의 프론트엔드 개발',
        'React, Playwright, TypeScript 신기술 검증 문서를 작성해 팀에 공유'
      ]
    }
  ],
  skills: [
    {group: '언어', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS']},
    {group: '프레임워크', items: ['React', 'TanStack Query', 'Vite', 'Astro']},
    {group: '테스트', items: ['Vitest', 'Playwright']},
    {group: '이러닝 표준', items: ['SCORM', 'xAPI', 'cmi5']}
  ],
  pinnedPosts: [],
  education: [],
  certificates: []
};
