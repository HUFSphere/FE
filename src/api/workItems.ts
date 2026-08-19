import { apiRequest } from './client'

export type LinkedItem = {
  id: number
  sourceType: string
  itemType: string
  title: string
  sourceUrl: string
}

export type WorkItemDetail = {
  id: number
  sourceType: string
  itemType: string
  sourceNumber: number | null
  title: string
  status: string
  statusLabel: string
  authorLogin: string | null
  sourceUrl: string
  sourceUpdatedAt: string | null
  summaryNative: string | null
  linkedItems: LinkedItem[]
}

export async function getWorkItemDetail(workItemId: number, lang?: string) {
  const qs = lang ? `?lang=${lang}` : ''
  return apiRequest<WorkItemDetail>(`/api/v1/work-items/${workItemId}${qs}`, {
    method: 'GET',
  })
}