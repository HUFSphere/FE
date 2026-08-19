import { apiRequest } from './client'

export type FeatureProgress = {
  featureId: number
  name: string
  totalCount: number
  doneCount: number
  progress: number
  lastUpdatedAt: string | null
}

export type RecentIssue = {
  workItemId: number
  title: string
  status: string
  sourceUrl: string
  sourceUpdatedAt: string | null
}

export type SourceCard = {
  sourceId: number
  sourceType: string
  sourceRef: string
  connStatus: string
  totalCount: number
  doneCount: number
  progress: number
  recentIssues: RecentIssue[]
}

export type RecentActivity = {
  workItemId: number
  sourceType: string
  itemType: string
  title: string
  status: string
  sourceUrl: string
  sourceUpdatedAt: string | null
}

export async function getFeatureDashboard(workspaceId: number) {
  const res = await apiRequest<{ features: FeatureProgress[] }>(
    `/api/v1/workspaces/${workspaceId}/dashboard/features`,
    { method: 'GET' },
  )
  return res.features
}

export async function getSourceDashboard(workspaceId: number) {
  const res = await apiRequest<{ sources: SourceCard[] }>(
    `/api/v1/workspaces/${workspaceId}/dashboard/sources`,
    { method: 'GET' },
  )
  return res.sources
}

export async function getRecentActivities(workspaceId: number) {
  const res = await apiRequest<{ activities: RecentActivity[] }>(
    `/api/v1/workspaces/${workspaceId}/recent-activities`,
    { method: 'GET' },
  )
  return res.activities
}

export async function getSuggestedQuestions(workspaceId: number, lang?: string) {
  const qs = lang ? `?lang=${lang}` : ''
  const res = await apiRequest<{ questions: string[] }>(
    `/api/v1/workspaces/${workspaceId}/suggested-questions${qs}`,
    { method: 'GET' },
  )
  return res.questions
}