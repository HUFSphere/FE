// 팀장 / 팀원 역할 설정 페이지
//
// - 아이콘: 피그마 export SVG를 public에 추가하지 않고 이 파일에 인라인
// - 배경 장식: decor 폴더에 새 파일을 만들지 않고 이 파일에 인라인
//   (도형 자체는 기존 components/ui/decor/linkboard-decor-kit.svg의 것과 동일)
// - 로고: 기존 public/linkboard_icon.svg 사용
// - 문구: locales/ko.json, en.json의 role 키

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* 왕관 (피그마 export) — 기본은 팀장, 마우스를 올리면 그 쪽으로 옮겨갑니다 */
function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`fill-mocha ${className ?? ''}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.16667 10.1524L12.0333 18.019L20.0008 10.0515L27.9685 18.019L35.8333 10.1541V24.9485C35.8333 27.71 33.5948 29.9485 30.8333 29.9485H9.16667C6.40523 29.9485 4.16667 27.71 4.16667 24.9485V10.1524ZM32.5 18.1812V24.9485C32.5 25.869 31.7538 26.6152 30.8333 26.6152H9.16667C8.24618 26.6152 7.5 25.869 7.5 24.9485V18.1795L12.0333 22.7128L20.0008 14.7453L27.9685 22.7128L32.5 18.1812Z"
      />
    </svg>
  )
}

/* 사람 실루엣 (피그마 export) — 팀장·팀원 공통 */
function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`fill-mocha ${className ?? ''}`}
    >
      <path d="M12.5 150C12.5 150 0 150 0 137.5C0 125 12.5 87.5 75 87.5C137.5 87.5 150 125 150 137.5C150 150 137.5 150 137.5 150H12.5ZM75 75C84.9456 75 94.4839 71.0491 101.517 64.0165C108.549 56.9839 112.5 47.4456 112.5 37.5C112.5 27.5544 108.549 18.0161 101.517 10.9835C94.4839 3.95088 84.9456 0 75 0C65.0544 0 55.5161 3.95088 48.4835 10.9835C41.4509 18.0161 37.5 27.5544 37.5 37.5C37.5 47.4456 41.4509 56.9839 48.4835 64.0165C55.5161 71.0491 65.0544 75 75 75Z" />
    </svg>
  )
}

/* 코너가지-좌상 — 4번(180도 · -90도 · 90도 · 원본) 쓰입니다 */
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

/* 곁가지-우 — 2번(-90도 · 원본) */
function SideBranchRight() {
  return (
    <>
      <path d="M0.9 57.7C0.9 29.7 36.9 31.7 56.9 15.7" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="56.9" cy="15.7" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="56.9" cy="15.7" r="5" fill="#A8957F" />
    </>
  )
}

/* 줄기-세로 — 우하단 2번, 위쪽 점에서 아래로 사라짐 */
function StemVertical() {
  return (
    <>
      <path d="M5 5V165" stroke="url(#role-stem-down)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5" cy="5" r="5" fill="#6B5A4C" />
    </>
  )
}

/* 줄기-가로 — 상단 2번, 90도 돌려 세로로 세운 뒤 아래쪽 점에서 위로 사라짐 */
function StemHorizontal() {
  return (
    <>
      <path d="M5 5H175" stroke="url(#role-stem-fade)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5" cy="5" r="5" fill="#A8957F" />
    </>
  )
}

/* 배경 장식 — 화면 전체(1920x1080)를 덮습니다.
   slice = 상자를 채우고 넘치는 쪽은 중앙 기준으로 잘림 (object-cover와 동일)
   각 g의 transform은 decor-kit 원본 좌표를 시안 위치·각도로 옮기는 값입니다. */
function RoleDecor() {
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
        <linearGradient id="role-stem-down" x1="5" y1="5" x2="5" y2="165" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="role-stem-fade" x1="5" y1="5" x2="175" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="role-glow">
          <stop stopColor="#A8957F" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 번짐-원: 좌상단 패널 경계 · 우하단 */}
      <circle cx="838" cy="236" r="98" fill="url(#role-glow)" />
      <circle cx="1616" cy="849" r="54" fill="url(#role-glow)" />

      {/* 노드-흩뿌림: 좌측 문구 위 */}
      <g transform="translate(16 390)">
        <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
        <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
        <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
        <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
        <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
      </g>

      {/* 코너가지-좌상 4개 */}
      <g transform="translate(1920.9 214.9) scale(-1 -1)">
        <CornerTopLeft />
      </g>
      <g transform="translate(682.1 1080.9) rotate(-90)">
        <CornerTopLeft />
      </g>
      <g transform="translate(464.9 -0.9) rotate(90)">
        <CornerTopLeft />
      </g>
      <g transform="translate(-0.9 820.1)">
        <CornerTopLeft />
      </g>

      {/* 곁가지-우 2개 */}
      <g transform="translate(1862.3 324.9) rotate(-90)">
        <SideBranchRight />
      </g>
      <g transform="translate(-1.9 707.3)">
        <SideBranchRight />
      </g>

      {/* 줄기-세로 2개: 우하단 */}
      <g transform="translate(1816 915)">
        <StemVertical />
      </g>
      <g transform="translate(1786 956)">
        <StemVertical />
      </g>

      {/* 줄기-가로 2개: 상단에서 아래로 내려옴 */}
      <g transform="matrix(0 -1 -1 0 702 171)">
        <StemHorizontal />
      </g>
      <g transform="matrix(0 -1 -1 0 731 141)">
        <StemHorizontal />
      </g>
    </svg>
  )
}

/* 역할 선택 카드 — 아이콘 + 이름, 왕관은 선택 중인 쪽에만 */
function RoleChoice({
  label,
  crowned,
  active,
  onActiveChange,
  onClick,
}: {
  label: string
  crowned: boolean
  active: boolean
  onActiveChange: (active: boolean) => void
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onActiveChange(true)}
      onMouseLeave={() => onActiveChange(false)}
      onFocus={() => onActiveChange(true)}
      onBlur={() => onActiveChange(false)}
      className="flex flex-col items-center gap-2.5"
    >
      {/* 왕관 자리는 양쪽 모두 항상 차지해 둡니다. 그래야 왕관이 옮겨가도 아이콘이 밀리지 않습니다 */}
      <CrownIcon className={`transition-opacity duration-200 ${crowned ? 'opacity-100' : 'opacity-0'}`} />
      <PersonIcon className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`} />
      <span className="text-[30px] font-bold leading-[33px] text-dark-lava">{label}</span>
    </button>
  )
}

function Role() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 마우스를 올리거나 키보드 포커스가 간 역할. 아무것도 없으면 시안대로 팀장이 왕관을 씁니다.
  const [active, setActive] = useState<'leader' | 'member' | null>(null)
  const crowned = active ?? 'leader'

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-milk">
      {/* 좌측: 안내 문구 (영역 정중앙) */}
      <div className="relative flex w-162.5 shrink-0 items-center justify-center px-2.5">
        <p className="whitespace-pre text-center text-[40px] font-black leading-12 text-dark-lava">
          {t('role.prompt')}
        </p>
      </div>

      {/* 우측 패널: 역할 선택 (영역 정중앙, 아이콘 아래쪽 기준 정렬) */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-oat">
        <div className="flex items-end gap-[228px]">
          {/* TODO: 실제 온보딩 분기는 기획 확정 후 조정 필요 */}
          <RoleChoice
            label={t('role.leader')}
            crowned={crowned === 'leader'}
            active={active === 'leader'}
            onActiveChange={(on) => setActive(on ? 'leader' : null)}
            onClick={() => navigate('/onboarding/connect')}
          />
          <RoleChoice
            label={t('role.member')}
            crowned={crowned === 'member'}
            active={active === 'member'}
            onActiveChange={(on) => setActive(on ? 'member' : null)}
            onClick={() => navigate('/onboarding/invite-code')}
          />
        </div>
      </div>

      {/* 장식은 시안 순서대로 패널 위에 얹힙니다 */}
      <div className="pointer-events-none absolute inset-0">
        <RoleDecor />
      </div>

      {/* 로고 */}
      <div className="absolute left-8.75 top-8.75 flex items-center gap-5">
        <img src="/linkboard_icon.svg" alt="" aria-hidden className="h-17.5 w-17.5" />
        <span className="text-[32px] font-extrabold tracking-tight text-mocha">LinkBoard</span>
      </div>
    </div>
  )
}

export default Role
