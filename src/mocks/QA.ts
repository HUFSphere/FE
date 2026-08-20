// 프로젝트 Q&A 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요
import type { SourceKind } from './featuredetail'

/* 질문 범위 */
export type ScopeChip = {
  id: string
  label: { ko: string; en: string }
}

export const mockScopes: ScopeChip[] = [
  { id: 'figma-a', label: { ko: '피그마: 기능 A', en: 'Figma: Feature A' } },
  { id: 'github-b', label: { ko: '깃허브: 기능 B', en: 'Github: Feature B' } },
]

/* 답변 근거 */
export type Evidence = {
  id: string
  label: { ko: string; en: string }
  url: string
}

export const mockAnswer = {
  text: {
    ko: '',
    en: '',
  },
  evidence: [
    { id: 'pr-142', label: { ko: 'PR #142 — 인증 모듈 분리', en: 'PR #142 — Split auth module' }, url: '#' },
    { id: 'figma-comment', label: { ko: 'Figma: 온보딩 흐름 코멘트', en: 'Figma: Onboarding flow comment' }, url: '#' },
  ] as Evidence[],
}

/* 팀 관행 분석 */
export type Practice = {
  id: string
  text: { ko: string; en: string }
  source: SourceKind
  url: string
}

export const mockPractices: Practice[] = [
  {
    id: 'reviewers',
    text: {
      ko: '최근 PR 12건 중 10건이 리뷰어 2명의\n승인을 받은 뒤 머지되었습니다.',
      en: '10 of the last 12 PRs were merged\nafter two reviewer approvals.',
    },
    source: 'github',
    url: '#',
  },
  {
    id: 'branch-naming',
    text: {
      ko: '대부분의 기능 개발 브랜치가 feat/ 뒤에\n기능명을 붙이는 방식으로 명명되었습니다.',
      en: 'Most feature branches are named\nfeat/ followed by the feature name.',
    },
    source: 'github',
    url: '#',
  },
  {
    id: 'figma-first',
    text: {
      ko: 'Github PR이 열리기 평균 2~3일 전에 관련 Figma\n프레임이 먼저 업데이트되는 패턴이 보입니다.',
      en: 'Related Figma frames are usually updated\n2–3 days before the Github PR opens.',
    },
    source: 'figma',
    url: '#',
  },
]

/* 후속 질문 제안 */
export const mockSuggestions = [
  { id: 's1', label: { ko: '최근 가장 활발하게 논의된 기능은 무엇인가요?', en: 'Which feature has been discussed most recently?' } },
  { id: 's2', label: { ko: '현재 리뷰가 오래 지연되고 있는 PR이 있나요?', en: 'Are any PRs stuck in review?' } },
  { id: 's3', label: { ko: '이번 주에 완료된 기능은 몇 개인가요?', en: 'How many features were completed this week?' } },
  { id: 's4', label: { ko: '요즘 팀에서 가장 활발하게 다루는 이슈는 뭔가요?', en: 'What issues is the team most active on lately?' } },
]