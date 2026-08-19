// 토큰 저장/조회 (localStorage 기반)

const ACCESS_TOKEN_KEY = 'linkboard-access-token'
const REFRESH_TOKEN_KEY = 'linkboard-refresh-token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken?: string }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}