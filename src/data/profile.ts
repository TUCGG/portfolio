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
    position: string;
    role: string;
    start: string; // YYYY-MM
    end?: string; // 없으면 재직 중
    summary: string;
    // title이 없는 묶음은 제목 없이 목록만 보여준다.
    details: {title?: string; items: string[]}[];
  }[];
  skills: {group: string; items: string[]}[];
  pinnedPosts: {title: string; url: string}[];
  education: {school: string; major?: string; start?: string; end: string; status: string}[];
  certificates: {name: string; issuer: string; date: string}[];
  interests: {name: string; icon: 'bowling' | 'gym' | 'whisky'}[];
};

// 경력과 연락처는 이 파일에서만 고친다. 연봉은 공개하지 않는다.
export const profile: Profile = {
  name: '이상현',
  headline: '이러닝 표준(cmi5, xAPI) 기반 학습 서비스를 만드는 프론트엔드 개발자',
  email: 'asoeg7315@naver.com',
  github: 'https://github.com/TUCGG',
  velog: 'https://velog.io/@lsh7315',
  velogHandle: 'lsh7315',
  siteUrl: 'https://tucgg.github.io/portfolio',
  about: [
    '웹디자인과 웹 퍼블리싱을 시작으로 JavaScript 기반 기능 구현, 교육 플랫폼 및 자사 솔루션 개발로 업무 범위를 넓혀온 프론트엔드 개발자입니다. React·TypeScript 기반의 서비스 개발을 중심으로 Node.js 기반 API 구현, 데이터베이스 연동, Docker 실행 환경 구성까지 수행하고 있습니다.',
    '교육 분야에서는 cmi5·xAPI·IMS CASE 규격을 활용해 콘텐츠 저작도구, 통합 학습 플레이어, 역량체계 관리 및 학습맵을 개발했습니다. 서비스의 업무 흐름과 데이터 구조를 이해하고, 레거시 마이그레이션과 서버 구조 개선, 테스트 보강을 통해 유지보수성을 높이는 작업을 수행했습니다.'
  ],
  career: [
    {
      company: '버블콘',
      team: 'UX개발팀',
      position: '대리',
      role: '프론트엔드 개발자',
      start: '2023-02',
      summary:
        '교육 플랫폼 및 자사 학습 솔루션의 개발·고도화를 담당했습니다. 학습맵, 콘텐츠 저작도구, 통합 학습 플레이어를 개발하고, Vue 2 기반 레거시 시스템의 React 19 마이그레이션과 Vite 기반 빌드 설정 모듈화를 수행했습니다.',
      details: [
        {
          title: '레거시 마이그레이션 및 개발환경 개선',
          items: [
            'Vue 2 기반 학습맵 편집기를 React 19·TypeScript 기반으로 전환',
            '기존 CaSS 데이터 구조와 연동 흐름을 고려하여 화면 및 API 연동 구조 재구성',
            'Vite 공통 설정과 프로젝트별 설정을 분리하고, 환경별 실행·빌드 및 번들 분할 구성',
            'React Query 기반 서버 데이터 관리와 Zustand 기반 화면 상태 관리 적용'
          ]
        },
        {
          title: '역량체계 관리 및 학습맵 개발',
          items: [
            '역량체계·분류체계의 생성·조회·편집 및 역량 간 관계 관리 기능 개발',
            'IMS CASE 규격의 역량체계 데이터 가져오기·내보내기 기능 구현',
            '역량 관계와 학습 진행률을 표현하는 트리 및 2D·3D 그래프 시각화',
            'Node.js·Express 기반 API 및 Elasticsearch 연동 기능 개발·유지보수'
          ]
        },
        {
          title: 'cmi5 기반 콘텐츠 저작도구 개발',
          items: [
            'LCMS 콘텐츠와 학습맵 성취기준을 연계하는 수업꾸러미 저작도구 개발',
            '학습 콘텐츠의 계층 구조, 학습 목표 및 실행 정보를 반영한 cmi5 XML 생성 기능 구현',
            '통합 학습 플레이어와 연동하여 제작한 학습 콘텐츠를 실행하는 흐름 구현',
            'Node.js 환경에서 SAML 2.0 기반 로그인·로그아웃 및 SSO 연동 구현'
          ]
        },
        {
          title: '통합 학습 플레이어 개발 및 고도화',
          items: [
            'React 기반 cmi5 통합 학습 플레이어 개발·유지보수',
            '학습 콘텐츠 구조에 따른 실행 및 순차 학습 이동 기능 구현·개선',
            '학습 진행·완료 상태 처리 및 cmi5·xAPI 기반 학습 기록 연동',
            '콘텐츠 미리보기와 실제 학습 상황에 따른 화면·동작 처리'
          ]
        },
        {
          title: '미디어·문서 플레이어 유지보수 및 기능 개선',
          items: [
            'Video.js 기반 학습용 동영상 플레이어 유지보수 및 기능 고도화',
            'PDF.js 기반 문서 뷰어 유지보수 및 학습 서비스 연동',
            '콘텐츠 재생·열람 과정의 사용자 상호작용과 학습 기록 연동 기능 개선'
          ]
        },
        {
          title: '자사 홈페이지 리뉴얼 및 배포 환경 구성',
          items: [
            'WordPress 기반 자사 홈페이지를 Next.js·NestJS 기반으로 리뉴얼',
            'MySQL 기반 데이터 연동 및 홈페이지 프론트엔드·백엔드 개발',
            'Docker·Docker Compose 기반 애플리케이션 컨테이너화 및 실행 환경 구성'
          ]
        }
      ]
    },
    {
      company: '티그린',
      team: '웹팀',
      position: '사원',
      role: '웹 퍼블리셔',
      start: '2020-12',
      end: '2023-02',
      summary:
        '쇼핑몰 기획전·이벤트 페이지의 디자인, 웹 퍼블리싱 및 프론트엔드 기능 구현을 담당했습니다. 기획자와 협업하며 시안 제작부터 페이지 구현, 데이터 연동까지 진행했습니다.',
      details: [
        {
          items: [
            '기획전·이벤트 페이지 제작: 기획자와 이벤트 구성 협의, Photoshop을 활용한 페이지 시안 및 레이아웃 디자인',
            '웹 퍼블리싱: PHP 기반 쇼핑몰 솔루션의 웹 에디터 환경에서 상품·기획전 페이지 구현',
            '프론트엔드 기능 구현: Vanilla JavaScript를 활용한 페이지 렌더링, 이벤트 처리 및 데이터 연동',
            '인터랙티브 페이지 제작: WOW.js, ScrollMagic을 활용한 스크롤 애니메이션 기획·디자인 및 구현',
            '쇼핑몰 운영 디자인: 모델 이미지 보정 및 상품 등록 업무 수행'
          ]
        }
      ]
    },
    {
      company: '썸타임',
      team: '디자인팀',
      position: '사원',
      role: '웹 디자이너',
      start: '2019-04',
      end: '2020-11',
      summary:
        '바이모노 쇼핑몰의 웹·모바일 화면 운영 및 개선을 담당했습니다. 홈페이지 리뉴얼 참여와 기능 보완을 수행하고, 사내 콘텐츠 편집을 지원하는 도구를 제작했습니다.',
      details: [
        {
          items: [
            '웹·모바일 유지보수: 쇼핑몰 화면 오류 수정 및 CSS·JavaScript 기반 기능 추가',
            '홈페이지 리뉴얼 참여(2019.08 – 2020.04): 외부 제작업체 조사 및 견적서 작성 업무 수행',
            '리뉴얼 후 기능 보완: 기존 운영 기능 복원·변경 및 추가 기능 구현',
            '업무 지원 도구 제작: HTML 사용이 익숙하지 않은 직원의 콘텐츠 편집을 지원하는 Excel 기반 HTML 편집기 제작',
            '콘텐츠 제작 및 외부 협업: 상품 상세페이지 제작, 마케팅·앱 프로모션 업체와의 협업 담당',
            '사내 IT 환경 관리: 사내 PC·네트워크 관리, 서버 저장장치 증설 및 디자인팀 PC 업그레이드'
          ]
        }
      ]
    },
    {
      company: '스타일헬퍼',
      team: '웹디자인',
      position: '임원',
      role: '웹 디자이너',
      start: '2016-04',
      end: '2017-02',
      summary:
        '지인과 함께 쇼핑몰 사업을 시작하여 홈페이지 구축과 웹디자인을 담당했습니다. MD·CS 업무를 병행하며 쇼핑몰 운영 전반에 참여했습니다.',
      details: [
        {
          items: [
            '쇼핑몰 초기 구축: 홈페이지 구성과 세부 화면을 점검하며 쇼핑몰 제작',
            '웹디자인 및 운영: 쇼핑몰 디자인 업무와 MD·CS 업무 병행',
            '사업 성과: 공동 운영 기간 중 2016년 10월 월 매출 1억 1천만 원 달성'
          ]
        }
      ]
    },
    {
      company: '바이슬림',
      team: '웹디자인',
      position: '사원',
      role: '웹 디자이너',
      start: '2015-12',
      end: '2016-04',
      summary: '특성화고 재학 중 입사하여 쇼핑몰 이미지 보정 및 웹디자인 실무를 수행했습니다.',
      details: [
        {
          items: [
            '상품 이미지 제작: 쇼핑몰에 사용되는 인물·상품 이미지 보정',
            '쇼핑몰 실무 역량 습득: HTML 및 카페24 기반 쇼핑몰 운영에 필요한 기초 지식 습득'
          ]
        }
      ]
    }
  ],
  skills: [
    {group: '프론트엔드', items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS']},
    {group: '상태 관리·빌드', items: ['React Query', 'Zustand', 'Vite']},
    {group: '테스트', items: ['Vitest', 'Playwright', 'Storybook']},
    {group: '백엔드·데이터', items: ['Node.js', 'Express', 'NestJS', 'MySQL', 'Elasticsearch']},
    {group: '실행 환경', items: ['Docker', 'Docker Compose', 'Kubernetes']},
    {group: '교육 규격·인증', items: ['cmi5', 'xAPI', 'IMS CASE', 'SAML 2.0']},
    {group: '미디어·디자인', items: ['Video.js', 'PDF.js', 'Photoshop']},
    {group: 'AI 활용', items: ['AI 하네스 엔지니어링', 'Paperclip 오케스트레이션']}
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
  education: [
    {school: '한양사이버대학교', major: '컴퓨터공학과', start: '2025-02', end: '2029-02', status: '재학 중'},
    {school: '한세사이버보안고등학교', end: '2016', status: '졸업'}
  ],
  certificates: [],
  interests: [
    {name: '볼링', icon: 'bowling'},
    {name: '헬스', icon: 'gym'},
    {name: '위스키', icon: 'whisky'}
  ]
};
