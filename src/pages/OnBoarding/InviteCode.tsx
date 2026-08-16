// 초대 코드 입력 페이지 (팀원)
//
// - 배경 장식: decor 폴더에 새 파일을 만들지 않고 이 파일에 인라인
//   (도형 자체는 기존 components/ui/decor/linkboard-decor-kit.svg의 것과 동일)
// - 로고: 기존 public/linkboard_icon.svg 사용
// - 문구: locales/ko.json, en.json의 inviteCode 키

import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* 코너가지-좌상 — 좌측에서 2번, 좌표계 원점은 도형 좌상단 */
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

/* 코너가지-우하 — 우측에서 2번 (y로 440 떨어져 반복) */
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

/* 곁가지-좌 — 우측에서 3번 (가운데 하나는 상하 반전) */
function SideBranchLeft() {
  return (
    <>
      <path d="M71.7 57.7C71.7 29.7 35.7 31.7 15.7 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.7" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="15.7" cy="15.7" r="5" fill="#A8957F" />
    </>
  )
}

/* 곁가지-우 — 좌측에서 2번 (y로 319 떨어져 반복) */
function SideBranchRight({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path d="M0.9 57.7C0.9 29.7 36.9 31.7 56.9 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="56.9" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="56.9" cy="15.7" r="5" fill="#A8957F" />
    </g>
  )
}

/* 배경 장식 — 화면 전체(1920x1080)를 덮습니다.
   slice = 상자를 채우고 넘치는 쪽은 중앙 기준으로 잘림 (object-cover와 동일)
   각 g의 transform은 decor-kit 원본 좌표를 시안 위치로 옮기는 값입니다.
   상단 가지 4개는 시안 좌표에서 +80 내렸습니다. 시안 그대로 두면 화면이 낮을 때
   로고와 겹치거나 위쪽이 잘려 보입니다. 회원가입 페이지와 같은 값입니다. */
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
        {/* 줄기-세로 좌하단: 위쪽 점에서 아래로 사라짐 */}
        <linearGradient id="invite-stem-down" x1="5" y1="921.2" x2="5" y2="1081.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        {/* 줄기-세로 우상단: 아래쪽 점에서 위로 사라짐 */}
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

      {/* 줄기-세로 2개: 좌하단(아래로), 우상단(위로) */}
      <g transform="translate(354 -1.19)">
        <path d="M5 921.2V1081.2" stroke="url(#invite-stem-down)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="5" cy="921.2" r="5" fill="#6B5A4C" />
        <path d="M1182 161.2V1.2" stroke="url(#invite-stem-up)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="1182" cy="161.2" r="5" fill="#6B5A4C" />
      </g>

      {/* 코너가지-좌상 2개: 좌측 상·하 (위쪽만 +80) */}
      <g transform="translate(-0.9 347.05)">
        <CornerTopLeft />
      </g>
      <g transform="translate(-0.9 824.1)">
        <CornerTopLeft />
      </g>

      {/* 곁가지-우 2개: 좌측 가장자리 (+80) */}
      <g transform="translate(-1.86 239.24)">
        <SideBranchRight y={0} />
        <SideBranchRight y={319} />
      </g>

      {/* 노드-흩뿌림: 문구 왼쪽 */}
      <g transform="translate(553 359)">
        <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
        <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
        <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
        <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
        <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
      </g>

      {/* 코너가지-우하 2개: 우측 상·중 (위쪽만 +80) */}
      <g transform="translate(1765.1 77)">
        <CornerBottomRight y={80} />
        <CornerBottomRight y={440} />
      </g>

      {/* 곁가지-좌 3개: 우측 가장자리, 가운데 하나는 상하 반전 (맨 위만 +80) */}
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

  // TODO: 초대 코드 검증 API 연동 전까지는 바로 프로젝트 지도로 넘깁니다.
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('/map')
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-oat">
      <div className="pointer-events-none absolute inset-0">
        <InviteCodeDecor />
      </div>

      {/* 로고 */}
      <div className="absolute left-8.75 top-8.75 flex items-center gap-5">
        <img src="/linkboard_icon.svg" alt="" aria-hidden className="h-17.5 w-17.5" />
        <span className="text-[32px] font-extrabold tracking-tight text-mocha">LinkBoard</span>
      </div>

      <form onSubmit={handleSubmit} className="relative flex w-125 flex-col gap-10">
        {/* 인사 문구 — 시안의 고정 높이 100px (문구 97px + 아래 여백 3px) */}
        <div className="flex h-25 flex-col items-center text-center text-dark-lava">
          {/* 제목은 상자(500px)보다 넓어 좌우로 조금씩 넘칩니다 (시안 538px) */}
          <h1 className="whitespace-nowrap text-[56px] font-bold leading-[70px]">{t('inviteCode.title')}</h1>
          <p className="text-[22px] font-medium leading-[27px]">{t('inviteCode.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* 시안에 라벨이 없어 화면에는 안 보이지만 이름은 붙여 둡니다 */}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label={t('inviteCode.label')}
            autoComplete="one-time-code"
            className="h-15 w-full rounded-[10px] border border-oat bg-white px-4.5 text-[20px] text-dark-lava outline-none transition-colors focus:border-mocha"
          />
          <button
            type="submit"
            className="h-15.5 w-full rounded-[10px] border border-mocha bg-mocha text-[20px] font-bold text-white"
          >
            {t('inviteCode.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InviteCode
