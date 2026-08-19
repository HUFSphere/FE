import { apiRequest } from './client'

export type WorkspaceCreateResponse = {
  workspaceId: number
  name: string
  ownerUserId: number
  inviteCode: string
  inviteCodeExpiresAt: string
  sources: { sourceId: number; sourceType: string; sourceRef: string; connStatus: string }[]
  createdAt: string
}

export async function createWorkspace(params: { name: string; githubRepo?: string; notionUrl?: string; figmaUrl?: string }) {
  return apiRequest<WorkspaceCreateResponse>('/api/v1/workspaces', {
    method: 'POST',
    body: params,
  })
}

export type WorkspaceJoinResponse = {
  workspaceId: number
  name: string
  role: string
}

export async function joinWorkspace(inviteCode: string) {
  return apiRequest<WorkspaceJoinResponse>('/api/v1/workspaces/join', {
    method: 'POST',
    body: { inviteCode },
  })
}

export async function getMyWorkspaces() {
  return apiRequest<
    { workspaceId: number; name: string; myRole: string; ownerUserId: number; sourceCount: number; createdAt: string }[]
   >('/api/v1/workspaces', { method: 'GET' })
}