// 구글 OAuth 콜백 페이지

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginWithOAuth } from '../../api/auth'
import { ApiError } from '../../api/client'
import { getMyWorkspaces } from '../../api/workspace'
import { setWorkspaceId } from '../../utils/workspaceStorage'

function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const code = searchParams.get('code')
    if (!code) {
      setError('인가 코드가 없습니다.')
      return
    }

    loginWithOAuth({ oauthProvider: 'google', oauthCode: code })
      .then(async () => {
        const workspaces = await getMyWorkspaces()
        if (workspaces.length > 0) {
          setWorkspaceId(workspaces[0].workspaceId)
          navigate('/map')
        } else {
          navigate('/onboarding/language')
        }
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : '구글 로그인에 실패했습니다.')
      })
  }, [searchParams, navigate])

  return (
    <div className="grid min-h-screen place-items-center bg-milk">
      {error ? (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-dark-lava">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className="rounded-[10px] bg-mocha px-6 py-3 font-bold text-milk"
          >
            로그인 페이지로
          </button>
        </div>
      ) : (
        <p className="text-lg font-medium text-mocha">로그인 처리 중...</p>
      )}
    </div>
  )
}

export default OAuthCallback