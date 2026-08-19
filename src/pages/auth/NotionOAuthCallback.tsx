// Notion 소스 연동 콜백 페이지
// 서버가 Notion 인가를 처리한 뒤 ?workspaceId=&status=success|error 로 이 경로로 리다이렉트
// Notion은 선택 가능한 목록 API가 없어, 사용자가 페이지 이름을 직접 입력

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

type Phase = 'loading' | 'entering' | 'saving' | 'error' | 'invalid'

function NotionOAuthCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const calledRef = useRef(false)

  const workspaceIdParam = searchParams.get('workspaceId')
  const status = searchParams.get('status')
  const workspaceId = workspaceIdParam ? Number(workspaceIdParam) : null

  const [phase, setPhase] = useState<Phase>('loading')
  const [pageName, setPageName] = useState('')
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

    setPhase('entering')
  }, [workspaceId, status])

  const confirmPageName = () => {
    if (!workspaceId) return
    const value = pageName.trim()
    if (!value) {
      setErrorMessage(t('notionCallback.pageNameRequired'))
      return
    }

    setPhase('saving')
    setErrorMessage(null)
    createSourceConnection(workspaceId, { sourceType: 'NOTION', targetRepoOrBoard: value })
      .then(() => {
        /* 연동을 시작했던 화면으로 복귀 */
        const returnPath = getOAuthReturnPath() ?? DEFAULT_RETURN_PATH
        clearOAuthReturnPath()
        navigate(returnPath)
      })
      .catch((e) => {
        setErrorMessage(e instanceof ApiError ? e.message : t('notionCallback.saveFailed'))
        setPhase('entering')
      })
  }

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
        {/* 로딩 */}
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

        {/* Notion 인증 자체가 실패한 경우 (status=error) */}
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

        {/* 페이지 이름 입력 / 저장 중 */}
        {(phase === 'entering' || phase === 'saving') && (
          <div>
            <div className="mb-5 flex items-center gap-4">
              <NotionIcon className="h-10 w-10 text-mocha" />
              <div>
                <p className="text-xl font-semibold text-dark-lava">{t('notionCallback.inputHeading')}</p>
                <p className="text-sm text-taupe">{t('notionCallback.inputDesc')}</p>
              </div>
            </div>

            <input
              type="text"
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value)
                setErrorMessage(null)
              }}
              disabled={phase === 'saving'}
              placeholder={t('notionCallback.placeholder')}
              aria-label={t('notionCallback.inputHeading')}
              className="mb-2 h-11.5 w-full rounded-[9px] border-2 border-taupe bg-milk px-4 text-base font-medium text-dark-lava placeholder-taupe focus:border-mocha focus:outline-none disabled:opacity-60"
            />

            {errorMessage && <p className="mb-3 text-sm font-semibold text-mocha">{errorMessage}</p>}

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={confirmPageName}
                disabled={phase === 'saving'}
                className="flex-1 rounded-[8px] bg-mocha py-3.5 text-lg font-semibold text-milk transition-opacity hover:bg-dark-lava disabled:opacity-40"
              >
                {phase === 'saving' ? t('notionCallback.saving') : t('notionCallback.confirm')}
              </button>
              <button
                type="button"
                onClick={goBack}
                disabled={phase === 'saving'}
                className="rounded-[8px] border-2 border-taupe bg-milk px-6 py-3.5 text-lg font-semibold text-mocha hover:bg-oat disabled:opacity-40"
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