// 기능 목록 페이지
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import type { Status } from '../../components/ui/StatusBadge/Statusbadge'
import { ChevronDownIcon, SearchIcon, SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import { mockFeatureList } from '../../mocks/features'
import type { SourceKind } from '../../mocks/featuredetail'

const STATUS_OPTIONS: Status[] = ['todo', 'progress', 'review', 'done', 'blocked']

const SOURCE_OPTIONS: { value: SourceKind; label: string }[] = [
  { value: 'github', label: 'Github' },
  { value: 'figma', label: 'Figma' },
  { value: 'notion', label: 'Notion' },
]

/* 제목 + 드롭다운 */
function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div className="w-64.5 shrink-0">
      <p className="mb-1.5 text-lg font-bold text-dark-lava">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11.5 w-full appearance-none rounded-[9px] border-2 border-taupe bg-milk pr-10 pl-4 text-base font-semibold focus:outline-none focus:border-mocha ${
            value ? 'text-dark-lava' : 'text-taupe' 
          }`}
        >
          <option value="">{t('featureList.selectPlaceholder')}</option>
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2 text-taupe" />
      </div>
    </div>
  )
}

function FeatureList() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language === 'en' ? 'en' : 'ko'

  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockFeatureList.filter((item) => {
      if (status && item.status !== status) return false
      if (source && item.source !== source) return false
      if (!q) return true
      return (
        item.title[lang].toLowerCase().includes(q) || item.meta[lang].toLowerCase().includes(q)
      )
    })
  }, [status, source, query, lang])

  return (
    <div className="mx-auto w-full max-w-[1464px]">
      <h1 className="mb-4 text-[28px] font-extrabold tracking-tight text-dark-lava">
        {t('featureList.title')}
      </h1>

      {/* 상태 + 플랫폼 */}
      <div className="mb-4 flex items-end gap-2">
        <FilterSelect label={t('featureList.status')} value={status} onChange={setStatus}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect label={t('featureList.platform')} value={source} onChange={setSource}>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </FilterSelect>

        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-mocha" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('featureList.search')}
            className="h-11.5 w-full rounded-[9px] border-2 border-taupe bg-milk pr-4 pl-11 text-base font-medium text-dark-lava placeholder-taupe focus:outline-none focus:border-mocha"
          />
        </div>
      </div>

      {/* 기능 목록 + 상세보기 버튼 */}
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const Icon = SOURCE_ICON[item.source]
          return (
            <li
              key={item.id}
              className="flex h-25 items-center gap-4.5 rounded-[10px] bg-oat pr-4.75 pl-4.5"
            >
              <Icon className="h-6 w-6 shrink-0 text-charcoal" />

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2.5">
                  <p className="truncate text-xl font-bold text-charcoal">{item.title[lang]}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="truncate text-[15px] font-semibold text-charcoal">{item.meta[lang]}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/features/${item.id}`)}
                className="h-12 w-35 shrink-0 rounded-[8px] bg-charcoal text-[15px] font-bold text-milk"
              >
                {t('featureList.detail')}
              </button>
            </li>
          )
        })}

        {items.length === 0 && (
          <li className="flex h-25 items-center justify-center rounded-[10px] bg-oat text-base font-medium text-mocha">
            {t('featureList.empty')}
          </li>
        )}
      </ul>
    </div>
  )
}

export default FeatureList