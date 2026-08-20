// 프로젝트 현황 페이지

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import FigmaIcon from '../../components/ui/icons/FigmaIcon'
import GithubIcon from '../../components/ui/icons/GithubIcon'
import NotionIcon from '../../components/ui/icons/NotionIcon'
import ChatBubbleIcon from '../../components/ui/icons/ChatBubbleIcon'
import { getUiLang } from '../../utils/lang'
import { toUiStatus } from '../../utils/statusMap'
import { getWorkspaceId } from '../../utils/workspaceStorage'
import {
  getFeatureDashboard,
  getSourceDashboard,
  getRecentActivities,
  getSuggestedQuestions,
} from '../../api/dashboard'
import type { FeatureProgress, SourceCard, RecentActivity } from '../../api/dashboard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 기능별 막대 색상 */
const FEATURE_COLORS = ['bg-taupe', 'bg-mocha', 'bg-charcoal']

const AXIS_TICKS = [0, 20, 40, 60, 80, 100]

/* 소스별 아이콘 컴포넌트 */
const SOURCE_ICONS: Record<string, typeof FigmaIcon> = {
  figma: FigmaIcon,
  github: GithubIcon,
  notion: NotionIcon,
}

/* 상단 브레드크럼 */
function Breadcrumb() {
  const { t } = useTranslation()
  return (
    <motion.h1
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-2xl font-bold text-dark-lava"
    >
      <Link to="/map" className="hover:underline">
        {t('projectStatus.breadcrumbMap')}
      </Link>{' '}
      <span className="text-taupe">&gt;</span> {t('projectStatus.breadcrumbCurrent')}
    </motion.h1>
  )
}

/* 막대그래프 카드 */
function BarChartCard({ features }: { features: FeatureProgress[] }) {
  return (
    <motion.div variants={fadeUp} className="py-6">
      {/* 눈금 */}
      <div className="mb-4 flex justify-between pr-20 text-sm font-medium text-taupe">
        {AXIS_TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      {/* 점선 세로 격자선 + 막대  */}
      <div className="relative pr-20">
        <div className="absolute inset-0 grid grid-cols-5">
          {AXIS_TICKS.slice(1).map((tick) => (
            <div key={tick} className="border-l border-dashed border-taupe/40" />
          ))}
        </div>

        <motion.div
          variants={staggerParent(0.15, 0.2)}
          initial="hidden"
          animate="show"
          className="relative flex flex-col gap-8 py-8"
        >
          {features.map((f, i) => {
            const percent = Math.round(f.progress * 100)
            return (
              <motion.div key={f.featureId} variants={fadeUp} className="relative h-12">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                  className={`h-full rounded-r-full ${FEATURE_COLORS[i % FEATURE_COLORS.length]}`}
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                  style={{ left: `${percent}%` }}
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-4 text-xl font-semibold text-dark-lava"
                >
                  {percent}%
                </motion.span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex justify-center gap-6">
        {features.map((f, i) => (
          <div key={f.featureId} className="flex items-center gap-2 text-sm font-medium text-dark-lava">
            <span className={`h-3 w-3 rounded-sm ${FEATURE_COLORS[i % FEATURE_COLORS.length]}`} />
            {f.name}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* 소스 선택 탭 (Figma / Github / Notion) */
function SourceTabs({
  sources,
  active,
  onChange,
}: {
  sources: SourceCard[]
  active: string
  onChange: (key: string) => void
}) {
  const uniqueSources = sources.filter(
    (s, i) => sources.findIndex((x) => x.sourceType.toLowerCase() === s.sourceType.toLowerCase()) === i,
  )

  return (
    <motion.div variants={fadeUp} className="flex gap-3">
      {uniqueSources.map((s) => (
        <button
          key={s.sourceId}
          onClick={() => onChange(s.sourceType.toLowerCase())}
          className={`rounded-full border px-6 py-2 text-center text-base font-bold capitalize transition-colors ${
            active === s.sourceType.toLowerCase()
              ? 'border-mocha bg-taupe text-milk'
              : 'border-mocha bg-milk text-dark-lava hover:bg-oat/60'
          }`}
        >
          {s.sourceType.toLowerCase()}
        </button>
      ))}
    </motion.div>
  )
}

/* 최근 활동 카드 */
function RecentActivityCard({ activities }: { activities: RecentActivity[] }) {
  const { t } = useTranslation()

  return (
    <motion.div variants={fadeUp} className="rounded-[10px] bg-almond-milk p-6">
      <h2 className="mb-5 text-2xl font-bold text-dark-lava">{t('projectStatus.recentActivity')}</h2>
      <motion.ul variants={staggerParent(0.08)} initial="hidden" animate="show" className="flex flex-col gap-4">
        {activities.map((item) => {
          const Icon = SOURCE_ICONS[item.sourceType.toLowerCase()]
          return (
            <motion.li key={item.workItemId} variants={fadeUp} className="flex items-center justify-between">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-lg font-bold text-dark-lava hover:underline"
              >
                {Icon && <Icon className="h-5 w-5 text-dark-lava" />}
                {item.title}
              </a>
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.div>
  )
}

/* 우측: 소스 상세 패널 */
function SourceDetailPanel({ source }: { source: SourceCard }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const percent = Math.round(source.progress * 100)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={source.sourceId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="rounded-[10px] bg-oat p-6"
      >
        <h2 className="mb-1 text-xl font-bold capitalize text-dark-lava">
          {source.sourceType.toLowerCase()}
        </h2>
        <p className="mb-4 text-sm text-taupe">{source.sourceRef}</p>

        {/* 진행도 */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-dark-lava">
            <span>{t('projectStatus.overallProgress')}</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-milk">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-mocha"
            />
          </div>
          <p className="mt-1 text-xs text-taupe">
            {source.doneCount} / {source.totalCount}
          </p>
        </div>

        {/* 최근 이슈 */}
        <p className="mb-2 text-sm font-semibold text-dark-lava">{t('projectStatus.recentIssues')}</p>
        <motion.div variants={staggerParent(0.1)} initial="hidden" animate="show" className="mb-3 flex flex-col gap-2">
          {source.recentIssues.map((issue) => (
            <motion.a
              key={issue.workItemId}
              href={issue.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="rounded-lg border border-taupe/50 bg-milk p-3.5 hover:border-mocha"
            >
              <p className="mb-1 text-sm font-bold text-dark-lava">{issue.title}</p>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  toUiStatus(issue.status) === 'done'
                    ? 'bg-mocha text-milk'
                    : 'bg-taupe/30 text-mocha'
                }`}
              >
                {issue.status}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/qa')}
            className="flex-1 rounded-[10px] border border-mocha bg-taupe py-2.5 text-sm font-bold text-milk"
          >
            {t('projectStatus.askAbout', { source: source.sourceType })}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* 우측: AI 추천 질문 패널 */
function AIQuestionsPanel({ questions }: { questions: string[] }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <motion.div variants={fadeUp} className="rounded-[10px] bg-dark-lava p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-milk">
        <ChatBubbleIcon className="h-6 w-6 text-milk" />
        {t('projectStatus.aiRecommendedQuestions')}
      </h2>
      <motion.div variants={staggerParent(0.1, 0.2)} initial="hidden" animate="show" className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <motion.button
            key={q}
            variants={fadeUp}
            type="button"
            onClick={() => navigate('/qa', { state: { presetQuestion: q } })}
            className="rounded-[10px] bg-taupe px-4 py-3 text-left text-sm font-medium text-milk transition-colors hover:bg-taupe/80"
          >
            {q}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ProjectStatus() {
  const { i18n } = useTranslation()
  const lang = getUiLang(i18n.language)
  const workspaceId = getWorkspaceId()

  const [features, setFeatures] = useState<FeatureProgress[]>([])
  const [sources, setSources] = useState<SourceCard[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [questions, setQuestions] = useState<string[]>([])
  const [activeSourceType, setActiveSourceType] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setLoadError('워크스페이스 정보가 없습니다.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    Promise.all([
      getFeatureDashboard(workspaceId),
      getSourceDashboard(workspaceId),
      getRecentActivities(workspaceId),
      getSuggestedQuestions(workspaceId, lang),
    ])
      .then(([f, s, a, q]) => {
        setFeatures(f)
        setSources(s)
        setActivities(a)
        setQuestions(q)
        if (s.length > 0) setActiveSourceType(s[0].sourceType.toLowerCase())
      })
      .catch(() => setLoadError('현황판을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [workspaceId, lang])

  const activeSource = sources.find((s) => s.sourceType.toLowerCase() === activeSourceType)

  if (isLoading) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">불러오는 중...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">{loadError}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.12)}
      className="grid grid-cols-[1fr_420px] gap-8 bg-milk p-10"
    >
      {/* 좌측 메인 */}
      <div className="flex flex-col gap-6">
        <Breadcrumb />
        {features.length > 0 && <BarChartCard features={features} />}
        {sources.length > 0 && (
          <SourceTabs sources={sources} active={activeSourceType} onChange={setActiveSourceType} />
        )}
        <RecentActivityCard activities={activities} />
      </div>

      {/* 우측 사이드 */}
      <div className="flex flex-col gap-6">
        {activeSource && <SourceDetailPanel source={activeSource} />}
        <AIQuestionsPanel questions={questions} />
      </div>
    </motion.div>
  )
}

export default ProjectStatus