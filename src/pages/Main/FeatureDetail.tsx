// 기능 상세 보기 페이지
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import { GithubIcon, LinkIcon } from '../../components/ui/icons/FeatureIcon'
import { getWorkItemDetail } from '../../api/workItems'
import type { WorkItemDetail } from '../../api/workItems'
import { getUiLang } from '../../utils/lang'
import { toUiStatus } from '../../utils/statusMap'

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
  const { featureId } = useParams<{ featureId: string }>()
  const lang = getUiLang(i18n.language)

  const [feature, setFeature] = useState<WorkItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!featureId) {
      setLoadError('잘못된 접근입니다.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setLoadError(null)
    getWorkItemDetail(Number(featureId), lang)
      .then(setFeature)
      .catch(() => setLoadError('기능 정보를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [featureId, lang])

  if (isLoading) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">불러오는 중...</p>
      </div>
    )
  }

  if (loadError || !feature) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">{loadError ?? '기능을 찾을 수 없습니다.'}</p>
      </div>
    )
  }

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
          <h2 className="text-xl font-semibold text-dark-lava">{feature.title}</h2>

          {/* 상태 (API에 진행률(%) 필드가 없어 상태 배지만 표시) */}
          <div className="mr-6.75 ml-auto flex h-12.5 items-center justify-center gap-3 rounded-lg bg-milk px-6">
            <StatusBadge status={toUiStatus(feature.status)} />
            {feature.authorLogin && (
              <span className="text-sm font-medium text-taupe">by {feature.authorLogin}</span>
            )}
          </div>
        </div>

        {feature.summaryNative && (
          <p className="mx-6.75 whitespace-pre-line rounded-lg bg-milk px-6 py-4 text-sm leading-relaxed text-taupe">
            {feature.summaryNative}
          </p>
        )}
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
          {feature.linkedItems.map((item) => (
            <motion.li
              key={item.id}
              variants={fadeUp}
              className="flex h-20 items-center gap-6 rounded-lg bg-milk px-7.5"
            >
              <div className="min-w-0 flex-1">
                <p className="mb-1 truncate text-lg font-semibold text-charcoal">{item.title}</p>
                <p className="text-sm font-semibold text-mocha capitalize">{item.sourceType}</p>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-base text-taupe underline underline-offset-4 hover:text-dark-lava"
              >
                {t('featureDetail.viewOn', { source: item.sourceType })}
              </a>
            </motion.li>
          ))}
          {feature.linkedItems.length === 0 && (
            <li className="py-4 text-center text-sm font-medium text-taupe">
              연결된 항목이 없습니다.
            </li>
          )}
        </motion.ul>
      </motion.section>
    </motion.div>
  )
}

export default FeatureDetail