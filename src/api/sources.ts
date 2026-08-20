import { apiRequest } from './client'
import { setOAuthReturnPath } from '../utils/oauthReturnStorage'

export type SourceType = 'GITHUB' | 'NOTION' | 'FIGMA'
export type SourceKey = 'github' | 'notion' | 'figma'

export const BASE_URL = 'https://hufsphere.z0.co.kr'

export function toSourceType(key: SourceKey): SourceType {
  return key.toUpperCase() as SourceType
}

export function toSourceKey(type: SourceType | string): SourceKey {
  return type.toLowerCase() as SourceKey
}

export type SourceConnection = {
  id: number
  sourceType: SourceType
  /* Github: owner/repo, Notion: 보드/페이지, Figma: 파일 링크 */
  targetRepoOrBoard: string
  status: string
  lastSyncedAt: string | null
}

export type GithubRepo = {
  fullName: string
  privateRepo: boolean
  defaultBranch: string
}

/* 연동 목록 조회 */
export async function getSourceConnections(workspaceId: number) {
  return apiRequest<SourceConnection[]>(
    `/api/v1/workspaces/${workspaceId}/source-connections`,
    { method: 'GET' },
  )
}

/* 연동 생성 */
export async function createSourceConnection(
  workspaceId: number,
  body: { sourceType: SourceType; targetRepoOrBoard: string },
) {
  return apiRequest<SourceConnection>(
    `/api/v1/workspaces/${workspaceId}/source-connections`,
    { method: 'POST', body },
  )
}

/* 연동 해제 — 팀장만 가능 */
export async function deleteSourceConnection(sourceId: number) {
  return apiRequest<null>(`/api/v1/sources/${sourceId}`, { method: 'DELETE' })
}

/* OAuth로 연결된 Github 계정의 레포 목록 */
export async function getGithubRepos(workspaceId: number) {
  return apiRequest<GithubRepo[]>(
    `/api/v1/auth/github/repos?workspaceId=${workspaceId}`,
    { method: 'GET' },
  )
}

export type SourceStatus = {
  id: number
  sourceType: SourceType
  targetRepoOrBoard: string
  status: string
  indexedCount: number
  lastSyncedAt: string | null
}

/* 동기화 상태 폴링 */
export async function getSourceStatus(sourceId: number) {
  return apiRequest<SourceStatus>(`/api/v1/sources/${sourceId}/status`, {
    method: 'GET',
  })
}

/* 소스 동기화 */
export async function syncSource(sourceId: number) {
  return apiRequest<{ id: number; status: string; startedAt: string }>(
    `/api/v1/sources/${sourceId}/sync`,
    { method: 'POST' },
  )
}

/* 소스 OAuth 시작
   returnPath를 주면 그 경로를, 없으면 현재 경로를 복귀 지점으로 기억합니다.
   콜백 페이지에서 재시도할 때는 콜백 경로가 아니라 원래 시작 화면을 넘겨야 합니다. */
export function startSourceOAuth(
  source: SourceKey,
  workspaceId: number,
  returnPath?: string,
) {
  setOAuthReturnPath(returnPath ?? window.location.pathname)
  window.location.href = `${BASE_URL}/api/v1/auth/${source}/authorize?workspaceId=${workspaceId}`
}