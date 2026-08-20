import { apiRequest } from './client'

export type MapNode = {
  id: number
  sourceType: string
  itemType: string
  sourceNumber: number | null
  title: string
  status: string
  statusLabel: string
  completionRate: number | null
  summaryBrief: string | null
  authorLogin: string | null
  sourceUrl: string
  sourceUpdatedAt: string | null
}

export type MapLink = {
  fromWorkItemId: number
  toWorkItemId: number
  linkSource: string
  linkReason: string
}

export type MapResponse = {
  nodes: MapNode[]
  links: MapLink[]
}

export async function getProjectMap(
  workspaceId: number,
  params: { lang?: string; sourceType?: string } = {},
) {
  const query = new URLSearchParams()
  if (params.lang) query.set('lang', params.lang)
  if (params.sourceType) query.set('sourceType', params.sourceType)
  const qs = query.toString()

  return apiRequest<MapResponse>(
    `/api/v1/workspaces/${workspaceId}/map${qs ? `?${qs}` : ''}`,
    { method: 'GET' },
  )
}