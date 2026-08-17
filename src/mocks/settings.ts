// 환경 설정 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요

/* AI 답변 톤 프리셋 — 누르면 아래 지시문이 채워짐 */
export type TonePreset = {
  id: string
  label: { ko: string; en: string }
  prompt: { ko: string; en: string }
}

export const mockTonePresets: TonePreset[] = [
  {
    id: 'concise',
    label: { ko: '간결하게', en: 'Concise' },
    prompt: {
      ko: '간결하고 핵심 위주로 답해주세요.',
      en: 'Answer concisely, focusing on the key points.',
    },
  },
  {
    id: 'detailed',
    label: { ko: '자세하게', en: 'Detailed' },
    prompt: {
      ko: '배경과 이유까지 자세히 설명해주세요. 관련 기록이 있으면 함께 짚어주세요.',
      en: 'Explain in detail, including background and reasoning. Point out related records when relevant.',
    },
  },
  {
    id: 'friendly',
    label: { ko: '친근하게', en: 'Friendly' },
    prompt: {
      ko: '처음 합류한 팀원에게 설명하듯 친근하게 답해주세요.',
      en: 'Answer in a friendly tone, as if explaining to someone who just joined the team.',
    },
  },
]

/* 초기 저장값 */
export const mockToneInstruction = {
  ko: '간결하고 핵심 위주로 답해주세요.',
  en: 'Answer concisely, focusing on the key points.',
}