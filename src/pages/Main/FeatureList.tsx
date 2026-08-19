// 기능 목록 페이지
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import type { Status } from '../../components/ui/StatusBadge/Statusbadge'
import { SearchIcon, SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import Select from '../../components/ui/Select/Select'
import type { SelectOption } from '../../components/ui/Select/Select'
import { getWorkItems } from '../../api/workItems'
import type { WorkItem } from '../../api/workItems'
import { getWorkspaceId } from '../../utils/workspaceStorage'
import { getUiLang } from '../../utils/lang'
import { toUiStatus } from '../../utils/statusMap'

const STATUS_FILTER_OPTIONS: { apiValue: string; uiKey: Status }[] = [
  { apiValue: 'todo', uiKey: 'todo' },
  { apiValue: 'in_progress', uiKey: 'progress' },
  { apiValue: 'review', uiKey: 'review' },
  { apiValue: 'done', uiKey: 'done' },
]


const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'github', label: 'Github' },
  { value: 'figma', label: 'Figma' },
  { value: 'notion', label: 'Notion' },
]

const PAGE_SIZE = 20

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 제목 + 드롭다운 */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
}) {
  const { t } = useTranslation()

  return (
    <motion.div variants={fadeUp} className="w-64.5 shrink-0">
      <p className="mb-1.5 text-lg font-bold text-dark-lava">{label}</p>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        emptyOptionLabel={t('featureList.selectPlaceholder')}
        ariaLabel={label}
      />
    </motion.div>
  )
}

function FeatureList() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = getUiLang(i18n.language)
  const workspaceId = getWorkspaceId()


  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [query, setQuery] = useState('')

  const [items, setItems] = useState<WorkItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  /* 필터(상태/소스/검색어)가 바뀌면 목록을 처음부터 다시 불러옴.
     검색어는 타이핑마다 바로 요청하지 않도록 300ms 지연 */
  useEffect(() => {
    if (!workspaceId) {
      setLoadError('워크스페이스 정보가 없습니다.')
      return
    }

    const timer = setTimeout(() => {
      setLoadError(null)
      loadingRef.current = true
      setIsLoading(true)
      getWorkItems(workspaceId, {
        query: query.trim() || undefined,
        sourceType: source || undefined,
        status: status || undefined,
        page: 1,
        size: PAGE_SIZE,
        lang,
      })
        .then((res) => {
          setItems(res.items)
          setPage(1)
          setTotalPages(res.totalPages)
        })
        .catch(() => setLoadError('기능 목록을 불러오지 못했습니다.'))
        .finally(() => {
          setIsLoading(false)
          loadingRef.current = false
        })
    }, 300)

    return () => clearTimeout(timer)
  }, [workspaceId, status, source, query, lang])

  /* 다음 페이지를 이어서 불러와 기존 목록 뒤에 붙임 */
  const loadMore = useCallback(() => {
    if (!workspaceId || loadingRef.current || page >= totalPages) return
    loadingRef.current = true
    setIsLoading(true)
    const nextPage = page + 1
    getWorkItems(workspaceId, {
      query: query.trim() || undefined,
      sourceType: source || undefined,
      status: status || undefined,
      page: nextPage,
      size: PAGE_SIZE,
      lang,
    })
      .then((res) => {
        setItems((prev) => [...prev, ...res.items])
        setPage(nextPage)
      })
      .catch(() => setLoadError('기능 목록을 불러오지 못했습니다.'))
      .finally(() => {
        setIsLoading(false)
        loadingRef.current = false
      })
  }, [workspaceId, page, totalPages, query, source, status, lang])

  /* 목록 맨 아래 감지용 요소가 화면에 보이면 다음 페이지 로드 */
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-366"
    >
      <motion.h1 variants={fadeUp} className="mb-4 text-2xl font-bold tracking-tight text-dark-lava">
        {t('featureList.title')}
      </motion.h1>

      {/* 상태  플랫폼 */}
      <motion.div variants={staggerParent(0.1)} className="mb-4 flex items-end gap-2">
        <FilterSelect
          label={t('featureList.status')}
          value={status}
          onChange={setStatus}
          options={STATUS_FILTER_OPTIONS.map((s) => ({ value: s.apiValue, label: t(`status.${s.uiKey}`) }))}
        />

        <FilterSelect
          label={t('featureList.platform')}
          value={source}
          onChange={setSource}
          options={SOURCE_OPTIONS}
        />

        <motion.div variants={fadeUp} className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-mocha" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('featureList.search')}
            className="h-11.5 w-full rounded-[9px] border-2 border-taupe bg-milk pr-4 pl-11 text-base font-medium text-dark-lava placeholder-taupe focus:outline-none focus:border-mocha"
          />
        </motion.div>
      </motion.div>

      {loadError && <p className="mb-4 text-sm font-semibold text-red-600">{loadError}</p>}

      {/* 기능 목록 + 상세보기 버튼 */}
      <motion.ul
        key={`${status}-${source}-${query}`}
        initial="hidden"
        animate="show"
        variants={staggerParent(0.06)}
        className="flex flex-col gap-2.5"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const Icon = SOURCE_ICON[item.sourceType.toLowerCase() as keyof typeof SOURCE_ICON]
            return (
              <motion.li
                key={item.id}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, y: -10 }}
                className="flex h-25 items-center gap-4.5 rounded-[10px] bg-oat pr-4.75 pl-4.5"
              >
                {Icon && <Icon className="h-6 w-6 shrink-0 text-charcoal" />}

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2.5">
                    <p className="truncate text-xl font-bold text-charcoal">{item.title}</p>
                    <StatusBadge status={toUiStatus(item.status)} />
                  </div>
                  <p className="truncate text-sm font-bold text-charcoal">{item.sourceType}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/features/${item.id}`)}
                  className="h-9.5 w-30 shrink-0 rounded-lg bg-charcoal text-sm font-bold text-milk"
                >
                  {t('featureList.detail')}
                </button>
              </motion.li>
            )
          })}

          {items.length === 0 && !isLoading && (
            <motion.li
              key="empty"
              variants={fadeUp}
              exit={{ opacity: 0 }}
              className="flex h-25 items-center justify-center rounded-[10px] bg-oat text-base font-medium text-mocha"
            >
              {t('featureList.empty')}
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>

      {/* 무한스크롤 감지 지점 */}
      <div ref={sentinelRef} className="h-1" />
      {isLoading && (
        <p className="py-4 text-center text-sm font-medium text-mocha">불러오는 중...</p>
      )}
    </motion.div>
  )
}

export default FeatureList