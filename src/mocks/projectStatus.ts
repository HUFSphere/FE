// 프로젝트 현황 페이지 목업 데이터

export type LocalizedText = { ko: string; en: string }

/* 막대그래프 */
export type ProjectFeature = {
  id: string
  label: LocalizedText
  value: number // 0~100
}

export const mockFeatures: ProjectFeature[] = [
  { id: 'A', label: { ko: '기능 A', en: 'Feature A' }, value: 48 },
  { id: 'B', label: { ko: '기능 B', en: 'Feature B' }, value: 85 },
  { id: 'C', label: { ko: '기능 C', en: 'Feature C' }, value: 24 },
]

/* 소스(Figma/Github/Notion) 상세 */
export type SourceKey = 'figma' | 'github' | 'notion'
export type SourceStatus = 'notStarted' | 'inProgress' | 'done'

export type SourceIssue = {
  title: LocalizedText
  description: LocalizedText
}

export type SourceDetail = {
  label: string
  kicker: LocalizedText
  status: SourceStatus
  progress: number // 0~100
  issues: SourceIssue[]
}

export const mockSources: Record<SourceKey, SourceDetail> = {
  figma: {
    label: 'Figma',
    kicker: { ko: '최근 수정된 피그마 페이지명', en: 'Recently edited Figma page name' },
    status: 'notStarted',
    progress: 50,
    issues: [
      {
        title: { ko: '이슈 설명 텍스트 제목 1', en: 'Issue description title 1' },
        description: {
          ko: '이슈를 요약된 내용으로 간략하게 설명하는 텍스트 1',
          en: 'A brief summary description of the issue, text 1',
        },
      },
      {
        title: { ko: '이슈 설명 텍스트 제목 2', en: 'Issue description title 2' },
        description: {
          ko: '이슈를 요약된 내용으로 간략하게 설명하는 텍스트 2\n두 줄로 길어지는 경우도 가능',
          en: 'A brief summary description of the issue, text 2\nCan also span two lines',
        },
      },
    ],
  },
  github: {
    label: 'Github',
    kicker: { ko: '최근 수정된 PR/이슈명', en: 'Recently updated PR/issue name' },
    status: 'inProgress',
    progress: 72,
    issues: [
      {
        title: { ko: 'PR #24 관련 이슈', en: 'Issue related to PR #24' },
        description: {
          ko: '결제 플로우 리팩터링에 대한 리뷰 코멘트 요약',
          en: 'Summary of review comments on the checkout flow refactor',
        },
      },
      {
        title: { ko: '버그 리포트 #18', en: 'Bug report #18' },
        description: {
          ko: '로그인 세션 만료 시 리다이렉트 오류',
          en: 'Redirect error when the login session expires',
        },
      },
    ],
  },
  notion: {
    label: 'Notion',
    kicker: { ko: '최근 수정된 노션 문서명', en: 'Recently edited Notion document name' },
    status: 'done',
    progress: 100,
    issues: [
      {
        title: { ko: '온보딩 가이드 업데이트', en: 'Onboarding guide update' },
        description: {
          ko: '신규 팀원용 온보딩 문서 섹션 재구성 완료',
          en: 'Reorganized the onboarding document section for new team members',
        },
      },
    ],
  },
}

/* 최근 활동 */
export type RecentActivityItem = {
  source: SourceKey
  text: LocalizedText
  time: LocalizedText
}

export const mockRecentActivity: RecentActivityItem[] = [
  {
    source: 'github',
    text: { ko: 'Github: PR #24 머지됨', en: 'Github: PR #24 merged' },
    time: { ko: '3일 전', en: '3 days ago' },
  },
  {
    source: 'figma',
    text: { ko: 'Figma: 결제 플로우 페이지 수정됨', en: 'Figma: Checkout flow page updated' },
    time: { ko: '5일 전', en: '5 days ago' },
  },
  {
    source: 'notion',
    text: { ko: 'Notion: 온보딩 가이드 문서 업데이트됨', en: 'Notion: Onboarding guide document updated' },
    time: { ko: '1주 전', en: '1 week ago' },
  },
]

/* AI 추천 질문 */
export const mockAiQuestions: LocalizedText[] = [
  { ko: '기능 A 는 전체 프로젝트에 왜 필요한가요?', en: 'Why is Feature A needed for the overall project?' },
  { ko: '기능 B 는 전체 프로젝트에 왜 필요한가요?', en: 'Why is Feature B needed for the overall project?' },
  { ko: '기능 C 는 전체 프로젝트에 왜 필요한가요?', en: 'Why is Feature C needed for the overall project?' },
]