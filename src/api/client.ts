import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenStorage'

const BASE_URL = 'https://hufsphere.z0.co.kr'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  skipAuth?: boolean
}

async function rawFetch(path: string, options: RequestOptions = {}) {
  const { body, skipAuth, headers, ...rest } = options
  const accessToken = getAccessToken()

  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && !skipAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  if (!refreshPromise) {
    refreshPromise = rawFetch('/api/v1/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    })
      .then(async (res) => {
        if (!res.ok) return null
        const json = await res.json()
        const newAccessToken = json.data?.accessToken as string | undefined
        if (!newAccessToken) return null
        setTokens({ accessToken: newAccessToken, refreshToken })
        return newAccessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export async function apiFetch(path: string, options: RequestOptions = {}) {
  let res = await rawFetch(path, options)

  if (res.status === 401 && !options.skipAuth) {
    const newAccessToken = await refreshAccessToken()
    if (newAccessToken) {
      res = await rawFetch(path, options)
    } else {
      clearTokens()
      window.location.href = '/sign-in'
    }
  }

  return res
}

export class ApiError extends Error {
  status: number
  raw: unknown
  constructor(message: string, status: number, raw: unknown) {
    super(message)
    this.status = status
    this.raw = raw
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await apiFetch(path, options)
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(json.message ?? '요청에 실패했습니다', res.status, json)
  }

  return json.data as T
}