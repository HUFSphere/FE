import { apiRequest } from './client'

export type QnaSource = {
  sourceType: string
  itemType: string
  title: string
  url: string
}

export type TeamNormCard = {
  id: number
  category: string
  content: string
  reason: string
}

export type QnaResponse = {
  answer: string
  sources: QnaSource[]
  followUpQuestions: string[]
  relatedTeamNorms: TeamNormCard[]
}

export async function askQuestion(
  workspaceId: number,
  params: { question: string; lang: string; contextWorkItemIds?: number[] },
) {
  const body: Record<string, unknown> = { question: params.question, lang: params.lang }
  if (params.contextWorkItemIds && params.contextWorkItemIds.length > 0) {
    body.contextWorkItemIds = params.contextWorkItemIds
  }
  return apiRequest<QnaResponse>(`/api/v1/workspaces/${workspaceId}/qna`, {
    method: 'POST',
    body,
  })
}