import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { mockUser } from '../../mocks/user'
import BellIcon from '../ui/icons/BellIcon'
import LogoutIcon from '../ui/icons/LogoutIcon'
import ActionModal from '../ui/modal/ActionModal'
import { motion, AnimatePresence } from 'framer-motion'

function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dateLocale = i18n.language === 'ko' ? ko : enUS
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

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
          <div className="relative">
            <button
              aria-label={t('header.notification')}
              onClick={() => setIsNotificationOpen((prev) => !prev)}
            >
              <BellIcon className="h-7 w-7 text-mocha" />
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotificationOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-40 mt-3 w-80 rounded-[10px] border border-taupe bg-milk p-4 shadow-lg"
                  >
                    <p className="mb-3 text-base font-bold text-dark-lava">{t('header.notification')}</p>
                    <p className="text-sm text-taupe">
                      {/* TODO: 실제 알림 API 연동 전까지의 플레이스홀더 */}
                      아직 새로운 알림이 없어요.
                    </p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button aria-label={t('header.logout')} onClick={() => setIsLogoutModalOpen(true)}>
            <LogoutIcon className="h-9 w-9 text-mocha" />
          </button>
        </div>
      </header>

      <ActionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t('header.logoutModal.title')}
        icon={<LogoutIcon className="h-17.5 w-17.5 text-mocha" />}
        message={{
          title: t('header.logoutModal.confirmTitle'),
          description: t('header.logoutModal.confirmDesc'),
        }}
        buttons={[
          {
            label: t('header.logoutModal.confirm'),
            variant: 'primary',
            onClick: handleConfirmLogout,
          },
          {
            label: t('header.logoutModal.cancel'),
            variant: 'secondary',
            onClick: () => setIsLogoutModalOpen(false),
          },
        ]}
      />
    </>
  )
}

export default Header