// 언어 설정 페이지

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { mockUser } from '../../mocks/user'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.06, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 선택 가능한 언어 목록 */
const LANGUAGES = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'ko', label: '한국어' },
  { code: 'de', label: 'DEUTSCH' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中國語' },
  { code: 'es', label: 'ESPAÑOL' },
  { code: 'ms', label: 'BAHASA MELAYU' },
  { code: 'it', label: 'ITALIANO' },
  { code: 'fr', label: 'FRANÇAIS' },
  { code: 'ar', label: 'اللغة العربية' },
  { code: 'ru', label: 'РУССКИЙ' },
] as const

/* 코너가지-우하 */
function CornerBottomRight() {
  return (
    <>
      <path d="M155 99C117 99 97 77 85 51C73 25 49 13 13 13" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M85 51C83 77 63 87 37 89" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="37" cy="89" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
      <circle cx="37" cy="89" r="3" fill="#A8957F" />
      <circle cx="13" cy="13" r="13" fill="#6B5A4C" />
      <circle cx="13" cy="13" r="4.5" fill="#F1E7D6" />
    </>
  )
}

/* 줄기-가로 */
function StemHorizontal() {
  return (
    <>
      <path d="M5 5H175" stroke="url(#lang-stem-right)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5" cy="5" r="5" fill="#A8957F" />
    </>
  )
}

function DecorLayer({ align, children }: { align: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio={`${align} slice`}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {children}
    </svg>
  )
}

/* 배경 장식 */
function LanguageDecor() {
  return (
    <>
      {/* 좌상단: 코너가지 */}
      <DecorLayer align="xMinYMin">
        <g transform="translate(347 155) rotate(-90)">
          <CornerBottomRight />
        </g>
      </DecorLayer>

      {/* 노드-흩뿌림 */}
      <DecorLayer align="xMinYMid">
        <g transform="translate(22 381)">
          <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
          <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
          <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
          <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
          <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
          <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
        </g>
      </DecorLayer>

      {/* 우상단 */}
      <DecorLayer align="xMaxYMin">
        <defs>
          <linearGradient id="lang-stem-right" x1="5" y1="5" x2="175" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A8957F" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(1745 131)">
          <StemHorizontal />
        </g>
        <g transform="translate(1774 161)">
          <StemHorizontal />
        </g>
      </DecorLayer>

      {/* 좌하단 */}
      <DecorLayer align="xMinYMax">
        <defs>
          <linearGradient id="lang-stem-down" x1="5" y1="5" x2="5" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6B5A4C" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(65 915)">
          <path d="M5 5V165" stroke="url(#lang-stem-down)" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="5" cy="5" r="5" fill="#6B5A4C" />
        </g>
        <g transform="translate(133.1 1022.3)">
          <path d="M0.9 57.7C0.9 29.7 36.9 31.7 56.9 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="56.9" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
          <circle cx="56.9" cy="15.7" r="5" fill="#A8957F" />
        </g>
      </DecorLayer>

      {/* 우하단: 코너가지 */}
      <DecorLayer align="xMaxYMax">
        <g transform="translate(1765 829)">
          <CornerBottomRight />
        </g>
      </DecorLayer>

      {/* 번짐 */}
      <DecorLayer align="xMidYMid">
        <defs>
          <radialGradient id="lang-glow">
            <stop stopColor="#A8957F" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="1573" cy="322" r="98" fill="url(#lang-glow)" />
        <circle cx="1009" cy="956" r="98" fill="url(#lang-glow)" />
        <circle cx="1185" cy="793" r="54" fill="url(#lang-glow)" />
      </DecorLayer>
    </>
  )
}

function Language() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  // TODO: 번역 리소스는 아직 ko/en만 있습니다. 나머지 언어는 i18n의 fallbackLng(en)으로 표시됩니다.
  // TODO: 실제로는 여기서 백엔드에 PATCH 요청을 보내 서버 쪽 언어 설정도 업데이트해야 합니다.
  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    mockUser.language = code
    navigate('/onboarding/role')
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-milk">
      {/* 좌측 패널: 안내 문구 */}
      <div className="relative flex w-162.5 shrink-0 items-center justify-center overflow-hidden bg-oat px-2.5">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="whitespace-pre text-center text-[40px] font-black leading-12 text-dark-lava"
        >
          {t('language.prompt')}
        </motion.p>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <LanguageDecor />
      </div>

      {/* 우측: 언어 선택 버튼 */}
      <div className="relative flex flex-1 items-center justify-center">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={staggerParent(0.05, 0.2)}
          className="flex w-212.5 flex-wrap justify-center gap-x-15 gap-y-10"
        >
          {LANGUAGES.map((lang) => (
            <motion.li key={lang.code} variants={fadeUp}>
              <button
                type="button"
                lang={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="scale-90 whitespace-nowrap rounded-[40px] border border-mocha bg-mocha px-8.75 py-4.25 text-[30px] font-black leading-9 text-milk transition-transform duration-200 hover:scale-100 focus-visible:scale-100"
              >
                {lang.label}
              </button>
            </motion.li>
          ))}
        </motion.ul>
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
    </div>
  )
}

export default Language