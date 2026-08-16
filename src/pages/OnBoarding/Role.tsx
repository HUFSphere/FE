// 팀장 / 팀원 역할 설정 페이지
//
// - 아이콘: 피그마 export SVG를 public에 추가하지 않고 이 파일에 인라인
// - 배경 장식: decor 폴더에 새 파일을 만들지 않고 이 파일에 인라인
//   (도형 자체는 기존 components/ui/decor/linkboard-decor-kit.svg의 것과 동일)
// - 로고: 기존 public/linkboard_icon.svg 사용
// - 문구: locales/ko.json, en.json의 role 키

import type { ReactNode } from 'react'
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

/* 장식 한 겹.
   viewBox는 시안(1920x1080) 그대로라 도형 크기·비율은 항상 시안과 같습니다.
   달라지는 건 preserveAspectRatio의 정렬뿐입니다. slice는 넘치는 쪽을 잘라내는데
   기본값 xMidYMid는 상하좌우를 고르게 잘라서, 화면 비율이 16:9가 아니면
   가장자리에 붙은 가지가 잘리거나 안쪽으로 밀려 들어옵니다
   (예: 1920x955 브라우저에서 위아래 각 62px, 1280x900이면 좌우 각 192px).
   그래서 가지를 자기 모서리에 고정하는 정렬로 나눠 그립니다.
   xMinYMin이면 좌·상단이 절대 안 잘리므로 상단 가지가 시안 위치를 유지합니다.
   각 g의 transform은 decor-kit 원본 좌표를 시안 위치·각도로 옮기는 값이며 시안 그대로입니다. */
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

function RoleDecor() {
  return (
    <>
      {/* 상단: 코너가지(위에서 내려옴) + 줄기-가로 2개(위에서 아래로) */}
      <DecorLayer align="xMinYMin">
        <defs>
          <linearGradient id="role-stem-fade" x1="5" y1="5" x2="175" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A8957F" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(464.9 -0.9) rotate(90)">
          <CornerTopLeft />
        </g>
        <g transform="matrix(0 -1 -1 0 702 171)">
          <StemHorizontal />
        </g>
        <g transform="matrix(0 -1 -1 0 731 141)">
          <StemHorizontal />
        </g>
      </DecorLayer>

      {/* 우상단: 코너가지(180도) + 곁가지 */}
      <DecorLayer align="xMaxYMin">
        <g transform="translate(1920.9 214.9) scale(-1 -1)">
          <CornerTopLeft />
        </g>
        <g transform="translate(1862.3 324.9) rotate(-90)">
          <SideBranchRight />
        </g>
      </DecorLayer>

      {/* 노드-흩뿌림: 세로 가운데에 오는 안내 문구 곁에 놓이는 장식이라 문구와 같이 중앙 기준으로 둡니다 */}
      <DecorLayer align="xMinYMid">
        <g transform="translate(16 390)">
          <circle cx="4" cy="13.5" r="4" fill="#A8957F" opacity="0.8" />
          <circle cx="70" cy="45.5" r="6.5" fill="#C4B49E" />
          <circle cx="36" cy="93.5" r="3" fill="#A8957F" opacity="0.6" />
          <circle cx="108" cy="3.5" r="3.5" fill="#A8957F" opacity="0.5" />
          <circle cx="130" cy="79.5" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
          <circle cx="130" cy="79.5" r="3" fill="#A8957F" />
        </g>
      </DecorLayer>

      {/* 좌하단: 곁가지 + 코너가지 2개(하나는 아래에서 위로) */}
      <DecorLayer align="xMinYMax">
        <g transform="translate(-1.9 707.3)">
          <SideBranchRight />
        </g>
        <g transform="translate(-0.9 820.1)">
          <CornerTopLeft />
        </g>
        <g transform="translate(682.1 1080.9) rotate(-90)">
          <CornerTopLeft />
        </g>
      </DecorLayer>

      {/* 우하단: 줄기-세로 2개, 아래로 사라짐 */}
      <DecorLayer align="xMaxYMax">
        <defs>
          <linearGradient id="role-stem-down" x1="5" y1="5" x2="5" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6B5A4C" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(1816 915)">
          <StemVertical />
        </g>
        <g transform="translate(1786 956)">
          <StemVertical />
        </g>
      </DecorLayer>

      {/* 번짐-원 2개는 윤곽이 없는 배경이라 조금 잘려도 티가 나지 않으므로 중앙 기준으로 둡니다 */}
      <DecorLayer align="xMidYMid">
        <defs>
          <radialGradient id="role-glow">
            <stop stopColor="#A8957F" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
            <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="838" cy="236" r="98" fill="url(#role-glow)" />
        <circle cx="1616" cy="849" r="54" fill="url(#role-glow)" />
      </DecorLayer>
    </>
  )
}

/* 역할 선택 카드 — 아이콘 + 이름. 왕관은 시안대로 팀장에만 붙습니다.
   왕관과 사람 아이콘을 한 상자에 묶어 그 상자를 확대하므로, 호버 시 둘이 같이 커집니다. */
function RoleChoice({ label, crown, onClick }: { label: string; crown?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex flex-col items-center gap-2.5">
      <div className="flex flex-col items-center gap-2.5 transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110">
        {crown && <CrownIcon />}
        <PersonIcon />
      </div>
      <span className="text-[30px] font-bold leading-[33px] text-dark-lava">{label}</span>
    </button>
  )
}

function Role() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
          <RoleChoice crown label={t('role.leader')} onClick={() => navigate('/onboarding/connect')} />
          <RoleChoice label={t('role.member')} onClick={() => navigate('/onboarding/invite-code')} />
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
