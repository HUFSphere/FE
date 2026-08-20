import { apiRequest } from './client'

export type NotificationItem = {
  id: number
  type: string
  workspaceId: number
  message: string
  read: boolean
  createdAt: string
}

export type NotificationListResponse = {
  notifications: NotificationItem[]
  unreadCount: number
}

export async function getNotifications(limit?: number) {
  const qs = limit ? `?limit=${limit}` : ''
  return apiRequest<NotificationListResponse>(`/api/v1/notifications${qs}`, {
    method: 'GET',
  })
}

export async function markNotificationAsRead(id: number) {
  return apiRequest<NotificationItem>(`/api/v1/notifications/${id}/read`, {
    method: 'PATCH',
  })
}