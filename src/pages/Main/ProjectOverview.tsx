// 프로젝트 현황 페이지

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import FigmaIcon from '../../components/ui/icons/FigmaIcon'
import GithubIcon from '../../components/ui/icons/GithubIcon'
import NotionIcon from '../../components/ui/icons/NotionIcon'
import ChatBubbleIcon from '../../components/ui/icons/ChatBubbleIcon'
import { getUiLang } from '../../utils/lang'
import {
  mockFeatures,
  mockSources,
  mockRecentActivity,
  mockAiQuestions,
  type SourceKey,
} from '../../mocks/projectStatus'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 언어 선택 헬퍼 */
function useLang(): 'ko' | 'en' {
  const { i18n } = useTranslation()
  return getUiLang(i18n.language)
}

/* 기능별 막대 색상 */
const FEATURE_COLORS: Record<string, string> = {
  A: 'bg-taupe',
  B: 'bg-mocha',
  C: 'bg-charcoal',
}

const AXIS_TICKS = [0, 20, 40, 60, 80, 100]

/* 소스별 아이콘 컴포넌트 */
const SOURCE_ICONS: Record<SourceKey, typeof FigmaIcon> = {
  figma: FigmaIcon,
  github: GithubIcon,
  notion: NotionIcon,
}

const STATUS_OPTION_KEYS = ['notStarted', 'inProgress', 'done'] as const

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
function BarChartCard() {
  const lang = useLang()

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
          {mockFeatures.map((f) => (
            <motion.div key={f.id} variants={fadeUp} className="relative h-12">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                className={`h-full rounded-r-full ${FEATURE_COLORS[f.id]}`}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                style={{ left: `${f.value}%` }}
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-4 text-xl font-semibold text-dark-lava"
              >
                {f.value}%
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex justify-center gap-6">
        {mockFeatures.map((f) => (
          <div key={f.id} className="flex items-center gap-2 text-sm font-medium text-dark-lava">
            <span className={`h-3 w-3 rounded-sm ${FEATURE_COLORS[f.id]}`} />
            {f.label[lang]}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* 소스 선택 탭 (Figma / Github / Notion) */
function SourceTabs({ active, onChange }: { active: SourceKey; onChange: (key: SourceKey) => void }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-3">
      {(Object.keys(mockSources) as SourceKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-full border px-6 py-2 text-center text-base font-bold transition-colors ${
            active === key
              ? 'border-mocha bg-taupe text-milk'
              : 'border-mocha bg-milk text-dark-lava hover:bg-oat/60'
          }`}
        >
          {mockSources[key].label}
        </button>
      ))}
    </motion.div>
  )
}

/* 최근 활동 카드 */
function RecentActivityCard() {
  const { t } = useTranslation()
  const lang = useLang()

  return (
    <motion.div variants={fadeUp} className="rounded-[10px] bg-almond-milk p-6">
      <h2 className="mb-5 text-2xl font-bold text-dark-lava">{t('projectStatus.recentActivity')}</h2>
      <motion.ul variants={staggerParent(0.08)} initial="hidden" animate="show" className="flex flex-col gap-4">
        {mockRecentActivity.map((item) => {
          const Icon = SOURCE_ICONS[item.source]
          return (
            <motion.li key={item.text.ko} variants={fadeUp} className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-lg font-bold text-dark-lava">
                <Icon className="h-5 w-5 text-dark-lava" />
                {item.text[lang]}
              </span>
              <span className="text-base text-taupe">— {item.time[lang]}</span>
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.div>
  )
}

/* 우측: 소스 상세 패널 */
function SourceDetailPanel({ source }: { source: SourceKey }) {
  const { t } = useTranslation()
  const lang = useLang()
  const data = mockSources[source]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={source}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="rounded-[10px] bg-oat p-6"
      >
        <h2 className="mb-1 text-xl font-bold text-dark-lava">{data.label}</h2>
        <p className="mb-4 text-sm text-taupe">{data.kicker[lang]}</p>

        {/* 상태 배지 */}
        <div className="mb-4 flex gap-2">
          {STATUS_OPTION_KEYS.map((key) => (
            <span
              key={key}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                key === data.status
                  ? 'border-mocha bg-taupe text-milk'
                  : 'border-taupe bg-milk text-taupe'
              }`}
            >
              {t(`projectStatus.statusOptions.${key}`)}
            </span>
          ))}
        </div>

        {/* 진행도 */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-dark-lava">
            <span>{t('projectStatus.overallProgress')}</span>
            <span>{data.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-milk">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-mocha"
            />
          </div>
        </div>

        {/* 최근 이슈 */}
        <p className="mb-2 text-sm font-semibold text-dark-lava">{t('projectStatus.recentIssues')}</p>
        <motion.div variants={staggerParent(0.1)} initial="hidden" animate="show" className="mb-3 flex flex-col gap-2">
          {data.issues.map((issue) => (
            <motion.div key={issue.title.ko} variants={fadeUp} className="rounded-lg border border-taupe/50 bg-milk p-3.5">
              <p className="mb-1 text-sm font-bold text-dark-lava">{issue.title[lang]}</p>
              <p className="whitespace-pre-line text-xs text-taupe">{issue.description[lang]}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mb-3 text-xs text-taupe">{t('projectStatus.connectionBasis')}</p>

        <div className="flex gap-2">
          <button className="flex-1 rounded-[10px] border border-mocha bg-taupe py-2.5 text-sm font-bold text-milk">
            {t('projectStatus.askAbout', { source: data.label })}
          </button>
          <button className="flex-1 rounded-[10px] border border-taupe bg-milk py-2.5 text-sm font-bold text-dark-lava">
            {t('projectStatus.viewIssueList')}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* 우측: AI 추천 질문 패널 */
function AIQuestionsPanel() {
  const { t } = useTranslation()
  const lang = useLang()

  return (
    <motion.div variants={fadeUp} className="rounded-[10px] bg-dark-lava p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-milk">
        <ChatBubbleIcon className="h-6 w-6 text-milk" />
        {t('projectStatus.aiRecommendedQuestions')}
      </h2>
      <motion.div variants={staggerParent(0.1, 0.2)} initial="hidden" animate="show" className="flex flex-col gap-2.5">
        {mockAiQuestions.map((q) => (
          <motion.button
            key={q.ko}
            variants={fadeUp}
            className="rounded-[10px] bg-taupe px-4 py-3 text-left text-sm font-medium text-milk transition-colors hover:bg-taupe/80"
          >
            {q[lang]}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ProjectStatus() {
  const [activeSource, setActiveSource] = useState<SourceKey>('figma')

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
        <BarChartCard />
        <SourceTabs active={activeSource} onChange={setActiveSource} />
        <RecentActivityCard />
      </div>

      {/* 우측 사이드 */}
      <div className="flex flex-col gap-6">
        <SourceDetailPanel source={activeSource} />
        <AIQuestionsPanel />
      </div>
    </motion.div>
  )
}

export default ProjectStatus