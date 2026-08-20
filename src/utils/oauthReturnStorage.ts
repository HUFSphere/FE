// OAuth 인가 페이지로 이동하기 전, 돌아올 화면 경로를 기억해둠
// 전체 페이지 이동(redirect)이 발생하므로 React Router state 대신 sessionStorage를 사용

const OAUTH_RETURN_PATH_KEY = 'linkboard-oauth-return-path'

export function setOAuthReturnPath(path: string) {
  sessionStorage.setItem(OAUTH_RETURN_PATH_KEY, path)
}

export function getOAuthReturnPath(): string | null {
  return sessionStorage.getItem(OAUTH_RETURN_PATH_KEY)
}

export function clearOAuthReturnPath() {
  sessionStorage.removeItem(OAUTH_RETURN_PATH_KEY)
}