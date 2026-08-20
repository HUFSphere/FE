// 프로젝트 지도 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요
import type { SourceKind } from './featuredetail'
import type { Status } from '../components/ui/StatusBadge/Statusbadge'

export type MapNode = {
  id: string
  label: { ko: string; en: string }
  status: Status
  /* 강조 톤 4가지 */
  tone: 'root' | 'dark' | 'light' | 'muted'
}

export type MapEdge = {
  id: string
  source: string
  target: string
}

export const mockMapNodes: MapNode[] = [
  { id: 'root', label: { ko: '프로젝트 전체', en: 'Whole project' }, status: 'progress', tone: 'root' },
  { id: 'onboarding', label: { ko: '온보딩 레포·문서 연결 흐름', en: 'Onboarding repo-doc link' }, status: 'review', tone: 'light' },
  { id: 'auth', label: { ko: '로그인·회원가입', en: 'Sign in / Sign up' }, status: 'progress', tone: 'dark' },
  { id: 'checkout', label: { ko: '장바구니·결제', en: 'Cart & checkout' }, status: 'blocked', tone: 'muted' },
  { id: 'guide', label: { ko: '온보딩 가이드 문서', en: 'Onboarding guide' }, status: 'done', tone: 'light' },
  { id: 'frame', label: { ko: '“온보딩 흐름” 프레임', en: '"Onboarding flow" frame' }, status: 'done', tone: 'light' },
  { id: 'session', label: { ko: '세션 만료 처리', en: 'Session expiry' }, status: 'progress', tone: 'dark' },
]

export const mockMapEdges: MapEdge[] = [
  { id: 'e-root-onboarding', source: 'root', target: 'onboarding' },
  { id: 'e-root-auth', source: 'root', target: 'auth' },
  { id: 'e-root-checkout', source: 'root', target: 'checkout' },
  { id: 'e-onboarding-guide', source: 'onboarding', target: 'guide' },
  { id: 'e-onboarding-frame', source: 'onboarding', target: 'frame' },
  { id: 'e-auth-session', source: 'auth', target: 'session' },
]

/* 노드를 선택했을 때 우측 패널에 표시할 요약 */
export type MapDetail = {
  source: SourceKind
  title: { ko: string; en: string }
  progress: number
  status: Status
  summary: { ko: string; en: string }
  counts: { source: SourceKind; count: number }[]
  items: {
    id: string
    source: SourceKind
    title: { ko: string; en: string }
    date: string
  }[]
}

export const mockMapDetail: Record<string, MapDetail> = {
  onboarding: {
    source: 'github',
    title: { ko: '온보딩 레포·문서 연결 흐름', en: 'Onboarding repo-doc link' },
    progress: 58,
    status: 'review',
    summary: {
      ko: '레포와 온보딩 문서를 자동 연결해, 신규 팀원이 관련 PR과 이슈를 한 화면에서 확인할 수 있게 하는 기능입니다.',
      en: 'Links repositories and onboarding docs automatically so new teammates see related PRs and issues in one place.',
    },
    counts: [
      { source: 'github', count: 2 },
      { source: 'notion', count: 1 },
      { source: 'figma', count: 1 },
    ],
    items: [
      { id: 'i1', source: 'github', title: { ko: 'PR #142 사용자 인증 모듈 리팩터링', en: 'PR #142 Refactor auth module' }, date: '08-10' },
      { id: 'i2', source: 'notion', title: { ko: '온보딩 가이드 문서 섹션 추가', en: 'Onboarding guide section added' }, date: '08-06' },
      { id: 'i3', source: 'figma', title: { ko: '“온보팅 흐름” 프레임 수정', en: '"Onboarding flow" frame updated' }, date: '08-09' },
      { id: 'i4', source: 'github', title: { ko: 'PR #142 사용자 인증 모듈 리팩터링', en: 'PR #142 Refactor auth module' }, date: '08-10' },
    ],
  },
}
