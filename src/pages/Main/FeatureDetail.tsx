// 기능 상세 보기 페이지
import { useTranslation } from 'react-i18next'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import { CheckCircleIcon, GithubIcon, LinkIcon } from '../../components/ui/icons/FeatureIcon'
import { mockFeatureDetail } from '../../mocks/featuredetail'

const SOURCE_LABEL = {
  github: 'Github',
  figma: 'Figma',
  notion: 'Notion',
} as const

function FeatureDetail() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ko'
  const feature = mockFeatureDetail

  return (
    <div className="mx-auto w-full max-w-[1464px]">
      {/* 기능 상세 보기 제목과 질문하기 버튼 */}
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold tracking-tight text-charcoal">
          {t('featureDetail.breadcrumb')}
        </h1>
        <button
          type="button"
          className="h-10.5 w-55 shrink-0 rounded-[10px] bg-charcoal text-[15px] font-bold text-milk"
        >
          {t('featureDetail.ask')}
        </button>
      </div>

      {/* 요약 카드 */}
      <section className="mb-2 rounded-[10px] bg-almond-milk px-5 pt-5 pb-6">
        <div className="mb-2.5 flex items-center gap-2.5">
          <GithubIcon className="h-[24px] w-[24px] shrink-0 text-charcoal" />
          <h2 className="text-xl font-semibold text-charcoal">{feature.title[lang]}</h2>

          {/* 진행도 + 상태 */}
          <div className="mr-[27px] ml-auto flex h-12.5 w-50 items-center justify-center gap-3 rounded-[8px] bg-milk">
            <span className="text-lg font-bold text-dark-lava">{feature.progress}%</span>
            <span className="h-6 w-0.5 rounded-full bg-mocha" />
            <StatusBadge status={feature.status} />
          </div>
        </div>

        <p className="mx-[27px] whitespace-pre-line rounded-[8px] bg-milk px-6 py-3.5 text-[15px] font-semibold leading-relaxed text-charcoal">
          {feature.summary[lang]}
        </p>
      </section>

      {/* 연결된 항목 */}
      <section className="mb-2 rounded-[10px] bg-oat px-5 pt-5 pb-6">
        <div className="mb-4.5 flex items-center gap-2.5">
          <LinkIcon className="h-6 w-6 shrink-0 text-charcoal" />
          <h2 className="text-xl font-bold text-charcoal">{t('featureDetail.linked')}</h2>
        </div>

        <ul className="mx-[27px] flex flex-col gap-[7px]">
          {feature.linked.map((item) => (
            <li
              key={item.id}
              className="flex h-20 items-center gap-6 rounded-[8px] bg-milk px-7.5"
            >
              <div className="min-w-0 flex-1">
                <p className="mb-1 truncate text-[20px] font-semibold text-chacoal">{item.title[lang]}</p>
                <p className="text-[16px] font-semibold text-chacoal">{item.meta[lang]}</p>
              </div>
              <a
                href={item.url}
                className="shrink-0 text-[15px] font-semibold text-mocha underline underline-offset-4 hover:text-dark-lava"
              >
                {t('featureDetail.viewOn', { source: SOURCE_LABEL[item.source] })}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 연결 근거 */}
      <section className="rounded-[10px] bg-almond-milk px-5 pt-5 pb-6">
        <div className="mb-2.5 flex items-center gap-2.5">
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-charcoal" />
          <h2 className="text-xl font-bold text-charcoal">{t('featureDetail.evidence')}</h2>
        </div>

        <p className="mx-[27px] whitespace-pre-line rounded-[8px] bg-milk px-6 py-4 text-[15px] font-semibold leading-relaxed text-charcoal">
          {feature.evidence[lang]}
        </p>
      </section>
    </div>
  )
}

export default FeatureDetail