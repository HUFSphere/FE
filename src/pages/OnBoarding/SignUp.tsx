// 회원가입 페이지

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 구글 아이콘 */
function GoogleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <g className="stroke-charcoal" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.3295 20.1504C21.3623 18.2741 22.535 15.5182 22.535 12.2443C22.535 11.482 22.4666 10.749 22.3395 10.0454H12.215V14.2086H18.0004C17.7463 15.5475 16.9841 16.6811 15.8407 17.4434" />
        <path d="M2.6182 16.8277C4.38705 20.3361 8.01275 22.75 12.215 22.75C15.1175 22.75 17.5509 21.7922 19.3295 20.1504L15.8407 17.4434C14.883 18.0884 13.6614 18.4793 12.215 18.4793C9.42 18.4793 7.04525 16.5932 6.195 14.0523" />
        <path d="M2.6182 7.18205C1.88525 8.6284 1.465 10.2605 1.465 12C1.465 13.7395 1.88525 15.3716 2.6182 16.8179L5.40345 14.6484L6.19505 14.0425C5.98005 13.3975 5.853 12.7134 5.853 12C5.853 11.2866 5.98005 10.6025 6.19505 9.9575" />
        <path d="M12.215 5.53045C13.7982 5.53045 15.2055 6.0777 16.3293 7.1332L19.4077 4.0548C17.5411 2.31525 15.1174 1.25005 12.215 1.25005C8.0127 1.25005 4.387 3.6639 2.61815 7.1821L6.19495 9.95755C7.0452 7.41665 9.42 5.53045 12.215 5.53045Z" />
      </g>
    </svg>
  )
}

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

function SignUpDecor() {
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
        <linearGradient id="signup-stem-down" x1="5" y1="921.2" x2="5" y2="1081.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        {/* 줄기-세로 우상단 */}
        <linearGradient id="signup-stem-up" x1="1182" y1="161.2" x2="1182" y2="1.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="signup-glow">
          <stop stopColor="#A8957F" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 번짐-원 */}
      <g transform="translate(1276 761)">
        <circle cx="98" cy="98" r="98" fill="url(#signup-glow)" />
      </g>
      <g transform="translate(1509 910)">
        <circle cx="54" cy="54" r="54" fill="url(#signup-glow)" />
      </g>

      {/* 줄기-세로 2개 */}
      <g transform="translate(354 -1.19)">
        <path d="M5 921.2V1081.2" stroke="url(#signup-stem-down)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="5" cy="921.2" r="5" fill="#6B5A4C" />
        <path d="M1182 161.2V1.2" stroke="url(#signup-stem-up)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="1182" cy="161.2" r="5" fill="#6B5A4C" />
      </g>

      {/* 코너가지-좌상 2개: 좌측 상·하 */}
      <g transform="translate(-0.9 347.05)">
        <CornerTopLeft />
      </g>
      <g transform="translate(-0.9 824.1)">
        <CornerTopLeft />
      </g>

      {/* 곁가지-우 */}
      <g transform="translate(-1.86 239.24)">
        <SideBranchRight y={0} />
        <SideBranchRight y={319} />
      </g>

      {/* 노드-흩뿌림 */}
      <g transform="translate(641.1 204)">
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
      <g transform="translate(1849.2 498.3) scale(1 -1) translate(0 -58.6)">
        <SideBranchLeft />
      </g>
      <g transform="translate(1848.26 767.3)">
        <SideBranchLeft />
      </g>
    </svg>
  )
}

/* 라벨 + 인풋 */
function Field({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  id: string
  label: string
  type: 'email' | 'password' | 'text'
  value: string
  onChange: (value: string) => void
  autoComplete: string
}) {
  return (
    <motion.div variants={fadeUp} className="flex w-full flex-col">
      <label htmlFor={id} className="flex h-6.25 items-center text-[20px] font-medium text-taupe">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="h-15 w-full rounded-[10px] border border-almond-milk bg-white px-4.5 text-[20px] text-dark-lava outline-none transition-colors focus:border-mocha"
      />
    </motion.div>
  )
}

function SignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // TODO: 회원가입 API 연동 전까지는 다음 온보딩 단계로 넘깁니다.
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('/sign-in')
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-oat">
      <div className="pointer-events-none absolute inset-0">
        <SignUpDecor />
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

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerParent(0.12, 0.1)}
        className="relative flex w-125 flex-col gap-7.5"
      >
        {/* 인사 문구 */}
        <motion.div
          variants={fadeUp}
          className="flex h-25 flex-col items-center text-center text-dark-lava"
        >
          <h1 className="text-[50px] font-extrabold leading-17.5">{t('signUp.title')}</h1>
          <p className="text-[20px] font-medium leading-6.75">{t('signUp.subtitle')}</p>
        </motion.div>

        <motion.form variants={staggerParent(0.1)} onSubmit={handleSubmit} className="flex flex-col gap-7.5">
          {/* 입력 */}
          <motion.div variants={staggerParent(0.08)} className="flex flex-col">
            <Field
              id="signup-email"
              label={t('signUp.email')}
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              id="signup-password"
              label={t('signUp.password')}
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <Field
              id="signup-name"
              label={t('signUp.name')}
              type="text"
              value={name}
              onChange={setName}
              autoComplete="name"
            />
          </motion.div>

          {/* 회원가입 버튼 */}
          <motion.button
            variants={fadeUp}
            type="submit"
            className="h-15.5 w-full rounded-[10px] border border-mocha bg-mocha text-[20px] font-bold text-white"
          >
            {t('signUp.submit')}
          </motion.button>
        </motion.form>

        {/* 구글 회원가입 */}
        <motion.button
          variants={fadeUp}
          type="button"
          // TODO: 구글 OAuth 연동
          onClick={() => navigate('/sign-in')}
          className="flex h-15.5 w-full items-center justify-center gap-2.5 rounded-[10px] border border-mocha bg-white text-[20px] font-semibold text-charcoal"
        >
          <GoogleIcon />
          {t('signUp.google')}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default SignUp