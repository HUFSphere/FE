// 챗봇 Q&A 페이지
import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SearchIcon, WarningIcon } from '../../components/ui/icons/FeatureIcon'
import { getWorkItems } from '../../api/workItems'
import type { WorkItem } from '../../api/workItems'
import { askQuestion } from '../../api/qna'
import type { QnaResponse } from '../../api/qna'
import { getMyInfo } from '../../api/auth'
import type { NativeLang } from '../../api/auth'
import { getWorkspaceId } from '../../utils/workspaceStorage'

/* 후속 질문 카드 묶음 폭 */
const SUGGESTION_WIDTH = 'max-w-full'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 질문 카드 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2.5 text-xl font-semibold text-dark-lava">{children}</h2>
}

/* 질문 범위 */
function ScopeButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-7.5 shrink-0 items-center rounded-full border-2 px-3.5 text-sm font-semibold transition-colors ${
        selected
          ? 'border-charcoal bg-charcoal text-milk'
          : 'border-taupe bg-milk text-taupe hover:border-mocha hover:text-mocha'
      }`}
    >
      {children}
    </button>
  )
}

function QA() {
  const { t } = useTranslation()
  const workspaceId = getWorkspaceId()
  const location = useLocation()

  /* 범위 선택 — 개별 선택이 비면 '프로젝트 전체'가 켜지도록 */
  const [scopeItems, setScopeItems] = useState<WorkItem[]>([])
  const [scopes, setScopes] = useState<number[]>([])
  const [scopeQuery, setScopeQuery] = useState('')
  const [question, setQuestion] = useState('')

  const [nativeLang, setNativeLang] = useState<NativeLang | ''>('')
  const [answer, setAnswer] = useState<QnaResponse | null>(null)
  const [isAsking, setIsAsking] = useState(false)
  const [askError, setAskError] = useState<string | null>(null)
  const [hoveredNormId, setHoveredNormId] = useState<number | null>(null)
  const [selectedItemsCache, setSelectedItemsCache] = useState<WorkItem[]>([])
  const [showScopeDropdown, setShowScopeDropdown] = useState(false)
  const scopeBoxRef = useRef<HTMLDivElement>(null)

  /* 검색어 입력 시에만 후보 검색 (작업이 많을 수 있어 검색어 없이는 목록을 안 불러옴) */
  useEffect(() => {
    if (!workspaceId) return
    const query = scopeQuery.trim()
    if (!query) {
      setScopeItems([])
      return
    }
    const handle = setTimeout(() => {
      getWorkItems(workspaceId, { query, size: 20 })
        .then((page) => setScopeItems(page.items))
        .catch(() => {})
    }, 250) // 타이핑 중 매 글자마다 요청 나가지 않도록 디바운스
    return () => clearTimeout(handle)
  }, [workspaceId, scopeQuery])

  useEffect(() => {
    getMyInfo()
      .then((me) => setNativeLang(me.nativeLang))
      .catch(() => {})
  }, [])

  /* 대시보드의 AI 추천 질문 카드에서 넘어온 경우 질문칸에 미리 채워넣음 */
  useEffect(() => {
    const state = location.state as { presetQuestion?: string } | null
    if (state?.presetQuestion) {
      setQuestion(state.presetQuestion)
    }
  }, [location.state])

  /* 드롭다운 바깥 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scopeBoxRef.current && !scopeBoxRef.current.contains(e.target as Node)) {
        setShowScopeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const isAll = scopes.length === 0

  const toggleScope = (item: WorkItem) => {
    setScopes((prev) =>
      prev.includes(item.id) ? prev.filter((s) => s !== item.id) : [...prev, item.id],
    )
    setSelectedItemsCache((prev) =>
      prev.some((p) => p.id === item.id) ? prev : [...prev, item]
    )
  }

  const selectedChips = selectedItemsCache.filter((s) => scopes.includes(s.id))
  const dropdownCandidates = scopeItems.filter((s) => !scopes.includes(s.id))

  const ask = async () => {
    if (!question.trim() || !workspaceId || !nativeLang) return
    setIsAsking(true)
    setAskError(null)
    try {
      const data = await askQuestion(workspaceId, {
        question,
        lang: nativeLang,
        contextWorkItemIds: isAll ? undefined : scopes,
      })
      setAnswer(data)
    } catch {
      setAskError('답변을 가져오지 못했습니다.')
    } finally {
      setIsAsking(false)
    }
  }

  const handleQuestionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 전송, Shift+Enter는 줄바꿈
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ask()
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-369.25"
    >
      <motion.h1 variants={fadeUp} className="mb-4 text-2xl font-extrabold tracking-tight text-dark-lava">
         {t('qa.title')}
      </motion.h1>

      <motion.div variants={staggerParent(0.1)} className="grid grid-cols-[914fr_532fr] gap-7.75">
        {/* 왼쪽 카드 두 가지 */}
        <div className="flex h-full flex-col gap-2">
          {/* 질문 범위  입력 */}
          <motion.section variants={fadeUp} className="rounded-[10px] bg-almond-milk px-5 pt-4.5 pb-6">
            <div className="mb-2.5 flex items-center gap-3">
              <CardTitle>{t('qa.scope')}</CardTitle>

              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                {/* 범위 선택 - 프로젝트 전체. 누르면 개별 선택을 모두 해제하도록 */}
                <ScopeButton selected={isAll} onClick={() => setScopes([])}>
                  {t('qa.scopeAll')}
                </ScopeButton>

                {selectedChips.map((s) => (
                  <ScopeButton
                    key={s.id}
                    selected={scopes.includes(s.id)}
                    onClick={() => toggleScope(s)}
                  >
                    {s.title}
                  </ScopeButton>
                ))}
              </div>
            </div>

            {/* 기능 검색 */}
            <div className="relative mb-3" ref={scopeBoxRef}>
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-mocha" />
              <input
                type="search"
                value={scopeQuery}
                onChange={(e) => setScopeQuery(e.target.value)}
                onFocus={() => setShowScopeDropdown(true)}
                placeholder={t('qa.searchFeature')}
                className="h-8.5 w-full rounded-[9px] border-2 border-taupe bg-milk pr-4 pl-11 text-sm font-semibold text-dark-lava placeholder-taupe focus:border-mocha focus:outline-none"
              />
              {showScopeDropdown && scopeQuery.trim() && dropdownCandidates.length > 0 && (
                <ul className="absolute top-full left-0 z-10 mt-1.5 max-h-48 w-full overflow-y-auto rounded-[9px] border-2 border-taupe bg-milk py-1.5 shadow-lg">
                  {dropdownCandidates.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          toggleScope(item)
                          setScopeQuery('')
                          setShowScopeDropdown(false)
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-dark-lava hover:bg-oat"
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 질문 입력 */}
            <label htmlFor="qa-question" className="mb-2.5 block text-base font-bold text-dark-lava">
              {t('qa.askLabel')}
            </label>
            <textarea
              id="qa-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleQuestionKeyDown}
              className="h-34 w-full resize-none rounded-[9px] border-2 border-taupe bg-milk p-4 text-sm font-medium leading-relaxed text-dark-lava placeholder-taupe focus:border-mocha focus:outline-none"
            />
            {isAsking && <p className="mt-2 text-sm text-taupe">답변 생성 중...</p>}
            {askError && <p className="mt-2 text-sm font-semibold text-red-600">{askError}</p>}
          </motion.section>

          <motion.section variants={fadeUp} className="flex flex-1 flex-col rounded-[10px] bg-oat px-5 pt-4.5 pb-5.5">
            <CardTitle>{t('qa.answer')}</CardTitle>

            <div className="mb-4 h-79.5 overflow-y-auto rounded-[9px] border-2 border-taupe bg-milk p-5 text-base font-medium leading-relaxed whitespace-pre-line text-dark-lava">
              {answer?.answer || (
                <span className="text-taupe">{t('qa.answerPlaceholder')}</span>
              )}
            </div>

            <p className="mb-2.5 text-base font-bold text-dark-lava">{t('qa.evidence')}</p>
            <motion.ul variants={staggerParent(0.06)} className="flex flex-wrap gap-3.5">
              {(answer?.sources ?? []).map((e, i) => (
                <motion.li key={`${e.url}-${i}`} variants={fadeUp}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11.5 items-center rounded-[7px] border-2 border-taupe bg-milk px-6 text-base font-semibold text-dark-lava hover:border-mocha"
                  >
                    {e.title}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        </div>

        {/* 오른쪽 카드들 */}
        <div className="flex h-full flex-col gap-3.5">
          {/* 팀 관행 분석 */}
          <motion.section variants={fadeUp} className="rounded-[10px] bg-mocha px-6.5 pt-5 pb-5">
            <h2 className="mb-3 text-xl font-bold text-milk">{t('qa.practices')}</h2>

            <motion.ul variants={staggerParent(0.08)} className="mb-3.5 flex flex-col gap-2.5">
              {Array.from({ length: 3 }, (_, i) => answer?.relatedTeamNorms[i] ?? null).map((p, i) =>
                p ? (
                  <motion.li
                    key={p.id}
                    variants={fadeUp}
                    className="relative rounded-lg bg-milk px-4.5 py-3.5"
                    onMouseEnter={() => setHoveredNormId(p.id)}
                    onMouseLeave={() => setHoveredNormId((prev) => (prev === p.id ? null : prev))}
                  >
                    <p className="mb-1.5 text-sm font-semibold whitespace-pre-line text-charcoal">
                      {p.content}
                    </p>
                    <span className="text-sm text-mocha underline underline-offset-3 decoration-dotted">
                      {t('qa.viewEvidence')}
                    </span>
                    {hoveredNormId === p.id && (
                      <div className="absolute top-full left-0 z-10 mt-1.5 w-full rounded-lg bg-charcoal px-3.5 py-2.5 text-sm font-medium text-milk shadow-lg">
                        {p.reason}
                      </div>
                    )}
                  </motion.li>
                ) : (
                  <motion.li
                    key={`empty-${i}`}
                    variants={fadeUp}
                    className="h-14.5 rounded-lg border-2 border-dashed border-milk/40 bg-transparent"
                  />
                ),
              )}
            </motion.ul>

            {/* 주의 문구 */}
            <div className="flex items-start gap-2">
              <WarningIcon
                className="mt-1 h-5 w-5 shrink-0"
                triangleClassName="text-milk"
                markClassName="text-mocha"
              />
              <p className="text-sm font-semibold leading-snug whitespace-pre-line text-milk">
                {t('qa.disclaimer')}
              </p>
            </div>
          </motion.section>
          
          {/* 후속 질문 제안 */}
          <motion.section variants={fadeUp} className="flex flex-col rounded-[10px] bg-almond-milk px-6.5 pt-5 pb-6">
            <h2 className="mb-7 text-xl font-semibold text-dark-lava">{t('qa.suggestions')}</h2>
            <motion.ul
              variants={staggerParent(0.06)}
              className={`flex w-full ${SUGGESTION_WIDTH} flex-col gap-2.5`}
            >
              {Array.from({ length: 4 }, (_, i) => answer?.followUpQuestions[i] ?? null).map((s, i) =>
                s ? (
                  <motion.li key={i} variants={fadeUp}>
                    <button
                      type="button"
                      onClick={() => setQuestion(s)}
                      className="h-13 w-full rounded-lg bg-milk px-4 text-sm font-semibold text-mocha hover:bg-oat"
                    >
                      {s}
                    </button>
                  </motion.li>
                ) : (
                  <motion.li
                    key={`empty-${i}`}
                    variants={fadeUp}
                    className="h-13 w-full rounded-lg border-2 border-dashed border-taupe/40 bg-transparent"
                  />
                ),
              )}
            </motion.ul>
          </motion.section>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QA