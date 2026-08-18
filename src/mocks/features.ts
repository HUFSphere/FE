// 기능 목록 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요
import type { Status } from '../components/ui/StatusBadge/Statusbadge'
import type { SourceKind } from './featuredetail'

export type FeatureListItem = {
  id: string
  source: SourceKind
  title: { ko: string; en: string }
  meta: { ko: string; en: string }
  status: Status
}

export const mockFeatureList: FeatureListItem[] = [
  {
    id: 'onboarding-repo-doc',
    source: 'github',
    title: { ko: 'Github: feat/온보딩-레포-연결-흐름 개선', en: 'Github: feat/onboarding-repo-link-flow' },
    meta: { ko: 'PR #24 — 리뷰어 2명 대기 중', en: 'PR #24 — waiting on 2 reviewers' },
    status: 'review',
  },
  {
    id: 'checkout-wireframe',
    source: 'figma',
    title: { ko: 'Figma: 결제 플로우 와이어프레임', en: 'Figma: Checkout flow wireframe' },
    meta: { ko: '결제 확인 페이지 3개 프레임 수정', en: '3 frames updated on the confirmation page' },
    status: 'todo',
  },
  {
    id: 'onboarding-guide',
    source: 'notion',
    title: { ko: 'Notion: 신규 팀원 온보딩 가이드', en: 'Notion: New teammate onboarding guide' },
    meta: { ko: 'Step 1~5 작성 완료, 스크린샷 추가 필요', en: 'Steps 1–5 written, screenshots pending' },
    status: 'progress',
  },
  {
    id: 'onboarding-repo-doc-2',
    source: 'github',
    title: { ko: 'Github: feat/온보딩-레포-연결-흐름 개선', en: 'Github: feat/onboarding-repo-link-flow' },
    meta: { ko: 'PR #24 — 리뷰어 2명 대기 중', en: 'PR #24 — waiting on 2 reviewers' },
    status: 'review',
  },
  {
    id: 'checkout-wireframe-2',
    source: 'figma',
    title: { ko: 'Figma: 결제 플로우 와이어프레임', en: 'Figma: Checkout flow wireframe' },
    meta: { ko: '결제 확인 페이지 3개 프레임 수정', en: '3 frames updated on the confirmation page' },
    status: 'todo',
  },
  {
    id: 'onboarding-guide-2',
    source: 'notion',
    title: { ko: 'Notion: 신규 팀원 온보딩 가이드', en: 'Notion: New teammate onboarding guide' },
    meta: { ko: 'Step 1~5 작성 완료, 스크린샷 추가 필요', en: 'Steps 1–5 written, screenshots pending' },
    status: 'progress',
  },
]