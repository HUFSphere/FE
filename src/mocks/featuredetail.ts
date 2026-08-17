// 기능 상세 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요
import type { Status } from '../components/ui/StatusBadge/Statusbadge'

export type SourceKind = 'github' | 'figma' | 'notion'

export type LinkedItem = {
  id: string
  source: SourceKind
  title: { ko: string; en: string }
  meta: { ko: string; en: string }
  url: string
}

export type FeatureDetail = {
  id: string
  source: SourceKind
  title: { ko: string; en: string }
  progress: number
  status: Status
  summary: { ko: string; en: string }
  linked: LinkedItem[]
  evidence: { ko: string; en: string }
}

export const mockFeatureDetail: FeatureDetail = {
  id: 'onboarding-repo-doc',
  source: 'github',
  title: {
    ko: 'Github: feat/온보딩-레포-연결-흐름 개선',
    en: 'Github: feat/onboarding-repo-link-flow',
  },
  progress: 58,
  status: 'review',
  summary: {
    ko: 'Github 저장소와 온보딩 문서를 자동으로 연결해, 신규 팀원이 관련 PR과 이슈를 한 화면에서 확인할 수 있도록 개선했습니다.\n기존에는 레포 탐색과 문서 확인을 따로 해야 했지만, 이번 변경으로 온보딩 완료 시간이 단축될 것으로 예상됩니다.',
    en: 'Repositories and onboarding docs are now linked automatically, so new teammates can see related PRs and issues in one place.\nPreviously they had to browse the repo and the docs separately; this change should shorten onboarding time.',
  },
  linked: [
    {
      id: 'pr-142',
      source: 'github',
      title: { ko: '[Github] PR #142 — 사용자 인증 모듈 리팩터링', en: '[Github] PR #142 — Refactor auth module' },
      meta: { ko: '리뷰 1개 승인 · 2026-08-10', en: '1 review approved · 2026-08-10' },
      url: '#',
    },
    {
      id: 'figma-frame',
      source: 'figma',
      title: { ko: '[Figma] “온보딩 흐름” 프레임 수정됨', en: '[Figma] "Onboarding flow" frame updated' },
      meta: { ko: '2026-08-09', en: '2026-08-09' },
      url: '#',
    },
    {
      id: 'notion-doc',
      source: 'notion',
      title: { ko: '[Notion] 온보딩 가이드 문서에 관련 섹션 추가됨', en: '[Notion] Section added to the onboarding guide' },
      meta: { ko: '2026-08-06', en: '2026-08-06' },
      url: '#',
    },
    {
      id: 'pr-142-2',
      source: 'github',
      title: { ko: '[Github] PR #142 — 사용자 인증 모듈 리팩터링', en: '[Github] PR #142 — Refactor auth module' },
      meta: { ko: '리뷰 1개 승인 · 2026-08-10', en: '1 review approved · 2026-08-10' },
      url: '#',
    },
  ],
  evidence: {
    ko: 'Figma 프레임명 (“온보딩 흐름”)과 Github 브랜치명(feat/온보딩-레포-연결-흐름) 일치 확인됨\nNotion 문서 제목에 동일 이슈 번호 (#98) 언급됨',
    en: 'The Figma frame name ("Onboarding flow") matches the Github branch (feat/onboarding-repo-link-flow).\nThe Notion document title references the same issue number (#98).',
  },
}