export type UiStatus = 'todo' | 'progress' | 'review' | 'done' | 'blocked'

const API_TO_UI_STATUS: Record<string, UiStatus> = {
  todo: 'todo',
  in_progress: 'progress',
  review: 'review',
  done: 'done',
}

export function toUiStatus(apiStatus: string): UiStatus {
  return API_TO_UI_STATUS[apiStatus] ?? 'todo'
}