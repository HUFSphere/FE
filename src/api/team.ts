import { apiRequest } from './client'

export type WorkspaceMember = {
  membershipId: number
  userId: number
  name: string
  role: 'leader' | 'member'
  joinedAt: string
}

export async function getMembers(workspaceId: number) {
  return apiRequest<WorkspaceMember[]>(`/api/v1/workspaces/${workspaceId}/members`, {
    method: 'GET',
  })
}

export async function removeMember(workspaceId: number, userId: number) {
  return apiRequest<null>(`/api/v1/workspaces/${workspaceId}/members/${userId}`, {
    method: 'DELETE',
  })
}

export async function generateInviteCode(workspaceId: number) {
  return apiRequest<{ workspaceId: number; inviteCode: string; expiresAt: string }>(
    `/api/v1/workspaces/${workspaceId}/invitations`,
    { method: 'POST' },
  )
}