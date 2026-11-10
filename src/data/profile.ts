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
  interests: {name: string; icon: 'bowling' | 'gym' | 'whisky'}[];
};

// 경력과 연락처는 이 파일에서만 고친다.
export const profile: Profile = {
  name: '이상현',
  headline: '이러닝 표준(cmi5, xAPI) 기반 학습 서비스를 만드는 프론트엔드 개발자',
  email: 'asoeg7315@naver.com',
  github: 'https://github.com/TUCGG',
  velog: 'https://velog.io/@lsh7315',
  velogHandle: 'lsh7315',
  siteUrl: 'https://tucgg.github.io/portfolio',
  about: [
    '버블콘 개발사업부 UX개발팀에서 이러닝 수업꾸러미 저작도구와 역량 관리 솔루션을 만듭니다. 화면을 중심으로 일하지만, 필요한 서버 API와 배포까지 직접 맡습니다.',
    '새 기술은 샘플 프로젝트로 직접 검증한 뒤 문서로 정리해 팀에 공유합니다. React 19.3, Playwright, TypeScript 7 같은 주제를 다뤄 왔습니다.'
  ],
  career: [
    {
      company: '버블콘',
      team: '개발사업부 UX개발팀',
      start: '2023-02',
      role: '웹 개발',
      achievements: [
        'cmi5 수업꾸러미 저작도구, 역량 관리 솔루션 v2, 회사 홈페이지를 초기 구축부터 개발',
        '역량 관리 솔루션 v1(CaSS 기반) 서버와 학습맵 뷰어의 유지보수와 기능 추가',
        'React, Playwright, TypeScript 신기술 검증 문서를 작성해 팀에 공유'
      ]
    }
  ],
  skills: [
    {group: '언어', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS']},
    {group: '프론트엔드', items: ['React', 'Next.js', 'TanStack Query', 'Zustand', 'Vite', 'Tailwind CSS']},
    {group: '서버', items: ['Node.js', 'Express', 'NestJS', 'Elasticsearch', 'MySQL', 'SAML']},
    {group: '테스트·품질', items: ['Vitest', 'Playwright', 'SonarQube', 'Semgrep']},
    {group: '이러닝 표준', items: ['SCORM', 'xAPI', 'cmi5', 'IMS CASE']}
  ],
  pinnedPosts: [
    {
      title: 'SCORM에서 xAPI, cmi5까지 - 이러닝 표준 정리와 코스 구조 XML 만들기',
      url: 'https://velog.io/@lsh7315/SCORM%EC%97%90%EC%84%9C-xAPI-cmi5%EA%B9%8C%EC%A7%80-%EC%9D%B4%EB%9F%AC%EB%8B%9D-%ED%91%9C%EC%A4%80-%EC%A0%95%EB%A6%AC%EC%99%80-%EC%BD%94%EC%8A%A4-%EA%B5%AC%EC%A1%B0-XML-%EB%A7%8C%EB%93%A4%EA%B8%B0'
    },
    {
      title: '기존 데이터를 깨지 않고 리뉴얼하기 - 역량 관리 솔루션 v2 설계 기록',
      url: 'https://velog.io/@lsh7315/%EA%B8%B0%EC%A1%B4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EA%B9%A8%EC%A7%80-%EC%95%8A%EA%B3%A0-%EB%A6%AC%EB%89%B4%EC%96%BC%ED%95%98%EA%B8%B0-%EC%97%AD%EB%9F%89-%EA%B4%80%EB%A6%AC-%EC%86%94%EB%A3%A8%EC%85%98-v2-%EC%84%A4%EA%B3%84-%EA%B8%B0%EB%A1%9D'
    },
    {
      title: 'React 19.3 신기능 정리 - View Transitions, Fragment Refs, browser(), Trusted Types',
      url: 'https://velog.io/@lsh7315/React-19.3-%EC%8B%A0%EA%B8%B0%EB%8A%A5-%EC%A0%95%EB%A6%AC-View-Transitions-Fragment-Refs-browser-Trusted-Types'
    }
  ],
  education: [],
  certificates: [],
  interests: [
    {name: '볼링', icon: 'bowling'},
    {name: '헬스', icon: 'gym'},
    {name: '위스키', icon: 'whisky'}
  ]
};
