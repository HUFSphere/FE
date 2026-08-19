const WORKSPACE_ID_KEY = 'linkboard-workspace-id'

export function getWorkspaceId(): number | null {
  const raw = localStorage.getItem(WORKSPACE_ID_KEY)
  return raw ? Number(raw) : null
}

export function setWorkspaceId(id: number) {
  localStorage.setItem(WORKSPACE_ID_KEY, String(id))
}