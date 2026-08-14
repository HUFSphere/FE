import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapIcon, ListIcon, ChatIcon, TeamIcon, SettingsIcon } from '../ui/icons/SidebarIcons'
import LanguageToggle from './LanguageToggle'
import Avatar from '../ui/icons/Avatar'
import { motion } from 'framer-motion'
import { mockUser } from '../../mocks/user'
import SidebarDecor from '../ui/decor/SidebarDecor'

const menuItems = [
  { key: 'sidebar.map', path: '/map', Icon: MapIcon },
  { key: 'sidebar.features', path: '/features', Icon: ListIcon },
  { key: 'sidebar.qa', path: '/qa', Icon: ChatIcon },
  { key: 'sidebar.team', path: '/team-settings', Icon: TeamIcon },
  { key: 'sidebar.settings', path: '/settings', Icon: SettingsIcon },
]

function Sidebar() {
    const { t, i18n } = useTranslation()
    const lang = i18n.language as 'ko' | 'en'
    const displayName =
    lang === 'en' && mockUser.name.en.length > 10
      ? mockUser.name.en.split(' ')[0] // 이름(First name)만
      : mockUser.name[lang]

  return (
    <aside className="relative flex w-80 shrink-0 flex-col bg-oat px-5 py-6">
      {/* 로고 */}
      <div className="mb-16 flex items-center gap-5 px-2">
        <img src="/linkboard_icon.svg" alt="LinkBoard 로고" className="h-17.5 w-17.5" />
        <span className="text-[32px] font-extrabold text-mocha">LinkBoard</span>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-5">
        {menuItems.map(({ key, path, Icon }) => (
          <NavLink key={path} to={path}>
            {({ isActive }) => (
              <div
                className={`relative flex items-center gap-5.5 rounded-[10px] px-5 py-4 text-2xl font-semibold ${
                  isActive ? 'text-milk' : 'text-mocha'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-highlight"
                    className="absolute inset-0 rounded-[10px] bg-charcoal"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className="relative h-8 w-8 shrink-0" />
                <span className="relative">{t(key)}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 하단 데코 */}
      <div className="-mx-5 flex-1 min-h-26.5 overflow-hidden py-2.5">
        <div className="relative h-full w-full">
          <SidebarDecor />
        </div>
      </div>

      {/* 언어 토글 */}
      <LanguageToggle />

      {/* 프로필 카드 */}
      <div className="flex items-center gap-6 px-1">
        <Avatar className="h-20 w-20 shrink-0 text-mocha" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[32px] font-extrabold text-mocha">{displayName}</div>
          <div className="truncate text-2xl font-semibold text-mocha">{mockUser.projectName[lang]}</div>
          <div className="text-2xl font-semibold text-mocha">{mockUser.role[lang]}</div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar