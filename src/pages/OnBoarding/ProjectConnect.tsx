// 프로젝트 연결 (팀장용) 페이지
// TODO: 실제 OAuth 연동 전까지는 setTimeout으로 흉내내고, 랜덤하게 성공/실패를 시뮬레이션합니다.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import ActionModal from '../../components/ui/modal/ActionModal'
import {
  GithubIcon,
  FigmaIcon,
  NotionIcon,
  CheckCircleIcon,
  ErrorIcon,
  ArrowRightIcon,
  ReloadIcon,
} from '../../components/ui/icons/ModalIcons'

type SourceKey = 'github' | 'notion' | 'figma'
type ConnectionStatus = 'idle' | 'connecting' | 'success' | 'error'

const SOURCES: { key: SourceKey; label: string; LogoIcon: typeof GithubIcon; OutlineIcon: typeof GithubIcon }[] = [
  { key: 'github', label: 'Github', LogoIcon: GithubIcon, OutlineIcon: GithubIcon },
  { key: 'notion', label: 'Notion', LogoIcon: NotionIcon, OutlineIcon: NotionIcon },
  { key: 'figma', label: 'Figma', LogoIcon: FigmaIcon, OutlineIcon: FigmaIcon },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 코너가지 */
function CornerTopLeft() {
  return (
    <>
      <path
        d="M0.9 0.9C38.9 0.9 58.9 22.9 70.9 48.9C82.9 74.9 106.9 86.9 142.9 86.9"
        stroke="#A8957F"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M70.9 48.9C72.9 22.9 92.9 12.9 118.9 10.9" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="118.9" cy="10.9" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
      <circle cx="118.9" cy="10.9" r="3" fill="#A8957F" />
      <circle cx="142.9" cy="86.9" r="13" fill="#6B5A4C" />
      <circle cx="142.9" cy="86.9" r="4.5" fill="#F1E7D6" />
    </>
  )
}

/* 곁가지 */
function SideBranchRight() {
  return (
    <>
      <path d="M0.9 57.7C0.9 29.7 36.9 31.7 56.9 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="56.9" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="56.9" cy="15.7" r="5" fill="#A8957F" />
    </>
  )
}

function SideBranchLeft() {
  return (
    <>
      <path d="M71.7 57.7C71.7 29.7 35.7 31.7 15.7 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.7" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="15.7" cy="15.7" r="5" fill="#A8957F" />
    </>
  )
}

/* 노드-흩뿌림 */
function NodeScatter() {
  return (
    <>
      <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
      <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
      <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
      <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
      <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
      <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
    </>
  )
}

function ConnectDecor() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="connect-line-a" x1="1750" y1="57" x2="1920" y2="57" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="connect-line-b" x1="1783" y1="87" x2="1953" y2="87" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="connect-line-c" x1="161" y1="942" x2="-9" y2="942" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="connect-line-d" x1="128" y1="972" x2="-42" y2="972" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="connect-glow">
          <stop stopColor="#A8957F" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 좌상단 코너가지 */}
      <g transform="translate(-0.9 199.1)">
        <CornerTopLeft />
      </g>
      {/* 좌측 곁가지 (중단) */}
      <g transform="translate(-0.9 672.3)">
        <SideBranchRight />
      </g>
      {/* 좌측 곁가지 (상단, 상하 반전) */}
      <g transform="translate(-0.9 323.7) scale(1 -1)">
        <SideBranchRight />
      </g>
      {/* 좌하단 코너가지 (상하 반전) */}
      <g transform="translate(-0.9 839.9) scale(1 -1)">
        <CornerTopLeft />
      </g>

      {/* 우측 곁가지 2개 */}
      <g transform="translate(1862.3 758.3)">
        <SideBranchLeft />
      </g>
      <g transform="translate(1848.3 331.3)">
        <SideBranchLeft />
      </g>

      {/* 상단 노드-흩뿌림 (제목 근처) */}
      <g transform="translate(671 186.5)">
        <NodeScatter />
      </g>

      {/* 우상단 페이드 줄기 2개 */}
      <path d="M1750 57H1920" stroke="url(#connect-line-a)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="1750" cy="57" r="5" fill="#A8957F" />
      <path d="M1783 87H1953" stroke="url(#connect-line-b)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="1783" cy="87" r="5" fill="#A8957F" />

      {/* 좌하단 페이드 줄기 2개 */}
      <path d="M161 942H-9" stroke="url(#connect-line-c)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="161" cy="942" r="5" fill="#A8957F" />
      <path d="M128 972H-42" stroke="url(#connect-line-d)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="128" cy="972" r="5" fill="#A8957F" />

      {/* 번짐-원 2개 (우하단) */}
      <circle cx="1754" cy="920" r="98" fill="url(#connect-glow)" />
      <circle cx="1648" cy="738" r="54" fill="url(#connect-glow)" />
    </svg>
  )
}

function Connect() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [statuses, setStatuses] = useState<Record<SourceKey, ConnectionStatus>>({
    github: 'idle',
    notion: 'idle',
    figma: 'idle',
  })
  const [modalSource, setModalSource] = useState<SourceKey | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const connectedCount = SOURCES.filter((s) => statuses[s.key] === 'success').length
  const canFinish = connectedCount > 0

  const attemptConnect = (key: SourceKey) => {
    setStatuses((prev) => ({ ...prev, [key]: 'connecting' }))
    setModalSource(key)
    setIsModalOpen(true)

    // TODO: 실제로는 여기서 OAuth 리다이렉트 → 콜백 결과로 성공/실패를 받습니다.
    setTimeout(() => {
      const succeeded = Math.random() > 0.3
      setStatuses((prev) => ({ ...prev, [key]: succeeded ? 'success' : 'error' }))
    }, 1500)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    if (modalSource && statuses[modalSource] === 'error') {
      setStatuses((prev) => ({ ...prev, [modalSource]: 'idle' }))
    }
  }

  const activeSource = modalSource ? SOURCES.find((s) => s.key === modalSource)! : null
  const activeStatus = modalSource ? statuses[modalSource] : 'idle'

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-milk">
      <div className="pointer-events-none absolute inset-0">
        <ConnectDecor />
      </div>

      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-8.75 top-8.75 flex items-center gap-5"
      >
        <img src="/linkboard_icon.svg" alt="" aria-hidden className="h-17.5 w-17.5" />
        <span className="text-[32px] font-extrabold tracking-tight text-mocha">LinkBoard</span>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={staggerParent(0.15, 0.15)} className="relative flex flex-col items-center gap-14">
        {/* 인사 문구 */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[40px] font-extrabold tracking-tight text-dark-lava">{t('connect.title')}</h1>
          <p className="text-lg font-medium text-mocha">{t('connect.subtitle')}</p>
        </motion.div>

        {/* 연결 카드 3개 */}
        <motion.div variants={staggerParent(0.12, 0.1)} className="flex gap-10">
          {SOURCES.map(({ key, label, LogoIcon }) => {
            const status = statuses[key]
            const connected = status === 'success'

            return (
              <motion.button
                key={key}
                variants={fadeUp}
                type="button"
                onClick={() => attemptConnect(key)}
                disabled={status === 'connecting'}
                aria-label={`${label} 연결`}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative flex h-40 w-40 items-center justify-center rounded-[10px] bg-mocha transition-opacity disabled:opacity-70"
              >
                <LogoIcon className="h-16 w-16 text-milk" />

                <AnimatePresence>
                  {connected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -right-2.5 -top-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-mocha bg-taupe"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-milk" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </motion.div>

        {/* 하단 안내 + 연결 완료 버튼 */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
          <p className={`text-sm font-medium transition-opacity ${canFinish ? 'text-taupe/50' : 'text-taupe'}`}>
            ⚠ {t('connect.requireOne')}
          </p>
          <button
            type="button"
            disabled={!canFinish}
            onClick={() => navigate('/map')}
            className="flex h-16.25 w-75 items-center justify-center gap-2 rounded-[10px] bg-taupe text-xl font-bold text-milk transition-opacity disabled:opacity-40"
          >
            {t('connect.finish')}
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </motion.div>
      </motion.div>

      {/* 연결 진행 상태 모달 */}
      {activeSource && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={t('connect.modal.titleWithSource', { source: activeSource.label })}
          icon={
            activeStatus === 'success' ? (
              <CheckCircleIcon className="h-17.5 w-17.5 text-mocha" />
            ) : activeStatus === 'error' ? (
              <ErrorIcon className="h-17.5 w-17.5 text-mocha" />
            ) : (
              <activeSource.OutlineIcon className="h-17.5 w-17.5 text-mocha" />
            )
          }
          banner={activeStatus === 'error' ? t('connect.modal.errorBanner', { source: activeSource.label }) : undefined}
          message={
            activeStatus === 'connecting'
              ? { title: t('connect.modal.connectingTitle', { source: activeSource.label }), description: t('connect.modal.connectingDesc') }
              : activeStatus === 'success'
                ? { title: t('connect.modal.successTitle', { source: activeSource.label }), description: t('connect.modal.successDesc') }
                : { title: t('connect.modal.errorTitle'), description: t('connect.modal.errorDesc', { source: activeSource.label }) }
          }
          buttons={
            activeStatus === 'success'
              ? [
                  { label: t('connect.modal.connectNext'), variant: 'primary', icon: <ArrowRightIcon className="h-5 w-5" />, onClick: closeModal },
                  { label: t('connect.modal.finishAndContinue'), variant: 'secondary', onClick: () => navigate('/map') },
                ]
              : activeStatus === 'error'
                ? [
                    { label: t('connect.modal.retry'), variant: 'primary', icon: <ReloadIcon className="h-5 w-5" />, onClick: () => attemptConnect(activeSource.key) },
                    { label: t('connect.modal.close'), variant: 'secondary', onClick: closeModal },
                  ]
                : undefined
          }
        />
      )}
    </div>
  )
}

export default Connect