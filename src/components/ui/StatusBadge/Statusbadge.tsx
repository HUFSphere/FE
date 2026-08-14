import { useTranslation } from 'react-i18next'

export type Status = 'todo' | 'progress' | 'review' | 'done' | 'blocked'

const VARIANTS: Record<Status, string> = {
  todo: 'bg-milk border-almond-milk text-taupe',
  review: 'bg-milk border-mocha text-mocha',
  progress: 'bg-taupe border-mocha text-milk',
  done: 'bg-mocha border-dark-lava text-milk',
  blocked: 'bg-charcoal border-charcoal text-milk',
}

function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { t } = useTranslation()

  return (
    <span
      className={`grid h-7.5 min-w-19.5 shrink-0 place-items-center rounded-full border-2 px-3 text-[13px] font-bold ${VARIANTS[status]} ${className ?? ''}`}
    >
      {t(`status.${status}`)}
    </span>
  )
}

export default StatusBadge