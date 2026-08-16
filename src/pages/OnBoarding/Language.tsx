// 언어 설정 페이지
//
// - 배경 장식: decor 폴더에 새 파일을 만들지 않고 이 파일에 인라인
//   (도형 자체는 기존 components/ui/decor/linkboard-decor-kit.svg의 것과 동일)
// - 로고: 기존 public/linkboard_icon.svg 사용
// - 문구: locales/ko.json, en.json의 language 키

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* 선택 가능한 언어 목록.
   각 언어는 항상 그 언어 자체 표기로 보여야 하므로(언어 선택 전 화면) i18n 대상이 아닙니다. */
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

/* 코너가지-우하 — 좌측 상단(90도 회전)과 우측 하단에 사용 */
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

/* 줄기-가로 — 우측 상단에 2번, 오른쪽으로 사라짐 */
function StemHorizontal() {
  return (
    <>
      <path d="M5 5H175" stroke="url(#lang-stem-right)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5" cy="5" r="5" fill="#A8957F" />
    </>
  )
}

/* 장식 한 겹.
   viewBox는 시안(1920x1080) 그대로라 도형 크기·비율은 항상 시안과 같습니다.
   달라지는 건 preserveAspectRatio의 정렬뿐입니다. slice는 넘치는 쪽을 잘라내는데,
   기본값 xMidYMid는 상하좌우를 고르게 잘라서 화면 비율이 16:9가 아니면
   가장자리에 붙은 가지가 잘려 나갑니다(예: 1920x955 브라우저에서 위아래 각 62px).
   그래서 가지를 자기 모서리에 고정하는 정렬로 나눠 그립니다.
   xMinYMin이면 좌·상단이 절대 안 잘리므로 좌상단 가지가 시안 위치를 유지합니다. */
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

/* 배경 장식 — 가지는 각자 붙어 있는 모서리에 고정합니다.
   각 g의 transform은 decor-kit 원본 좌표를 시안 위치로 옮기는 값이며 시안 그대로입니다. */
function LanguageDecor() {
  return (
    <>
      {/* 좌상단: 코너가지, 화면 위에서 내려옴 */}
      <DecorLayer align="xMinYMin">
        <g transform="translate(347 155) rotate(-90)">
          <CornerBottomRight />
        </g>
      </DecorLayer>

      {/* 노드-흩뿌림: 세로 가운데에 오는 안내 문구 바로 위에 놓이는 장식이라
          문구와 같이 세로 중앙 기준으로 둡니다. 상단 고정이면 화면이 낮을 때 문구를 침범합니다. */}
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

      {/* 우상단: 줄기-가로 2개, 오른쪽 화면 밖으로 사라짐 */}
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

      {/* 좌하단: 줄기-세로(아래로 사라짐) + 곁가지-우 */}
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

      {/* 번짐-원 3개는 윤곽이 없는 배경이라 조금 잘려도 티가 나지 않으므로 중앙 기준으로 둡니다 */}
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

  // TODO: 번역 리소스는 아직 ko/en만 있습니다. 나머지 언어는 i18n의 fallbackLng(ko)로 표시됩니다.
  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    navigate('/onboarding/role')
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-milk">
      {/* 좌측 패널: 안내 문구 (패널 정중앙) */}
      <div className="relative flex w-162.5 shrink-0 items-center justify-center overflow-hidden bg-oat px-2.5">
        <p className="whitespace-pre text-center text-[40px] font-black leading-12 text-dark-lava">
          {t('language.prompt')}
        </p>
      </div>

      {/* 장식은 시안 순서대로 좌측 패널 위에 얹히고, 언어 버튼은 그 위에 옵니다 */}
      <div className="pointer-events-none absolute inset-0">
        <LanguageDecor />
      </div>

      {/* 우측: 언어 선택 버튼 (남은 영역 정중앙)
          w-[850px]는 시안과 같은 줄바꿈(3/3/2/3)이 나오도록 잡은 폭입니다 */}
      <div className="relative flex flex-1 items-center justify-center">
        <ul className="flex w-[850px] flex-wrap justify-center gap-x-[60px] gap-y-10">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                lang={lang.code}
                onClick={() => handleSelect(lang.code)}
                // 평소에는 살짝 작게, 마우스를 올리거나 포커스가 오면 시안 크기(100%)가 됩니다.
                // 크기는 transform이라 레이아웃에 영향이 없어 줄바꿈(3/3/2/3)이 흔들리지 않습니다.
                className="scale-95 whitespace-nowrap rounded-[40px] border border-mocha bg-mocha px-8.75 py-4.25 text-[30px] font-black leading-9 text-milk transition-transform duration-200 hover:scale-100 focus-visible:scale-100"
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 로고 */}
      <div className="absolute left-8.75 top-8.75 flex items-center gap-5">
        <img src="/linkboard_icon.svg" alt="" aria-hidden className="h-17.5 w-17.5" />
        <span className="text-[32px] font-extrabold tracking-tight text-mocha">LinkBoard</span>
      </div>
    </div>
  )
}

export default Language
