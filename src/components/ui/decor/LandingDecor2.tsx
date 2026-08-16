function LandingDecor2({ className }: { className?: string }) {
  return (
    /* 좌표계가 콘텐츠와 같아야 하므로 1920x1080 viewBox를 그대로 씁니다.
       meet = 상자 안에 전체가 들어오도록 맞춤 (object-contain과 동일)
       그라디언트 id는 LandingDecor와 겹치면 안 됩니다 (동시에 렌더되므로) */
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${className ?? ''}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="landing2-stem-a" x1="47" y1="920" x2="47" y2="1080" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="landing2-stem-b" x1="71" y1="967" x2="71" y2="1127" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="landing2-line-a" x1="1750" y1="54" x2="1920" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="landing2-line-b" x1="1797" y1="32" x2="1967" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8957F" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 곁가지: 좌측 최상단, 화면 밖에서 안쪽으로 */}
      <path d="M0 0C28 0 26 36 42 56" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="42" cy="56" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="42" cy="56" r="5" fill="#A8957F" />

      {/* 줄기-가로 2개: 우측 상단, 오른쪽으로 사라짐 (아래쪽 줄기는 화면 밖까지 이어짐) */}
      <path d="M1750 54H1920" stroke="url(#landing2-line-a)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="1750" cy="54" r="5" fill="#A8957F" />
      <path d="M1797 32H1967" stroke="url(#landing2-line-b)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="1797" cy="32" r="5" fill="#A8957F" />

      {/* 줄기-세로 2개: 좌측 하단, 아래로 사라짐 (오른쪽 줄기는 화면 밖까지 이어짐) */}
      <path d="M47 920V1080" stroke="url(#landing2-stem-a)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="47" cy="920" r="5" fill="#6B5A4C" />
      <path d="M71 967V1127" stroke="url(#landing2-stem-b)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="71" cy="967" r="5" fill="#6B5A4C" />

      {/* 곁가지: 우측 하단, 화면 밖에서 안쪽으로 */}
      <path d="M1920 923C1920 895 1884 897 1864 881" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="1864" cy="881" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
      <circle cx="1864" cy="881" r="5" fill="#A8957F" />
    </svg>
  )
}

export default LandingDecor2