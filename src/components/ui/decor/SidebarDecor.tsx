function SidebarDecor({ className }: { className?: string }) {
  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      {/* 코너가지-좌상: 중앙 왼쪽 끝, 10px 위로 */}
      <svg
        viewBox="0 0 155 99"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 top-1/2 h-19.75 w-31 -translate-y-[calc(50%+10px)] opacity-60"
      >
        <path
          d="M0 0 C 38 0, 58 22, 70 48 C 82 74, 106 86, 142 86"
          stroke="#A8957F"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M70 48 C 72 22, 92 12, 118 10"
          stroke="#C4B49E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="118" cy="10" r="9" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2" />
        <circle cx="118" cy="10" r="3" fill="#A8957F" />
        <circle cx="142" cy="86" r="13" fill="#6B5A4C" />
        <circle cx="142" cy="86" r="4.5" fill="#F1E7D6" />
      </svg>

      {/* 곁가지-우: 우측 최상단, 좌우+상하 반전, 10px 위로 */}
      <svg
        viewBox="0 -15 71 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -top-2.5 right-0 h-14.25 w-17.75 scale-[-1] opacity-60"
      >
        <path d="M0 42 C 0 14, 36 16, 56 0" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="56" cy="0" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
        <circle cx="56" cy="0" r="5" fill="#A8957F" />
      </svg>

      {/* 곁가지-우: 좌측 최하단 (그대로 유지) */}
      <svg
        viewBox="0 -15 71 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 h-14.25 w-17.75 opacity-60"
      >
        <path d="M0 42 C 0 14, 36 16, 56 0" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="56" cy="0" r="15" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4" />
        <circle cx="56" cy="0" r="5" fill="#A8957F" />
      </svg>
    </div>
  )
}

export default SidebarDecor