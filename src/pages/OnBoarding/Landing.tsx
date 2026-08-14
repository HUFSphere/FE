//랜딩페이지

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import LandingDecor from '../../components/ui/decor/LandingDecor'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'

/* 3가지 sources */
const SOURCES = [
  { id: 'github', label: 'GITHUB', pill: 'bg-dark-lava' },
  { id: 'notion', label: 'NOTION', pill: 'bg-mocha' },
  { id: 'figma', label: 'FIGMA', pill: 'bg-taupe' },
] as const

const PROBLEM_IDS = ['1', '2', '3'] as const

/* 기능 카드 틀 구현 */
function FeatureCard({ id, children }: { id: '1' | '2' | '3'; children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <article className="flex flex-col rounded-[10px] bg-white p-6.25">
      <p className="mb-1.5 text-base font-semibold text-taupe">{t(`landing.features.${id}.kicker`)}</p>
      <h3 className="mb-4.5 text-[27px] font-extrabold tracking-tight text-dark-lava">
        {t(`landing.features.${id}.title`)}
      </h3>
      <p className="mb-6.5 whitespace-pre-line text-base font-medium leading-relaxed text-mocha">
        {t(`landing.features.${id}.desc`)}
      </p>
      <hr className="mb-5.5 border-almond-milk" />
      {children}
    </article>
  )
}

/* 랜딩 페이지-1 */
function PageOne() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-[501fr_996fr] items-center gap-35">
      {/* 좌측 구현 */}
      <div>
        <div className="mb-4 flex items-center gap-5.5">
          <img src="/linkboard_icon.svg" alt="" aria-hidden className="h-25 w-25" />
          <span className="text-[56px] font-extrabold tracking-tight text-mocha">LinkBoard</span>
        </div>

        <h1 className="mb-8 w-max whitespace-pre-line text-[72px] font-extrabold leading-[1.19] tracking-tight text-dark-lava">
          {t('landing.headline')}
        </h1>

        <p className="mb-9 whitespace-pre-line break-keep text-xl font-semibold leading-relaxed text-mocha">
          {t('landing.lede')}
        </p>

        <ul className="flex flex-col gap-5.25">
          {SOURCES.map((s) => (
            <li key={s.id} className="flex items-center gap-5.5">
              <span
                className={`grid h-12.25 w-34.75 shrink-0 place-items-center rounded-[10px] text-[25px] font-medium text-milk ${s.pill}`}
              >
                {s.label}
              </span>
              <span className="break-keep text-[20px] font-bold text-mocha">
                {t(`landing.sources.${s.id}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 우측 지도 예시 사진 삽입 */}
      <div className="aspect-[996/600] overflow-hidden rounded-[7px] border-[3px] border-dark-lava">
        <img
          src="/example_map.png"
          alt={t('landing.shotAlt')}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

/* 랜딩 페이지-2 */
function PageTwo() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-[531fr_1077fr] gap-10">
        <div>
          <p className="mb-3 text-[20px] font-extrabold text-taupe">{t('landing.problem.kicker')}</p>
          <h2 className="whitespace-pre-line text-[45px] font-black leading-tight tracking-tight text-dark-lava">
            {t('landing.problem.title')}
          </h2>
        </div>

        <ul className="flex flex-col gap-5">
          {PROBLEM_IDS.map((id) => (
            <li key={id} className="flex items-center gap-4.5">
              <span className="grid h-[45px] w-[45px] shrink-0 -translate-y-0.5 place-items-center rounded-[10px] bg-mocha text-[20px] font-medium text-milk">
                0{id}
              </span>
              <span className="whitespace-nowrap text-[19px] font-semibold leading-none tracking-tight text-dark-lava">
                {t(`landing.problem.items.${id}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 기능 카드 구현 */}
      <div className="grid grid-cols-3 gap-25">
        {/* 기능 01 */}
        <FeatureCard id="1">
          <ul className="flex flex-col gap-1.5">
            {SOURCES.map((s) => (
              <li key={s.id} className="flex items-center gap-5.5">
                <span
                  className={`grid h-7.25 w-22.25 shrink-0 place-items-center rounded-[9px] text-[13px] font-bold text-milk ${s.pill}`}
                >
                  {s.label}
                </span>
                <span className="text-[15px] font-semibold text-mocha">
                  {t(`landing.features.1.rows.${s.id}`)}
                </span>
              </li>
            ))}
          </ul>
        </FeatureCard>

        {/* 기능 02 */}
        <FeatureCard id="2">
          <p className="mb-4.5 text-[19px] font-bold text-dark-lava">{t('landing.features.2.question')}</p>
          <ul className="flex flex-col gap-1.5">
            {(['github', 'notion'] as const).map((id) => (
              <li
                key={id}
                className="flex h-7.25 items-center gap-2 rounded-[9px] bg-mocha px-3 text-[13px] font-semibold text-milk"
              >
                <b className="font-extrabold">{id === 'github' ? 'GITHUB' : 'NOTION'}</b>
                <span>{t(`landing.features.2.rows.${id}`)}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>

        {/* 기능 03 */}
        <FeatureCard id="3">
          <ul className="flex flex-col gap-1.25">
            {(['1', '2', '3'] as const).map((id) => (
              <li key={id} className="flex items-center gap-3">
                <span className="flex-1 text-[15px] font-semibold text-mocha">
                  {t(`landing.features.3.rows.${id}`)}
                </span>
                <StatusBadge status={id === '3' ? 'progress' : 'done'} />
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>

      {/* 하단 차콜 카드 */}
      <div className="flex items-center gap-15 rounded-[10px] bg-charcoal px-7.75 py-11">
        <div className="flex-1">
          <h3 className="mb-3.5 whitespace-pre-line text-[32px] font-extrabold leading-tight tracking-tight text-milk">
            {t('landing.cta.title')}
          </h3>
          <p className="break-keep text-[15px] font-medium text-oat">{t('landing.cta.desc')}</p>
        </div>

        <div className="ml-auto flex gap-16">
          {(['member', 'leader'] as const).map((id) => (
            <div key={id} className="max-w-[350px]">
              <p className="mb-0.5 text-[25px] font-bold text-milk">{t(`landing.cta.roles.${id}.title`)}</p>
              <p className="break-keep text-[15px] font-medium leading-snug text-oat">
                {t(`landing.cta.roles.${id}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/sign-in')}
          className="h-15 w-65 shrink-0 rounded-full bg-oat px-6 text-[20px] font-black text-charcoal"
        >
          {t('landing.cta.button')}
        </button>
      </div>
    </div>
  )
}

/* 스크롤 구현하기 */
function Landing() {
  const sceneRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  })

  const END = 0.7

  const p1Scale = useTransform(scrollYProgress, [0, END], [1, 0.96])
  const p1Y = useTransform(scrollYProgress, [0, END], ['0%', '-4%'])

  const p2Y = useTransform(scrollYProgress, [0, END], ['100%', '0%'])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div className="bg-milk">
      <div ref={sceneRef} className="relative h-[180vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 랜딩 페이지-1 에서 시작 */}
          <motion.div
            style={{ scale: p1Scale, y: p1Y }}
            className="absolute inset-0 grid place-items-center bg-milk"
          >
            <div className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-480">
              <LandingDecor />
            </div>
            <div className="relative w-full max-w-480 px-27.25">
              <PageOne />
            </div>
          </motion.div>

          {/* 랜딩 페이지-2를 위로 덮음 */}
          <motion.div
            style={{ y: p2Y }}
            className="absolute inset-0 z-10 grid place-items-center bg-milk"
          >
            <div className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-480">
              <LandingDecor />
            </div>
            <div className="relative w-full max-w-480 px-27.25">
              <PageTwo />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 스크롤 표식 */}
      <motion.div
        style={{ opacity: hintOpacity }}
        aria-hidden
        className="pointer-events-none fixed bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-semibold tracking-wide text-taupe"
      >
        SCROLL
        <span className="block h-6.5 w-px bg-gradient-to-b from-taupe to-transparent" />
      </motion.div>
    </div>
  )
}

export default Landing