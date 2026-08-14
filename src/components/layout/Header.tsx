import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { mockUser } from '../../mocks/user'
import BellIcon from '../ui/icons/BellIcon'
import LogoutIcon from '../ui/icons/LogoutIcon'
import ActionModal from '../ui/modal/ActionModal'

function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dateLocale = i18n.language === 'ko' ? ko : enUS
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleConfirmLogout = () => {
    // 백엔드 API 연동되면 여기에 signOut() 호출 등 추가 필요할 듯?
    setIsLogoutModalOpen(false)
    navigate('/sign-in')
  }

  return (
    <>
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
          <button aria-label={t('header.logout')} onClick={() => setIsLogoutModalOpen(true)}>
            <LogoutIcon className="h-9 w-9 text-mocha" />
          </button>
        </div>
      </header>

      <ActionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="로그아웃"
        icon={<LogoutIcon className="h-17.5 w-17.5 text-mocha" />}
        message={{
          title: '정말 로그아웃 하시겠어요?',
          description: '로그아웃하면 다시 로그인해야 서비스를 이용할 수 있어요.',
        }}
        buttons={[
          {
            label: '로그아웃',
            variant: 'primary',
            onClick: handleConfirmLogout,
          },
          {
            label: '취소',
            variant: 'secondary',
            onClick: () => setIsLogoutModalOpen(false),
          },
        ]}
      />
    </>
  )
}

export default Header