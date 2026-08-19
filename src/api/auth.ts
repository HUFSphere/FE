import { apiRequest, apiFetch } from './client'
import { setTokens, clearTokens } from '../utils/tokenStorage'

export type NativeLang = 'en' | 'ko' | 'de' | 'ja' | 'zh' | 'es' | 'ms' | 'it' | 'fr' | 'ar' | 'ru'

export type LoginResponse = {
  userId: number
  email: string
  name: string
  nativeLang: NativeLang
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string) {
  const data = await apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

export async function signup(params: { email: string; password: string; name: string; nativeLang?: NativeLang }) {
  return apiRequest<{ userId: number; email: string; name: string; nativeLang: NativeLang; createdAt: string }>(
    '/api/v1/auth/signup',
    { method: 'POST', body: params, skipAuth: true },
  )
}

export async function logout() {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST' })
  } finally {
    clearTokens()
  }
}

export async function getMyInfo() {
  return apiRequest<{ userId: number; name: string; oauthProvider: string | null; nativeLang: NativeLang; createdAt: string }>(
    '/api/v1/auth/me',
    { method: 'GET' },
  )
}

export async function updateMyInfo(params: { name?: string; nativeLang?: NativeLang }) {
  return apiRequest<{ userId: number; name: string; nativeLang: NativeLang }>('/api/v1/auth/me', {
    method: 'PATCH',
    body: params,
  })
}

export type OAuthLoginResponse = LoginResponse & { oauthProvider: string; isNewUser: boolean }

export async function loginWithOAuth(params: { oauthProvider: string; oauthCode: string; nativeLang?: NativeLang }) {
  const data = await apiRequest<OAuthLoginResponse>('/api/v1/auth/oauth', {
    method: 'POST',
    body: params,
    skipAuth: true,
  })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

/* 소셜 로그인 시작(구글) */
export function startOAuth(provider: string) {
  window.location.href = `http://hufsphere.z0.co.kr/api/v1/auth/oauth/${provider}/authorize`
}