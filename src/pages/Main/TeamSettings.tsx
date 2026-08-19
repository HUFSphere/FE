// 팀 설정 페이지
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import ActionModal from '../../components/ui/modal/ActionModal'
import {
  CheckCircleIcon,
  ErrorIcon,
  PersonPlusIcon,
  ReloadIcon,
} from '../../components/ui/icons/ModalIcons'
import {
  mockConnectedUrl,
  mockConnections,
} from '../../mocks/team'
import type { Connection } from '../../mocks/team'
import {
  getMembers,
  removeMember as apiRemoveMember,
  generateInviteCode as apiGenerateInviteCode,
} from '../../api/team'
import type { WorkspaceMember } from '../../api/team'
import { leaveWorkspace } from '../../api/workspace'
import { getMyInfo } from '../../api/auth'
import { getWorkspaceId } from '../../utils/workspaceStorage'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 카드 제목 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-dark-lava">{children}</h2>
}

/* 팀원 카드 */
function MemberCard({
  member,
  onRemove,
  removeLabel,
  disabled,
}: {
  member: WorkspaceMember
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative flex h-23 w-60 shrink-0 items-center gap-4 rounded-md bg-taupe px-6"
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-milk text-base font-medium text-taupe">
        Aa
      </div>
      <span className="truncate text-lg font-semibold text-charcoal">{member.name}</span>

      {onRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="absolute top-1.5 right-2.5 text-sm font-bold text-dark-lava hover:text-milk"
        >
          ✕
        </button>
      )}
    </motion.div>
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
  const style = `grid h-9.5 w-30 shrink-0 place-items-center text-sm font-semibold ${
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const workspaceId = getWorkspaceId()

  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [myUserId, setMyUserId] = useState<number | null>(null)
  const [myRole, setMyRole] = useState<'leader' | 'member' | null>(null)

  /* 초대 코드 */
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  /* 연결 / 해제 확인 */
  const [connecting, setConnecting] = useState<Connection | null>(null)
  const [pending, setPending] = useState<Connection | null>(null)

  /* 나가기/추방 확인 대상 (본인이면 나가기, 남이면 추방으로 분기) */
  const [removeTarget, setRemoveTarget] = useState<WorkspaceMember | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (!workspaceId) {
      setLoadError('워크스페이스 정보가 없습니다.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    Promise.all([getMembers(workspaceId), getMyInfo()])
      .then(([memberList, me]) => {
        setMembers(memberList)
        setMyUserId(me.userId)
        const meAsMember = memberList.find((m) => m.userId === me.userId)
        setMyRole(meAsMember?.role ?? null)
      })
      .catch(() => setLoadError('멤버 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [workspaceId])

  const leader = members.find((m) => m.role === 'leader')
  const regularMembers = members.filter((m) => m.role !== 'leader')

  const confirmRemove = async () => {
    if (!workspaceId || !removeTarget) return
    setIsRemoving(true)
    try {
      if (removeTarget.userId === myUserId) {
        /* 본인이면 leave API로 스스로 나감 */
        await leaveWorkspace(workspaceId)
        navigate('/sign-in')
        return
      }
      /* 남이면 팀장 권한으로 추방 */
      await apiRemoveMember(workspaceId, removeTarget.userId)
      setMembers((prev) => prev.filter((m) => m.userId !== removeTarget.userId))
      setRemoveTarget(null)
    } catch {
      setLoadError('처리하지 못했습니다.')
    } finally {
      setIsRemoving(false)
    }
  }

  const updateUrl = (source: string, url: string) =>
    setConnections((prev) => prev.map((c) => (c.source === source ? { ...c, url } : c)))

  const openInvite = async () => {
    if (!workspaceId) return
    try {
      const res = await apiGenerateInviteCode(workspaceId)
      setInviteCode(res.inviteCode)
      setCopied(false)
    } catch {
      setLoadError('초대 코드를 발급하지 못했습니다.')
    }
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
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-369.75"
    >
      <motion.h1 variants={fadeUp} className="mb-4 text-2xl font-extrabold tracking-tight text-dark-lava">
        {t('teamSettings.title')}
      </motion.h1>

      {loadError && <p className="mb-4 text-sm font-semibold text-red-600">{loadError}</p>}

      {/* 팀 설정 */}
      <motion.section variants={fadeUp} className="mb-4.25 rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-2.5 flex items-center">
          <CardTitle>{t('teamSettings.members')}</CardTitle>
          <button
            type="button"
            onClick={openInvite}
            className="ml-auto h-9.5 w-30 rounded-[9px] bg-milk text-sm font-semibold text-mocha border-2 border-taupe hover:bg-oat"
          >
            {t('teamSettings.addMember')}
          </button>
        </div>

        {/* 팀장 */}
        {leader && (
          <>
            <p className="mb-2 text-lg font-semibold text-mocha">{t('teamSettings.leader')}</p>
            <motion.div variants={fadeUp} className="mb-3.5">
              <MemberCard member={leader} />
            </motion.div>
          </>
        )}

        {/* 팀원 */}
        <p className="mb-2 text-lg font-semibold text-mocha">{t('teamSettings.member')}</p>
        <motion.ul variants={staggerParent(0.06)} className="flex flex-wrap gap-7.25">
          <AnimatePresence mode="popLayout">
            {regularMembers.map((m) => {
              const isMe = m.userId === myUserId
              const canAct = isMe || myRole === 'leader'
              return (
                <motion.li key={m.membershipId} layout variants={fadeUp} exit={{ opacity: 0, scale: 0.9 }}>
                  <MemberCard
                    member={m}
                    onRemove={canAct ? () => setRemoveTarget(m) : undefined}
                    removeLabel={isMe ? t('teamSettings.leaveTeam') : t('teamSettings.removeMember')}
                    disabled={!canAct}
                  />
                </motion.li>
              )
            })}
          </AnimatePresence>
          {!isLoading && regularMembers.length === 0 && (
            <li className="py-4 text-sm font-medium text-taupe">아직 팀원이 없습니다.</li>
          )}
        </motion.ul>
      </motion.section>

      {/* 프로젝트 연결 관리 */}
      <motion.section variants={fadeUp} className="rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-4">
          <CardTitle>{t('teamSettings.connections')}</CardTitle>
        </div>

        <motion.ul variants={staggerParent(0.08)} className="flex flex-col gap-3">
          {connections.map((c) => {
            const Icon = SOURCE_ICON[c.source]
            const connected = c.url.trim() !== ''
            return (
              <motion.li key={c.source} variants={fadeUp} className="flex items-center gap-2.5">
                <Icon className="h-6 w-6 shrink-0 text-dark-lava" />
                <span className="w-20 shrink-0 text-xl font-bold text-charcoal">{c.label}</span>

                <input
                  type="url"
                  value={c.url}
                  readOnly
                  aria-label={`${c.label} URL`}
                  placeholder={t('teamSettings.connectPlaceholder')}
                  className="h-8.5 flex-1 rounded-[7px] border-2 border-taupe bg-milk px-4.5 text-sm font-semibold text-mocha placeholder-taupe focus:outline-none"
                />

                <ConnectionBadge
                  connected={connected}
                  onClick={connected ? () => setPending(c) : () => setConnecting(c)}
                >
                  {connected ? t('teamSettings.connected') : t('teamSettings.notConnected')}
                </ConnectionBadge>
              </motion.li>
            )
          })}
        </motion.ul>
      </motion.section>

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

      {/* 나가기 / 추방 확인 */}
      <ActionModal
        isOpen={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        title={removeTarget?.userId === myUserId ? t('teamSettings.leaveTitle') : t('teamSettings.removeTitle')}
        icon={<ErrorIcon className="h-12 w-12 text-mocha" />}
        message={{
          title:
            removeTarget?.userId === myUserId
              ? t('teamSettings.leaveConfirm')
              : t('teamSettings.removeConfirm', { name: removeTarget?.name ?? '' }),
          description:
            removeTarget?.userId === myUserId
              ? t('teamSettings.leaveDesc')
              : t('teamSettings.removeDesc'),
        }}
        buttons={[
          {
            label: isRemoving ? '...' : t('teamSettings.confirmYes'),
            variant: 'primary',
            onClick: confirmRemove,
          },
          {
            label: t('teamSettings.cancel'),
            variant: 'secondary',
            onClick: () => setRemoveTarget(null),
          },
        ]}
      />
    </motion.div>
  )
}

export default TeamSettings