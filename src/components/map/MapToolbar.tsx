export type CursorMode = 'select' | 'pan'

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden>
      <path
        d="M5.41637 0.414188C4.13668 -0.581633 2.27148 0.330907 2.27148 1.95235V24.0478C2.27148 25.8952 4.60285 26.7057 5.74848 25.2564L11.1927 18.3709C11.3934 18.1171 11.6489 17.9121 11.9401 17.7711C12.2312 17.6301 12.5506 17.5569 12.8741 17.5569H21.7755C23.6311 17.5569 24.4365 15.2093 22.972 14.0703L5.41637 0.414188Z"
        fill="currentColor"
      />
    </svg>
  )
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" fill="none" className={className} aria-hidden>
      <path
        d="M15 15V2.5C15 2.14583 15.1198 1.84896 15.3594 1.60938C15.599 1.36979 15.8958 1.25 16.25 1.25C16.6042 1.25 16.901 1.36979 17.1406 1.60938C17.3802 1.84896 17.5 2.14583 17.5 2.5V15H15ZM10 15V3.75C10 3.39583 10.1198 3.09896 10.3594 2.85938C10.599 2.61979 10.8958 2.5 11.25 2.5C11.6042 2.5 11.901 2.61979 12.1406 2.85938C12.3802 3.09896 12.5 3.39583 12.5 3.75V15H10ZM15.625 28.75C12.6667 28.75 10.1562 27.7188 8.09375 25.6562C6.03125 23.5938 5 21.0833 5 18.125V6.25C5 5.89583 5.11979 5.59896 5.35938 5.35938C5.59896 5.11979 5.89583 5 6.25 5C6.60417 5 6.90104 5.11979 7.14062 5.35938C7.38021 5.59896 7.5 5.89583 7.5 6.25V18.125C7.5 20.3958 8.28646 22.3177 9.85938 23.8906C11.4323 25.4635 13.3542 26.25 15.625 26.25C17.8958 26.25 19.8177 25.4635 21.3906 23.8906C22.9635 22.3177 23.75 20.3958 23.75 18.125V13.75C23.3958 13.75 23.099 13.8698 22.8594 14.1094C22.6198 14.349 22.5 14.6458 22.5 15V20H18.75C18.0625 20 17.474 20.2448 16.9844 20.7344C16.4948 21.224 16.25 21.8125 16.25 22.5V23.75H13.75V22.5C13.75 21.125 14.2396 19.9479 15.2188 18.9688C16.1979 17.9896 17.375 17.5 18.75 17.5H20V5C20 4.64583 20.1198 4.34896 20.3594 4.10938C20.599 3.86979 20.8958 3.75 21.25 3.75C21.6042 3.75 21.901 3.86979 22.1406 4.10938C22.3802 4.34896 22.5 4.64583 22.5 5V11.4688C22.7083 11.4062 22.9115 11.3542 23.1094 11.3125C23.3073 11.2708 23.5208 11.25 23.75 11.25H26.25V18.125C26.25 21.0833 25.2188 23.5938 23.1562 25.6562C21.0938 27.7188 18.5833 28.75 15.625 28.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MapToolbar({
  mode,
  onChange,
  selectLabel,
  panLabel,
}: {
  mode: CursorMode
  onChange: (m: CursorMode) => void
  selectLabel: string
  panLabel: string
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex h-14.5 -translate-x-1/2 overflow-hidden rounded-[7px] bg-oat">
      <button
        type="button"
        onClick={() => onChange('select')}
        aria-pressed={mode === 'select'}
        aria-label={selectLabel}
        className={`grid w-14.75 place-items-center transition-colors ${
          mode === 'select' ? 'bg-almond-milk text-dark-lava' : 'text-mocha hover:text-dark-lava'
        }`}
      >
        <CursorIcon className="h-6 w-6" />
      </button>

      <span className="my-3 w-px bg-taupe" />

      <button
        type="button"
        onClick={() => onChange('pan')}
        aria-pressed={mode === 'pan'}
        aria-label={panLabel}
        className={`grid w-14.75 place-items-center transition-colors ${
          mode === 'pan' ? 'bg-almond-milk text-dark-lava' : 'text-mocha hover:text-dark-lava'
        }`}
      >
        <HandIcon className="h-7 w-7" />
      </button>
    </div>
  )
}

export default MapToolbar