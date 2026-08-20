// Github 소스 연동 콜백 페이지
// 서버가 Github 인가를 처리한 뒤 ?workspaceId=&status=success|error 로 이 경로로 리다이렉트

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GithubIcon, CheckCircleIcon, ErrorIcon, ReloadIcon } from '../../components/ui/icons/ModalIcons'
import { createSourceConnection, getGithubRepos, startSourceOAuth } from '../../api/sources'
import type { GithubRepo } from '../../api/sources'
import { ApiError } from '../../api/client'
import { clearOAuthReturnPath, getOAuthReturnPath } from '../../utils/oauthReturnStorage'

/* 돌아갈 화면이 기억되어 있지 않으면(직접 접근 등) 팀 설정으로 */
const DEFAULT_RETURN_PATH = '/team-settings'

type Phase = 'loading' | 'selecting' | 'saving' | 'error' | 'invalid'

function GithubOAuthCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const calledRef = useRef(false)

  const workspaceIdParam = searchParams.get('workspaceId')
  const status = searchParams.get('status')
  const workspaceId = workspaceIdParam ? Number(workspaceIdParam) : null

  const [phase, setPhase] = useState<Phase>('loading')
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [selected, setSelected] = useState<string | null>(null)
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

    getGithubRepos(workspaceId)
      .then((list) => {
        setRepos(list)
        setPhase('selecting')
      })
      .catch((e) => {
        setErrorMessage(e instanceof ApiError ? e.message : t('githubCallback.repoLoadFailed'))
        setPhase('error')
      })
  }, [workspaceId, status, t])

  const confirmSelection = () => {
    if (!workspaceId || !selected) return
    setPhase('saving')
    setErrorMessage(null)
    createSourceConnection(workspaceId, { sourceType: 'GITHUB', targetRepoOrBoard: selected })
      .then(() => {
        /* 연동을 시작했던 화면으로 복귀 */
        const returnPath = getOAuthReturnPath() ?? DEFAULT_RETURN_PATH
        clearOAuthReturnPath()
        navigate(returnPath)
      })
      .catch((e) => {
        setErrorMessage(e instanceof ApiError ? e.message : t('githubCallback.saveFailed'))
        setPhase('selecting')
      })
  }

  const retry = () => {
    if (!workspaceId) {
      navigate(getOAuthReturnPath() ?? DEFAULT_RETURN_PATH)
      return
    }
    /* 현재 경로(콜백)가 아니라 원래 시작했던 화면을 복귀 경로로 넘깁니다 */
    startSourceOAuth('github', workspaceId, getOAuthReturnPath() ?? DEFAULT_RETURN_PATH)
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
            <GithubIcon className="h-14 w-14 text-mocha" />
            <p className="text-lg font-semibold text-mocha">{t('githubCallback.loading')}</p>
          </div>
        )}

        {/* 잘못된 접근 (파라미터 누락) */}
        {phase === 'invalid' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <ErrorIcon className="h-14 w-14 text-mocha" />
            <div>
              <p className="mb-1 text-xl font-semibold text-dark-lava">{t('githubCallback.invalidTitle')}</p>
              <p className="text-base text-taupe">{t('githubCallback.invalidDesc')}</p>
            </div>
            <button
              type="button"
              onClick={goBack}
              className="mt-2 rounded-[8px] bg-mocha px-6 py-3 text-lg font-semibold text-milk hover:bg-dark-lava"
            >
              {t('githubCallback.backToSettings')}
            </button>
          </div>
        )}

        {/* Github 인증 자체가 실패한 경우 (status=error) */}
        {phase === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <ErrorIcon className="h-14 w-14 text-mocha" />
            <div>
              <p className="mb-1 text-xl font-semibold text-dark-lava">{t('githubCallback.errorTitle')}</p>
              <p className="text-base text-taupe">{errorMessage ?? t('githubCallback.errorDesc')}</p>
            </div>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={retry}
                className="flex items-center gap-2 rounded-[8px] bg-mocha px-6 py-3 text-lg font-semibold text-milk hover:bg-dark-lava"
              >
                <ReloadIcon className="h-5 w-5" />
                {t('githubCallback.retry')}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="rounded-[8px] border-2 border-taupe bg-milk px-6 py-3 text-lg font-semibold text-mocha hover:bg-oat"
              >
                {t('githubCallback.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* 저장소 선택 / 저장 중 */}
        {(phase === 'selecting' || phase === 'saving') && (
          <div>
            <div className="mb-5 flex items-center gap-4">
              <GithubIcon className="h-10 w-10 text-mocha" />
              <div>
                <p className="text-xl font-semibold text-dark-lava">{t('githubCallback.selectHeading')}</p>
                <p className="text-sm text-taupe">{t('githubCallback.selectDesc')}</p>
              </div>
            </div>

            <div className="mb-4 max-h-96 overflow-y-auto rounded-[9px] border-2 border-taupe bg-milk">
              {repos.length === 0 ? (
                <p className="p-5 text-sm font-medium text-taupe">{t('githubCallback.repoEmpty')}</p>
              ) : (
                <ul className="divide-y divide-taupe">
                  {repos.map((repo) => {
                    const isSelected = selected === repo.fullName
                    return (
                      <li key={repo.fullName}>
                        <button
                          type="button"
                          onClick={() => setSelected(repo.fullName)}
                          disabled={phase === 'saving'}
                          className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors disabled:opacity-60 ${
                            isSelected ? 'bg-oat' : 'hover:bg-oat/50'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                              isSelected ? 'border-mocha bg-mocha' : 'border-taupe bg-milk'
                            }`}
                          >
                            {isSelected && <CheckCircleIcon className="h-3.5 w-3.5 text-milk" />}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-base font-semibold text-dark-lava">
                              {repo.fullName}
                            </span>
                            <span className="text-xs font-medium text-taupe">
                              {t('githubCallback.defaultBranch')}: {repo.defaultBranch}
                            </span>
                          </span>

                          <span
                            className={`shrink-0 rounded-[6px] px-2.5 py-1 text-xs font-semibold ${
                              repo.privateRepo ? 'bg-taupe/30 text-mocha' : 'border-2 border-taupe text-mocha'
                            }`}
                          >
                            {repo.privateRepo ? t('githubCallback.private') : t('githubCallback.public')}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {errorMessage && <p className="mb-3 text-sm font-semibold text-mocha">{errorMessage}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmSelection}
                disabled={!selected || phase === 'saving'}
                className="flex-1 rounded-[8px] bg-mocha py-3.5 text-lg font-semibold text-milk transition-opacity hover:bg-dark-lava disabled:opacity-40"
              >
                {phase === 'saving' ? t('githubCallback.saving') : t('githubCallback.confirm')}
              </button>
              <button
                type="button"
                onClick={goBack}
                disabled={phase === 'saving'}
                className="rounded-[8px] border-2 border-taupe bg-milk px-6 py-3.5 text-lg font-semibold text-mocha hover:bg-oat disabled:opacity-40"
              >
                {t('githubCallback.cancel')}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default GithubOAuthCallback