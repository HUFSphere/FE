// 기능 상세 보기 페이지
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import { CheckCircleIcon, GithubIcon, LinkIcon } from '../../components/ui/icons/FeatureIcon'
import { mockFeatureDetail } from '../../mocks/featuredetail'

const SOURCE_LABEL = {
  github: 'Github',
  figma: 'Figma',
  notion: 'Notion',
} as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

function FeatureDetail() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language === 'en' ? 'en' : 'ko'
  const feature = mockFeatureDetail

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-366"
    >
      {/* 기능 상세 보기 제목과 질문하기 버튼 */}
      <motion.div variants={fadeUp} className="mb-3.5 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-dark-lava">
          {t('featureDetail.breadcrumb')}
        </h1>
        <button
          type="button"
          onClick={() => navigate('/qa')}
          className="h-9.5 w-50 shrink-0 rounded-[10px] bg-charcoal text-sm font-bold text-milk"
        >
          {t('featureDetail.ask')}
        </button>
      </motion.div>

      {/* 요약 카드 */}
      <motion.section variants={fadeUp} className="mb-2 rounded-[10px] bg-almond-milk px-5 pt-5 pb-6">
        <div className="mb-2.5 flex items-center gap-2.5">
          <GithubIcon className="h-6 w-6 shrink-0 text-dark-lava" />
          <h2 className="text-xl font-semibold text-dark-lava">{feature.title[lang]}</h2>

          {/* 진행도  상태 */}
          <div className="mr-6.75 ml-auto flex h-12.5 w-50 items-center justify-center gap-3 rounded-lg bg-milk">
            <span className="text-lg font-bold text-dark-lava">{feature.progress}%</span>
            <span className="h-6 w-0.5 rounded-full bg-mocha" />
            <StatusBadge status={feature.status} />
          </div>
        </div>

        <p className="mx-6.75 whitespace-pre-line rounded-lg bg-milk px-6 py-4 text-sm leading-relaxed text-taupe">
          {feature.summary[lang]}
        </p>
      </motion.section>

      {/* 연결된 항목 */}
      <motion.section variants={fadeUp} className="mb-2 rounded-[10px] bg-oat px-5 pt-5 pb-6">
        <div className="mb-4.5 flex items-center gap-2.5">
          <LinkIcon className="h-6 w-6 shrink-0 text-dark-lava" />
          <h2 className="text-xl font-bold text-dark-lava">{t('featureDetail.linked')}</h2>
        </div>

        <motion.ul
          variants={staggerParent(0.08)}
          initial="hidden"
          animate="show"
          className="mx-6.75 flex flex-col gap-1.75"
        >
          {feature.linked.map((item) => (
            <motion.li
              key={item.id}
              variants={fadeUp}
              className="flex h-20 items-center gap-6 rounded-lg bg-milk px-7.5"
            >
              <div className="min-w-0 flex-1">
                <p className="mb-1 truncate text-lg font-semibold text-charcoal">{item.title[lang]}</p>
                <p className="text-sm font-semibold text-mocha">{item.meta[lang]}</p>
              </div>
              <a
                href={item.url}
                className="shrink-0 text-base text-taupe underline underline-offset-4 hover:text-dark-lava"
              >
                {t('featureDetail.viewOn', { source: SOURCE_LABEL[item.source] })}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      {/* 연결 근거 */}
      <motion.section variants={fadeUp} className="rounded-[10px] bg-almond-milk px-5 pt-5 pb-6">
        <div className="mb-2.5 flex items-center gap-2.5">
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-charcoal" />
          <h2 className="text-xl font-bold text-charcoal">{t('featureDetail.evidence')}</h2>
        </div>

        <p className="mx-6.75 whitespace-pre-line rounded-lg bg-milk px-6 py-4 text-sm leading-relaxed text-taupe">
          {feature.evidence[lang]}
        </p>
      </motion.section>
    </motion.div>
  )
}

export default FeatureDetail