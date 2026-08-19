// 커스텀 드롭다운 — 네이티브 select 대체
import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from '../icons/FeatureIcon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /* 선택 전 버튼에 표시할 문구 */
  placeholder?: string
  /* 값을 비우는 항목을 목록 맨 위에 노출할 때 사용 (필터 초기화용) */
  emptyOptionLabel?: string
  ariaLabel?: string
  /* 버튼 모양 커스터마이징 — 기본값은 기존 select와 동일 */
  buttonClassName?: string
  chevronClassName?: string
}

const BUTTON_BASE =
  'flex h-11.5 w-full items-center rounded-[9px] border-2 bg-milk pr-10 pl-4 text-left text-base font-semibold transition-colors focus:outline-none'

function Select({
  value,
  onChange,
  options,
  placeholder,
  emptyOptionLabel,
  ariaLabel,
  buttonClassName,
  chevronClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  /* 비우기 항목을 포함한 실제 목록 */
  const items: SelectOption[] =
    emptyOptionLabel !== undefined
      ? [{ value: '', label: emptyOptionLabel }, ...options]
      : options

  const selected = items.find((o) => o.value === value)
  const buttonLabel = selected?.label ?? placeholder ?? ''
  const isPlaceholder = value === '' && emptyOptionLabel === undefined

  /* 바깥 클릭 시 닫기 */
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  /* 열릴 때 현재 선택 항목으로 하이라이트 이동 */
  useEffect(() => {
    if (!open) return
    const index = items.findIndex((o) => o.value === value)
    setHighlighted(index >= 0 ? index : 0)
  }, [open])

  /* 하이라이트가 보이도록 스크롤 */
  useEffect(() => {
    if (!open) return
    const node = listRef.current?.children[highlighted] as HTMLElement | undefined
    node?.scrollIntoView({ block: 'nearest' })
  }, [open, highlighted])

  const select = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlighted((i) => (i + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlighted((i) => (i - 1 + items.length) % items.length)
        break
      case 'Home':
        e.preventDefault()
        setHighlighted(0)
        break
      case 'End':
        e.preventDefault()
        setHighlighted(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (items[highlighted]) select(items[highlighted].value)
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${highlighted}` : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={
          buttonClassName ??
          `${BUTTON_BASE} ${open ? 'border-mocha' : 'border-taupe'} ${
            isPlaceholder ? 'text-taupe' : 'text-dark-lava'
          }`
        }
      >
        <span className="truncate">{buttonLabel}</span>
      </button>

      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.18 }}
        className={
          chevronClassName ??
          'pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-taupe'
        }
      >
        <ChevronDownIcon className="h-5 w-5" />
      </motion.span>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            ref={listRef}
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-[9px] border-2 border-taupe bg-milk py-1.5 shadow-lg"
          >
            {items.map((option, index) => {
              const isSelected = option.value === value
              const isHighlighted = index === highlighted
              return (
                <div
                  key={option.value || 'placeholder'}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => select(option.value)}
                  className={`cursor-pointer px-4 py-2.5 text-base font-semibold transition-colors ${
                    isSelected ? 'text-dark-lava' : 'text-mocha'
                  } ${isHighlighted ? 'bg-oat' : 'bg-transparent'}`}
                >
                  {option.label}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Select