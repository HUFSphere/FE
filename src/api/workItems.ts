import { apiRequest } from './client'

export type LinkedItem = {
  id: number
  sourceType: string
  itemType: string
  title: string
  sourceUrl: string
  linkReason: string | null
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
  completionRate: number | null
  linkedItems: LinkedItem[]
}

export async function getWorkItemDetail(workItemId: number, lang?: string) {
  const qs = lang ? `?lang=${lang}` : ''
  return apiRequest<WorkItemDetail>(`/api/v1/work-items/${workItemId}${qs}`, {
    method: 'GET',
  })
}

export type WorkItem = {
  id: number
  sourceType: string
  itemType: string
  sourceNumber: number | null
  title: string
  status: string
  statusLabel: string
  completionRate: number | null
  authorLogin: string | null
  sourceUrl: string
  sourceUpdatedAt: string | null
}

export type WorkItemPage = {
  items: WorkItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export async function getWorkItems(
  workspaceId: number,
  params: { query?: string; sourceType?: string; status?: string; page?: number; size?: number; lang?: string } = {},
) {
  const qs = new URLSearchParams()
  if (params.query) qs.set('query', params.query)
  if (params.sourceType) qs.set('sourceType', params.sourceType)
  if (params.status) qs.set('status', params.status)
  if (params.page) qs.set('page', String(params.page))
  if (params.size) qs.set('size', String(params.size))
  if (params.lang) qs.set('lang', params.lang)
  const query = qs.toString()

  return apiRequest<WorkItemPage>(
    `/api/v1/workspaces/${workspaceId}/work-items${query ? `?${query}` : ''}`,
    { method: 'GET' },
  )
}