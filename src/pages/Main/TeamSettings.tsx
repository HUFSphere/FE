// 팀 설정 페이지
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import ActionModal from '../../components/ui/modal/ActionModal'
import {
  CheckCircleIcon,
  ErrorIcon,
  PersonPlusIcon,
  ReloadIcon,
} from '../../components/ui/icons/ModalIcons'
import {
  generateInviteCode,
  mockConnectedUrl,
  mockConnections,
  mockLeader,
  mockMembers,
} from '../../mocks/team'
import type { Connection, Member } from '../../mocks/team'

/* 카드 제목 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[24px] font-semibold text-dark-lava">{children}</h2>
}

/* 팀원 카드 */
function MemberCard({
  member,
  lang,
  onRemove,
  removeLabel,
}: {
  member: Member
  lang: 'ko' | 'en'
  onRemove?: () => void
  removeLabel?: string
}) {
  return (
    <div className="relative flex h-23 w-60 shrink-0 items-center gap-4 rounded-[6px] bg-taupe px-6">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-milk text-[14px] font-medium text-taupe">
        Aa
      </div>
      <span className="truncate text-[20px] font-semibold text-charcoal">{member.name[lang]}</span>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="absolute top-1.5 right-2.5 text-[15px] font-bold text-dark-lava hover:text-milk"
        >
          ✕
        </button>
      )}
    </div>
  )
}

/* 연결 상태 배지 — 연결됨은 꽉참, 미연결은 외곽선 */
function ConnectionBadge({
  connected,
  onClick,
  children,
}: {
  connected: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  const style = `grid h-9 w-35.5 shrink-0 place-items-center text-[16px] font-semibold ${
    connected
      ? 'rounded-[8px] bg-charcoal text-milk'
      : 'rounded-[8px] border-2 border-taupe bg-milk text-mocha'
  }`

  if (!onClick) return <span className={style}>{children}</span>

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${style} ${connected ? 'hover:bg-mocha' : 'hover:border-mocha hover:bg-oat'}`}
    >
      {children}
    </button>
  )
}

function TeamSettings() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ko'

  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [connections, setConnections] = useState<Connection[]>(mockConnections)

  /* 초대 코드 */
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  /* 연결 / 해제 확인 */
  const [connecting, setConnecting] = useState<Connection | null>(null)
  const [pending, setPending] = useState<Connection | null>(null)

  const removeMember = (id: string) => setMembers((prev) => prev.filter((m) => m.id !== id))

  const updateUrl = (source: string, url: string) =>
    setConnections((prev) => prev.map((c) => (c.source === source ? { ...c, url } : c)))

  const openInvite = () => {
    setInviteCode(generateInviteCode())
    setCopied(false)
  }

  const copyCode = async () => {
    if (!inviteCode) return
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const connect = () => {
    if (!connecting) return
    updateUrl(connecting.source, mockConnectedUrl[connecting.source])
    setConnecting(null)
  }

  const disconnect = () => {
    if (!pending) return
    updateUrl(pending.source, '')
    setPending(null)
  }

  return (
    <div className="mx-auto w-full max-w-[1479px]">
      <h1 className="mb-4 text-[28px] font-extrabold tracking-tight text-dark-lava">
        {t('teamSettings.title')}
      </h1>

      {/* 팀 설정 */}
      <section className="mb-4.25 rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-2.5 flex items-center">
          <CardTitle>{t('teamSettings.members')}</CardTitle>
          <button
            type="button"
            onClick={openInvite}
            className="ml-auto h-9 w-29.5 rounded-[9px] bg-milk text-[14px] font-semibold text-mocha border-2 border-taupe hover:bg-oat"
          >
            {t('teamSettings.addMember')}
          </button>
        </div>

        {/* 팀장 */}
        <p className="mb-2 text-[18px] font-semibold text-mocha">{t('teamSettings.leader')}</p>
        <div className="mb-3.5">
          <MemberCard member={mockLeader} lang={lang} />
        </div>

        {/* 팀원 */}
        <p className="mb-2 text-[18px] font-semibold text-mocha">{t('teamSettings.member')}</p>
        <ul className="flex flex-wrap gap-[29px]">
          {members.map((m) => (
            <li key={m.id}>
              <MemberCard
                member={m}
                lang={lang}
                onRemove={() => removeMember(m.id)}
                removeLabel={t('teamSettings.removeMember')}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* 프로젝트 연결 관리 */}
      <section className="rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-4">
          <CardTitle>{t('teamSettings.connections')}</CardTitle>
        </div>

        <ul className="flex flex-col gap-3">
          {connections.map((c) => {
            const Icon = SOURCE_ICON[c.source]
            const connected = c.url.trim() !== ''
            return (
              <li key={c.source} className="flex items-center gap-2.5">
                <Icon className="h-6 w-6 shrink-0 text-dark-lava" />
                <span className="w-27 shrink-0 text-[20px] font-bold text-charcoal">{c.label}</span>

                <input
                  type="url"
                  value={c.url}
                  readOnly
                  aria-label={`${c.label} URL`}
                  placeholder={t('teamSettings.connectPlaceholder')}
                  className="h-8.5 flex-1 rounded-[7px] border border-taupe bg-milk px-4.5 text-[15px] font-semibold text-mocha placeholder-taupe focus:outline-none"
                />

                <ConnectionBadge
                  connected={connected}
                  onClick={connected ? () => setPending(c) : () => setConnecting(c)}
                >
                  {connected ? t('teamSettings.connected') : t('teamSettings.notConnected')}
                </ConnectionBadge>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 팀원 추가 - 초대 코드 발급 */}
      <ActionModal
        isOpen={inviteCode !== null}
        onClose={() => setInviteCode(null)}
        title={t('teamSettings.inviteTitle')}
        icon={<PersonPlusIcon className="h-12 w-12 text-mocha" />}
        banner={t('teamSettings.inviteBanner')}
        message={{
          title: inviteCode ?? '',
          description: t('teamSettings.inviteDesc'),
        }}
        buttons={[
          {
            label: copied ? t('teamSettings.copied') : t('teamSettings.copyCode'),
            variant: 'primary',
            onClick: copyCode,
            icon: copied ? <CheckCircleIcon /> : undefined,
          },
          {
            label: t('teamSettings.regenerate'),
            variant: 'secondary',
            onClick: openInvite,
            icon: <ReloadIcon />,
          },
        ]}
        footnote={t('teamSettings.inviteFootnote')}
      />

      {/* 연결되지 않음 - 계정 인증으로 연결 */}
      <ActionModal
        isOpen={connecting !== null}
        onClose={() => setConnecting(null)}
        title={t('teamSettings.connectTitle')}
        icon={
          connecting
            ? (() => {
                const Icon = SOURCE_ICON[connecting.source]
                return <Icon className="h-12 w-12 text-mocha" />
              })()
            : null
        }
        banner={connecting?.label ?? ''}
        message={{
          title: t('teamSettings.connectHeading', { source: connecting?.label ?? '' }),
          description: t('teamSettings.connectDesc', { source: connecting?.label ?? '' }),
        }}
        buttons={[
          {
            label: t('teamSettings.connectAction', { source: connecting?.label ?? '' }),
            variant: 'primary',
            onClick: connect,
          },
          {
            label: t('teamSettings.cancel'),
            variant: 'secondary',
            onClick: () => setConnecting(null),
          },
        ]}
        footnote={t('teamSettings.connectFootnote')}
      />

      {/* 연결됨 → 연결 해제 확인 */}
      <ActionModal
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        title={t('teamSettings.disconnectTitle')}
        icon={<ErrorIcon className="h-12 w-12 text-mocha" />}
        banner={pending?.label ?? ''}
        message={{
          title: t('teamSettings.disconnectConfirm'),
          description: t('teamSettings.disconnectDesc'),
        }}
        buttons={[
          {
            label: t('teamSettings.disconnectAction'),
            variant: 'primary',
            onClick: disconnect,
          },
          {
            label: t('teamSettings.cancel'),
            variant: 'secondary',
            onClick: () => setPending(null),
          },
        ]}
        footnote={t('teamSettings.disconnectFootnote')}
      />
    </div>
  )
}

export default TeamSettings