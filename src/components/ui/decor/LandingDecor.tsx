function LandingDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${className ?? ''}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="landing-stem-up" x1="267" y1="160" x2="267" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="landing-stem-down" x1="1855" y1="920" x2="1855" y2="1080" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5A4C" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="landing-glow">
          <stop stopColor="#A8957F" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#A8957F" stopOpacity="0.22" />
          <stop offset="1" stopColor="#A8957F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 줄기-세로: 최상단에서 아래로 (x=267), 로고 오른쪽 */}
      <path d="M267 155C264.239 155 262 157.239 262 160C262 162.761 264.239 165 267 165C269.761 165 272 162.761 272 160C272 157.239 269.761 155 267 155Z" fill="#6B5A4C"/>

      {/* 곁가지: 좌측 상단, 화면 밖에서 안쪽으로 */}
      <path d="M0 199C0 171 36 173 56 157" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M56 172C64.2843 172 71 165.284 71 157C71 148.716 64.2843 142 56 142C47.7157 142 41 148.716 41 157C41 165.284 47.7157 172 56 172Z" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4"/>
      <path d="M56 162C58.7614 162 61 159.761 61 157C61 154.239 58.7614 152 56 152C53.2386 152 51 154.239 51 157C51 159.761 53.2386 162 56 162Z" fill="#A8957F"/>

      {/* 코너가지: 우측 상단 */}
      <path d="M1920 144C1882 144 1862 122 1850 96C1838 70 1814 58 1778 58" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M1850 96C1848 122 1828 132 1802 134" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1802 143C1806.97 143 1811 138.971 1811 134C1811 129.029 1806.97 125 1802 125C1797.03 125 1793 129.029 1793 134C1793 138.971 1797.03 143 1802 143Z" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2"/>
      <path d="M1802 137C1803.66 137 1805 135.657 1805 134C1805 132.343 1803.66 131 1802 131C1800.34 131 1799 132.343 1799 134C1799 135.657 1800.34 137 1802 137Z" fill="#A8957F"/>
      <path d="M1778 71C1785.18 71 1791 65.1797 1791 58C1791 50.8203 1785.18 45 1778 45C1770.82 45 1765 50.8203 1765 58C1765 65.1797 1770.82 71 1778 71Z" fill="#6B5A4C"/>
      <path d="M1778 62.5C1780.49 62.5 1782.5 60.4853 1782.5 58C1782.5 55.5147 1780.49 53.5 1778 53.5C1775.51 53.5 1773.5 55.5147 1773.5 58C1773.5 60.4853 1775.51 62.5 1778 62.5Z" fill="#F1E7D6"/>

      {/* 곁가지: 우측, 화면 밖에서 안쪽으로 */}
      <path d="M1920 253C1920 225 1884 227 1864 211" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M1864 226C1872.28 226 1879 219.284 1879 211C1879 202.716 1872.28 196 1864 196C1855.72 196 1849 202.716 1849 211C1849 219.284 1855.72 226 1864 226Z" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.4"/>
      <path d="M1864 216C1866.76 216 1869 213.761 1869 211C1869 208.239 1866.76 206 1864 206C1861.24 206 1859 208.239 1859 211C1859 213.761 1861.24 216 1864 216Z" fill="#A8957F"/>
      <path d="M267 160V0" stroke="url(#landing-stem-up)" strokeWidth="2.4" strokeLinecap="round"/>

      {/* 번짐-원 3개: 상단 중앙 · 우측(밖으로 걸침) · 좌하단(아래로 걸침) */}
      <path d="M813 226C842.823 226 867 201.823 867 172C867 142.177 842.823 118 813 118C783.177 118 759 142.177 759 172C759 201.823 783.177 226 813 226Z" fill="url(#landing-glow)"/>
      <path d="M1934 847C1988.12 847 2032 803.124 2032 749C2032 694.876 1988.12 651 1934 651C1879.88 651 1836 694.876 1836 749C1836 803.124 1879.88 847 1934 847Z" fill="url(#landing-glow)"/>
      <path d="M331 1177C385.124 1177 429 1133.12 429 1079C429 1024.88 385.124 981 331 981C276.876 981 233 1024.88 233 1079C233 1133.12 276.876 1177 331 1177Z" fill="url(#landing-glow)"/>

      {/* 코너가지: 좌측 하단 */}
      <path d="M0 937C38 937 58 959 70 985C82 1011 106 1023 142 1023" stroke="#A8957F" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M70 985C72 959 92 949 118 947" stroke="#C4B49E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M118 956C122.971 956 127 951.971 127 947C127 942.029 122.971 938 118 938C113.029 938 109 942.029 109 947C109 951.971 113.029 956 118 956Z" fill="#F8F4ED" stroke="#C4B49E" strokeWidth="1.2"/>
      <path d="M118 950C119.657 950 121 948.657 121 947C121 945.343 119.657 944 118 944C116.343 944 115 945.343 115 947C115 948.657 116.343 950 118 950Z" fill="#A8957F"/>
      <path d="M142 1036C149.18 1036 155 1030.18 155 1023C155 1015.82 149.18 1010 142 1010C134.82 1010 129 1015.82 129 1023C129 1030.18 134.82 1036 142 1036Z" fill="#6B5A4C"/>
      <path d="M142 1027.5C144.485 1027.5 146.5 1025.49 146.5 1023C146.5 1020.51 144.485 1018.5 142 1018.5C139.515 1018.5 137.5 1020.51 137.5 1023C137.5 1025.49 139.515 1027.5 142 1027.5Z" fill="#F1E7D6"/>
      <path d="M1855 920V1080" stroke="url(#landing-stem-down)" strokeWidth="2.4" strokeLinecap="round"/>

      {/* 줄기-세로: 우하단에서 화면 밖으로 */}
      <path d="M1855 925C1857.76 925 1860 922.761 1860 920C1860 917.239 1857.76 915 1855 915C1852.24 915 1850 917.239 1850 920C1850 922.761 1852.24 925 1855 925Z" fill="#6B5A4C"/>

    </svg>
  )
}

export default LandingDecor