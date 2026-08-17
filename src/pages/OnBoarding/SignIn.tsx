// 로그인 페이지

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
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

/* 우측 패널 일러스트 */
function SignInIllustration() {
  const { t } = useTranslation()

  return (
    <svg
      width="526"
      height="494"
      viewBox="0 0 526 494"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={t('signIn.illustrationAlt')}
    >
      <defs>
        <filter
          id="signin-illust-glow"
          x="134.32"
          y="62.33"
          width="257.36"
          height="245.84"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="17" />
        </filter>
        <filter
          id="signin-illust-shadow"
          x="190.51"
          y="402.96"
          width="144.98"
          height="33.88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient
          id="signin-illust-stem"
          x1="263"
          y1="414.96"
          x2="263"
          y2="163.02"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B5A28C" stopOpacity="0.25" />
          <stop offset="1" stopColor="#6B5A4C" />
        </linearGradient>
      </defs>

      {/* 번짐-원 */}
      <g filter="url(#signin-illust-glow)">
        <path
          opacity="0.42"
          d="M263 274.17C315.29 274.17 357.68 234.359 357.68 185.25C357.68 136.141 315.29 96.33 263 96.33C210.71 96.33 168.32 136.141 168.32 185.25C168.32 234.359 210.71 274.17 263 274.17Z"
          fill="#8B7663"
        />
      </g>

      {/* 바닥 그림자 */}
      <g opacity="0.3" filter="url(#signin-illust-shadow)">
        <path
          d="M263 424.84C296.408 424.84 323.49 422.628 323.49 419.9C323.49 417.172 296.408 414.96 263 414.96C229.592 414.96 202.51 417.172 202.51 419.9C202.51 422.628 229.592 424.84 263 424.84Z"
          fill="#B5A28C"
        />
      </g>

      {/* 줄기 + 곁가지 */}
      <path d="M263 414.96V163.02" stroke="url(#signin-illust-stem)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M263 318.63C263 279.11 220.92 279.11 194.62 259.35" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M263 279.11C263 242.06 310.34 244.53 336.64 224.77" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />

      {/* 좌측 노드 */}
      <path
        d="M194.62 277.875C205.514 277.875 214.345 269.581 214.345 259.35C214.345 249.119 205.514 240.825 194.62 240.825C183.726 240.825 174.895 249.119 174.895 259.35C174.895 269.581 183.726 277.875 194.62 277.875Z"
        fill="#F8F4ED"
        stroke="#C4B49E"
        strokeWidth="1.4"
      />
      <path
        d="M194.62 265.525C198.251 265.525 201.195 262.76 201.195 259.35C201.195 255.94 198.251 253.175 194.62 253.175C190.989 253.175 188.045 255.94 188.045 259.35C188.045 262.76 190.989 265.525 194.62 265.525Z"
        fill="#A8957F"
      />

      {/* 우측 노드 */}
      <path
        d="M336.64 243.295C347.534 243.295 356.365 235.001 356.365 224.77C356.365 214.539 347.534 206.245 336.64 206.245C325.746 206.245 316.915 214.539 316.915 224.77C316.915 235.001 325.746 243.295 336.64 243.295Z"
        fill="#F8F4ED"
        stroke="#C4B49E"
        strokeWidth="1.4"
      />
      <path
        d="M336.64 230.945C340.271 230.945 343.215 228.18 343.215 224.77C343.215 221.36 340.271 218.595 336.64 218.595C333.009 218.595 330.065 221.36 330.065 224.77C330.065 228.18 333.009 230.945 336.64 230.945Z"
        fill="#A8957F"
      />

      {/* 최상단 노드 */}
      <path
        d="M263 182.78C280.43 182.78 294.56 169.51 294.56 153.14C294.56 136.77 280.43 123.5 263 123.5C245.57 123.5 231.44 136.77 231.44 153.14C231.44 169.51 245.57 182.78 263 182.78Z"
        fill="#6B5A4C"
      />
      <path
        d="M263 162.403C268.447 162.403 272.862 158.256 272.862 153.14C272.862 148.024 268.447 143.878 263 143.878C257.553 143.878 253.137 148.024 253.137 153.14C253.137 158.256 257.553 162.403 263 162.403Z"
        fill="#F1E7D6"
      />
    </svg>
  )
}

function SignInDecor() {
  return (
    <svg
      viewBox="0 0 1270 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="signin-stem-right" x1="710" y1="80" x2="880" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 코너가지-좌상: 좌측 상단, 화면 밖에서 안쪽으로 */}
      <g transform="translate(-229 54)">
        <path d="M230 210C268 210 288 232 300 258C312 284 336 296 372 296" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M300 258C302 232 322 222 348 220" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="348" cy="220" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="348" cy="220" r="3" fill="#A8957F" />
        <circle cx="372" cy="296" r="13" fill="#6B5A4C" />
        <circle cx="372" cy="296" r="4.5" fill="#F1E7D6" />
      </g>

      {/* 곁가지-우: 좌측 중단, 화면 밖에서 안쪽으로 */}
      <g transform="translate(-340 341)">
        <path d="M340 118C340 90 376 92 396 76" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="396" cy="76" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
        <circle cx="396" cy="76" r="5" fill="#A8957F" />
      </g>

      {/* 노드-흩뿌림: 인사 문구 위쪽 */}
      <g transform="translate(-50 -175.5)">
        <circle cx="420" cy="420" r="4" fill="#A8957F" opacity="0.8" />
        <circle cx="486" cy="452" r="6.5" fill="#C4B49E" />
        <circle cx="452" cy="500" r="3" fill="#A8957F" opacity="0.6" />
        <circle cx="524" cy="410" r="3.5" fill="#A8957F" opacity="0.5" />
        <circle cx="546" cy="486" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="546" cy="486" r="3" fill="#A8957F" />
      </g>

      {/* 줄기-가로: 우측 상단, 디자인 패널 쪽으로 사라짐 */}
      <g transform="translate(390 120)">
        <path d="M710 80H880" stroke="url(#signin-stem-right)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="710" cy="80" r="5" fill="#A8957F" />
      </g>

      {/* 곁가지-좌: 우측 하단 */}
      <g transform="translate(710 743)">
        <path d="M560 118C560 90 524 92 504 76" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="504" cy="76" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
        <circle cx="504" cy="76" r="5" fill="#A8957F" />
      </g>

      {/* 코너가지-우하: 우측 하단, 디자인 패널 쪽으로 사라짐 */}
      <g transform="translate(570 628)">
        <path d="M700 296C662 296 642 274 630 248C618 222 594 210 558 210" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M630 248C628 274 608 284 582 286" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="582" cy="286" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="582" cy="286" r="3" fill="#A8957F" />
        <circle cx="558" cy="210" r="13" fill="#6B5A4C" />
        <circle cx="558" cy="210" r="4.5" fill="#F1E7D6" />
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
  type: 'email' | 'password'
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
        className="h-15 w-full rounded-[10px] border border-taupe bg-white px-4.5 text-[20px] text-dark-lava outline-none transition-colors focus:border-mocha"
      />
    </motion.div>
  )
}

function SignIn() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // TODO: 로그인 API 연동 전까지는 다음 온보딩 단계로 넘깁니다.
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('/onboarding/language')
  }

  return (
    <div className="flex min-h-screen bg-milk">
      {/* 좌측: 로고 + 로그인 폼 */}
      <div className="relative grid flex-1 place-items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <SignInDecor />
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
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
            <h1 className="text-[50px] font-extrabold leading-17.5 text-dark-lava">
              {t('signIn.title')}
            </h1>
            <p className="text-[20px] font-medium leading-6.75 text-mocha">
              {t('signIn.subtitle')}
            </p>
          </motion.div>

          <motion.form
            variants={staggerParent(0.1)}
            onSubmit={handleSubmit}
            className="flex flex-col gap-7.5"
          >
            {/* 입력 */}
            <motion.div variants={staggerParent(0.08)} className="flex flex-col">
              <Field
                id="signin-email"
                label={t('signIn.email')}
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <Field
                id="signin-password"
                label={t('signIn.password')}
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            </motion.div>

            {/* 로그인 버튼 */}
            <motion.button
              variants={fadeUp}
              type="submit"
              className="h-15.5 w-full rounded-[10px] border border-mocha bg-mocha text-[20px] font-bold text-milk"
            >
              {t('signIn.submit')}
            </motion.button>
          </motion.form>

          {/* 구글 로그인 */}
          <motion.button
            variants={fadeUp}
            type="button"
            // TODO: 구글 OAuth 연동
            onClick={() => navigate('/onboarding/language')}
            className="flex h-15.5 w-full items-center justify-center gap-2.5 rounded-[10px] border border-mocha bg-white text-[20px] font-semibold text-charcoal"
          >
            <GoogleIcon />
            {t('signIn.google')}
          </motion.button>

          {/* 회원가입 안내 */}
          <motion.p
            variants={fadeUp}
            className="text-center text-[20px] font-light leading-6.25 text-black"
          >
            {t('signIn.noAccount')}{' '}
            <Link to="/sign-up" className="font-semibold text-mocha underline">
              {t('signIn.signUp')}
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* 우측: 디자인 패널 */}
      <aside className="grid w-162.5 shrink-0 place-items-center bg-oat">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeScale}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <SignInIllustration />
        </motion.div>
      </aside>
    </div>
  )
}

export default SignIn