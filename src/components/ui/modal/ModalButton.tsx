import type { ReactNode } from 'react'

type ModalButtonProps = {
  label: string
  variant: 'primary' | 'secondary'
  onClick: () => void
  icon?: ReactNode
}

function ModalButton({ label, variant, onClick, icon }: ModalButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-mocha border-dark-lava'
      : 'bg-taupe border-mocha'

  if (icon) {
    return (
      <button
        onClick={onClick}
        className={`grid w-full grid-cols-[1fr_auto_1fr] items-center rounded-[3px] border-2 py-3 text-xl font-semibold text-milk ${styles}`}
      >
        <span className="col-start-1 flex h-5 w-5 justify-self-end">{icon}</span>
        <span className="col-start-2 ml-2">{label}</span>
        <span aria-hidden className="col-start-3" />
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[3px] border-2 py-3 text-center text-xl font-semibold text-milk ${styles}`}
    >
      {label}
    </button>
  )
}

export default ModalButton