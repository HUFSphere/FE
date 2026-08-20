# LinkBoard (HUFSphere-FE)

GitHub / Figma / Notion에 흩어진 팀 기록을 하나로 모아 보여주는 LinkBoard 서비스의 프론트엔드입니다.

**배포 주소**: https://hufsphere-linkboard.vercel.app  

## 기술 스택

- React + Vite + TypeScript
- Tailwind CSS v4
- react-router-dom (중첩 라우트로 `AppLayout` 적용)
- react-i18next (한국어/영어 전환)
- framer-motion (사이드바 메뉴 슬라이딩 애니메이션)
- date-fns (상대 시간 표시)
- 백엔드 API: 아직 미연동, 현재는 mock 데이터 사용

## 폴더 구조

```
src/
├── pages/
│   ├── OnBoarding/     # 랜딩, 로그인, 회원가입, 언어/역할 선택, 초대코드, 프로젝트 연결
│   └── Main/            # 프로젝트 지도, 현황, 기능목록/상세, Q&A, 팀설정, 환경설정
│
├── components/
│   ├── layout/           # 여러 페이지에서 재사용되는 컴포넌트
│   │   ├── AppLayout.tsx     # Sidebar + Header + <Outlet />
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── LanguageToggle.tsx
│   │
│   └── ui/               # 여러 페이지에서 재사용 가능한 공통 UI 부품
│       ├── icons/            # 모든 아이콘 (BellIcon, LogoutIcon, SidebarIcons, Avatar 등)
│       └── decor/            # 사이드바 등에 쓰는 장식 일러스트 (SidebarDecor 등)
│
├── mocks/                # 더미 데이터. 나중에 API 받아와 교체 예정
│   └── user.ts
│
├── locales/               # i18n 번역 파일
│   ├── ko.json
│   └── en.json
│
├── i18n.ts
└── router.tsx
```

## 디자인 토큰 (`index.css`)

색은 항상 아래 이름으로만 씁니다. hex 값을 코드에 직접 쓰지 않습니다.

| 이름 | hex |
|---|---|
| `milk` | `#FBF7F4` |
| `oat` | `#E5DED2` |
| `almond-milk` | `#D2C9BB` |
| `taupe` | `#A39382` |
| `mocha` | `#685D54` |
| `dark-lava` | `#493E37` |
| `charcoal` | `#232323` |

사용 예: `bg-oat`, `text-mocha`, `border-taupe`

## 다국어 (i18n)

- UI 고정 텍스트(메뉴명, 버튼명 등)는 하드코딩하지 않고 `locales/ko.json`, `locales/en.json`에 키로 등록 후 `useTranslation()`의 `t('키')`로 사용합니다.
- 실제 데이터(사용자 이름, 프로젝트명 등)는 `{ ko: '...', en: '...' }` 형태로 데이터 자체가 언어별 값을 가지도록 구성합니다.

## Mock 데이터

- 백엔드 API 스펙이 아직 없는 부분은 `src/mocks/`에 더미 데이터로 채워두고 컴포넌트에서 import해 씁니다.
- 나중에 API가 정해지면 이 파일을 실제 fetch 훅으로 교체합니다. 컴포넌트 코드는 최대한 안 건드리도록 데이터 형태를 미리 맞춰둡니다.

---

## Git 규칙

### 브랜치 구조

- `main`: 배포용, 항상 안정적인 상태만 유지
- `develop`: 개발 중인 최신 상태, 기능 브랜치들이 여기로 모임
- `feat/기능명`: 각자 작업하는 기능 브랜치, **`develop`에서 분기**

### 작업 순서

1. 작업 시작 전 `develop`을 최신 상태로 받아옵니다.
```
git checkout develop
git pull origin develop
```
2. `develop`에서 기능 브랜치를 새로 만듭니다.
```
git checkout -b feat/기능명
```
3. 작업 후 커밋 → 푸시 → **`develop`으로 PR** 생성

### 브랜치 이름
```
feat/기능명
```
### 커밋 메시지

한글로 자유롭게 쓰되, 아래 태그를 앞에 붙입니다.

```
[태그] 설명
```

| 태그 | 용도 |
|---|---|
| `[기능]` | 새 기능/페이지 추가 |
| `[수정]` | 기존 기능 동작 변경/버그 수정 |
| `[스타일]` | 동작 변화 없는 디자인/CSS 수정 |
| `[문서]` | README 등 문서 변경 |
| `[설정]` | 패키지 설치, 설정 파일 변경 |
| `[리팩터]` | 동작 변화 없는 코드 구조 개선 |

예: `[기능] 기능 목록 페이지 필터 UI 추가`, `[수정] UI 언어 토글 버튼 잘림 버그 해결`

### PR / 머지

- `develop`에 직접 푸시하지 않습니다.
- 기능 브랜치에서 작업 후 PR을 올리고, **리뷰 승인 후 팀장이 머지**합니다.
- `develop → main`은 배포 시점에 팀장이 직접 병합합니다 (PR 없이).
