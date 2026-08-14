import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { CloseIcon } from '../icons/ModalIcons'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-220 max-w-full rounded-[9px] border-2 border-mocha bg-oat p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b-2 border-mocha pb-4">
          <h2 className="text-[28px] font-semibold text-dark-lava">{title}</h2>
          <button aria-label="닫기" onClick={onClose} className="text-dark-lava">
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal