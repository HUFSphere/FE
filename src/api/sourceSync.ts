import { apiRequest } from './client'

export type SourceConnection = {
  id: number
  sourceType: string
  targetRepoOrBoard: string
  status: string
  lastSyncedAt: string | null
}

export async function getSourceConnections(workspaceId: number) {
  return apiRequest<SourceConnection[]>(`/api/v1/workspaces/${workspaceId}/source-connections`, {
    method: 'GET',
  })
}

export type SourceSyncResult = {
  id: number
  status: string
  startedAt: string
}

export async function syncSource(sourceId: number) {
  return apiRequest<SourceSyncResult>(`/api/v1/sources/${sourceId}/sync`, {
    method: 'POST',
  })
}