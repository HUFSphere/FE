import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import BellIcon from '../ui/icons/BellIcon'
import LogoutIcon from '../ui/icons/LogoutIcon'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { mockUser } from '../../mocks/user'

function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dateLocale = i18n.language === 'ko' ? ko : enUS

  const handleLogout = () => {
    // 백엔드 API 연동되면 여기에 signOut() 호출 등 추가 필요할 듯?
    navigate('/sign-in')
  }

  return (
    <header className="flex items-center justify-end gap-10 px-8 py-5">
      <span className="text-2xl font-semibold text-taupe">
        {t('header.lastSynced', {
          time: formatDistanceToNow(new Date(mockUser.lastSyncedAt), {
            addSuffix: true,
            locale: dateLocale,
          }),
        })}
      </span>
      <div className="flex items-center gap-5">
        <button aria-label={t('header.notification')}>
          <BellIcon className="h-7 w-7 text-mocha" />
        </button>
        <button aria-label={t('header.logout')} onClick={handleLogout}>
          <LogoutIcon className="h-9 w-9 text-mocha" />
        </button>
      </div>
    </header>
  )
}

export default Header