// Notion 소스 연동 콜백 페이지
// 서버가 Notion 인가를 처리한 뒤 ?workspaceId=&status=success|error 로 이 경로로 리다이렉트
// Notion은 인가 화면에서 사용자가 이미 페이지를 선택하므로 추가 입력 없이 바로 연동을 저장

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { NotionIcon, ErrorIcon, ReloadIcon } from '../../components/ui/icons/ModalIcons'
import { createSourceConnection, startSourceOAuth } from '../../api/sources'
import { ApiError } from '../../api/client'
import { clearOAuthReturnPath, getOAuthReturnPath } from '../../utils/oauthReturnStorage'

/* 돌아갈 화면이 기억되어 있지 않으면(직접 접근 등) 팀 설정으로 보냄 */
const DEFAULT_RETURN_PATH = '/team-settings'

/* 서버가 target을 넘겨주지 않을 때 사용할 기본 표시값 */
const DEFAULT_TARGET = 'Notion'

type Phase = 'loading' | 'error' | 'invalid'

function NotionOAuthCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const calledRef = useRef(false)

  const workspaceIdParam = searchParams.get('workspaceId')
  const status = searchParams.get('status')
  /* 서버가 Notion 워크스페이스/페이지 이름을 함께 넘겨주면 그대로 사용 */
  const target = searchParams.get('target')
  const workspaceId = workspaceIdParam ? Number(workspaceIdParam) : null

  const [phase, setPhase] = useState<Phase>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    if (!workspaceId || !status) {
      setPhase('invalid')
      return
    }

    if (status !== 'success') {
      setPhase('error')
      return
    }

    /* 인가가 끝났으므로 바로 연동을 저장하고 원래 화면으로 복귀 */
    createSourceConnection(workspaceId, {
      sourceType: 'NOTION',
      targetRepoOrBoard: target?.trim() || DEFAULT_TARGET,
    })
      .then(() => {
        const returnPath = getOAuthReturnPath() ?? DEFAULT_RETURN_PATH
        clearOAuthReturnPath()
        navigate(returnPath, { replace: true })
      })
      .catch((e) => {
        setErrorMessage(e instanceof ApiError ? e.message : t('notionCallback.saveFailed'))
        setPhase('error')
      })
  }, [workspaceId, status, target, navigate, t])

  const retry = () => {
    if (!workspaceId) {
      navigate(getOAuthReturnPath() ?? DEFAULT_RETURN_PATH)
      return
    }
    /* 현재 경로(콜백)가 아니라 원래 시작했던 화면을 복귀 경로로 넘깁니다 */
    startSourceOAuth('notion', workspaceId, getOAuthReturnPath() ?? DEFAULT_RETURN_PATH)
  }

  const goBack = () => {
    const returnPath = getOAuthReturnPath() ?? DEFAULT_RETURN_PATH
    clearOAuthReturnPath()
    navigate(returnPath)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-milk px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl rounded-[10px] border-2 border-mocha bg-oat p-8"
      >
        {/* 연동 저장 중 */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <NotionIcon className="h-14 w-14 text-mocha" />
            <p className="text-lg font-semibold text-mocha">{t('notionCallback.loading')}</p>
          </div>
        )}

        {/* 잘못된 접근 (파라미터 누락) */}
        {phase === 'invalid' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <ErrorIcon className="h-14 w-14 text-mocha" />
            <div>
              <p className="mb-1 text-xl font-semibold text-dark-lava">{t('notionCallback.invalidTitle')}</p>
              <p className="text-base text-taupe">{t('notionCallback.invalidDesc')}</p>
            </div>
            <button
              type="button"
              onClick={goBack}
              className="mt-2 rounded-[8px] bg-mocha px-6 py-3 text-lg font-semibold text-milk hover:bg-dark-lava"
            >
              {t('notionCallback.back')}
            </button>
          </div>
        )}

        {/* 인증 실패 또는 연동 저장 실패 */}
        {phase === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <ErrorIcon className="h-14 w-14 text-mocha" />
            <div>
              <p className="mb-1 text-xl font-semibold text-dark-lava">{t('notionCallback.errorTitle')}</p>
              <p className="text-base text-taupe">{errorMessage ?? t('notionCallback.errorDesc')}</p>
            </div>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={retry}
                className="flex items-center gap-2 rounded-[8px] bg-mocha px-6 py-3 text-lg font-semibold text-milk hover:bg-dark-lava"
              >
                <ReloadIcon className="h-5 w-5" />
                {t('notionCallback.retry')}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="rounded-[8px] border-2 border-taupe bg-milk px-6 py-3 text-lg font-semibold text-mocha hover:bg-oat"
              >
                {t('notionCallback.cancel')}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default NotionOAuthCallback