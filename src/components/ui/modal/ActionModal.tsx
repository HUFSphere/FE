import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from './Modal'
import ModalButton from './ModalButton'

type ActionModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: ReactNode
  banner?: string
  message: {
    title: string
    description: string
  }
  extraContent?: ReactNode
  buttons?: {
    label: string
    variant: 'primary' | 'secondary'
    onClick: () => void
    icon?: ReactNode
  }[]
  footnote?: string
}

function ActionModal({
  isOpen,
  onClose,
  title,
  icon,
  banner,
  message,
  extraContent,
  buttons,
  footnote,
}: ActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <AnimatePresence mode="wait">
        <motion.div
          key={message.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-5 flex items-center gap-6">
            {icon}
            {banner && <span className="text-base font-medium text-charcoal">{banner}</span>}
          </div>

          <div className="mb-5 rounded-[9px] border-2 border-taupe bg-milk p-5">
            <p className="mb-1 text-xl font-semibold text-charcoal">{message.title}</p>
            {message.description && (
              <p className="whitespace-pre-line text-base text-taupe">{message.description}</p>
            )}
            {extraContent && <div className="mt-3">{extraContent}</div>}
          </div>

          {buttons && buttons.length > 0 && (
            <div className="flex flex-col gap-3.75">
              {buttons.map((btn) => (
                <ModalButton key={btn.label} {...btn} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {footnote && <p className="mt-4 text-sm text-taupe">{footnote}</p>}
    </Modal>
  )
}

export default ActionModal