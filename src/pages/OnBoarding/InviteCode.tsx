// 초대 코드 입력 페이지 (팀원)

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { joinWorkspace } from '../../api/workspace'
import { ApiError } from '../../api/client'
import { setWorkspaceId } from '../../utils/workspaceStorage'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 코너가지-좌상 */
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

/* 코너가지-우하 */
function CornerBottomRight({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path d="M155 99C117 99 97 77 85 51C73 25 49 13 13 13" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M85 51C83 77 63 87 37 89" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="37" cy="89" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
      <circle cx="37" cy="89" r="3" fill="#A8957F" />
      <circle cx="13" cy="13" r="13" fill="#6B5A4C" />
      <circle cx="13" cy="13" r="4.5" fill="#F1E7D6" />
    </g>
  )
}

/* 곁가지-좌 */
function SideBranchLeft() {
  return (
    <>
      <path d="M71.7 57.7C71.7 29.7 35.7 31.7 15.7 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.7" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="15.7" cy="15.7" r="5" fill="#A8957F" />
    </>
  )
}

/* 곁가지-우 */
function SideBranchRight({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path d="M0.9 57.7C0.9 29.7 36.9 31.7 56.9 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="56.9" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="56.9" cy="15.7" r="5" fill="#A8957F" />
    </g>
  )
}

function InviteCodeDecor() {
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
        {/* 줄기-세로 좌하단 */}
        <linearGradient id="invite-stem-down" x1="5" y1="921.2" x2="5" y2="1081.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        {/* 줄기-세로 우상단 */}
        <linearGradient id="invite-stem-up" x1="1182" y1="161.2" x2="1182" y2="1.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="invite-glow">
          <stop stopColor="#A8957F" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 번짐-원: 우하단 배경 깔개 */}
      <g transform="translate(1276 761)">
        <circle cx="98" cy="98" r="98" fill="url(#invite-glow)" />
      </g>
      <g transform="translate(1509 910)">
        <circle cx="54" cy="54" r="54" fill="url(#invite-glow)" />
      </g>

      {/* 줄기-세로 2개 */}
      <g transform="translate(354 -1.19)">
        <path d="M5 921.2V1081.2" stroke="url(#invite-stem-down)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="5" cy="921.2" r="5" fill="#6B5A4C" />
        <path d="M1182 161.2V1.2" stroke="url(#invite-stem-up)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="1182" cy="161.2" r="5" fill="#6B5A4C" />
      </g>

      {/* 코너가지-좌상 2개 */}
      <g transform="translate(-0.9 347.05)">
        <CornerTopLeft />
      </g>
      <g transform="translate(-0.9 824.1)">
        <CornerTopLeft />
      </g>

      {/* 곁가지-우 2개 */}
      <g transform="translate(-1.86 239.24)">
        <SideBranchRight y={0} />
        <SideBranchRight y={319} />
      </g>

      {/* 노드-흩뿌림 */}
      <g transform="translate(553 359)">
        <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
        <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
        <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
        <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
        <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
      </g>

      {/* 코너가지-우하 2개 */}
      <g transform="translate(1765.1 77)">
        <CornerBottomRight y={80} />
        <CornerBottomRight y={440} />
      </g>

      {/* 곁가지-좌 3개 */}
      <g transform="translate(1848.26 275.3)">
        <SideBranchLeft />
      </g>
      <g transform="translate(1848.26 494.3) scale(1 -1) translate(0 -58.6)">
        <SideBranchLeft />
      </g>
      <g transform="translate(1848.26 767.3)">
        <SideBranchLeft />
      </g>
    </svg>
  )
}

function InviteCode() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
     e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await joinWorkspace(code.trim())
      setWorkspaceId(res.workspaceId)
      navigate('/map')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '초대 코드 참여에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-oat">
      <div className="pointer-events-none absolute inset-0">
        <InviteCodeDecor />
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

      <motion.form
        initial="hidden"
        animate="show"
        variants={staggerParent(0.12, 0.1)}
        onSubmit={handleSubmit}
        className="relative flex w-125 flex-col gap-10"
      >
        {/* 인사 문구 */}
        <motion.div
          variants={fadeUp}
          className="flex h-25 flex-col items-center text-center text-dark-lava"
        >
          <h1 className="whitespace-nowrap text-[56px] font-bold leading-17.5">{t('inviteCode.title')}</h1>
          <p className="text-[22px] font-medium leading-6.75">{t('inviteCode.subtitle')}</p>
        </motion.div>

        <motion.div variants={staggerParent(0.08)} className="flex flex-col gap-2.5">
          <motion.input
            variants={fadeUp}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label={t('inviteCode.label')}
            autoComplete="one-time-code"
            className="h-15 w-full rounded-[10px] border border-almond-milk bg-white px-4.5 text-[20px] text-dark-lava outline-none transition-colors hover:border-mocha focus:border-mocha"
          />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <motion.button
            variants={fadeUp}
            type="submit"
            disabled={isSubmitting}
            className="h-15.5 w-full rounded-[10px] border border-mocha bg-mocha text-[20px] font-bold text-white disabled:opacity-60"
          >
            {isSubmitting ? '...' : t('inviteCode.submit')}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  )
}

export default InviteCode