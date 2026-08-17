// 랜딩페이지

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import LandingDecor from '../../components/ui/decor/LandingDecor'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'

const SOURCES = [
  { id: 'github', label: 'GITHUB', pill: 'bg-dark-lava' },
  { id: 'notion', label: 'NOTION', pill: 'bg-mocha' },
  { id: 'figma', label: 'FIGMA', pill: 'bg-taupe' },
] as const

const PROBLEM_IDS = ['1', '2', '3'] as const

const TRANSITION_THRESHOLD = 0.5

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}
const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
}
const pageVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}
const staggerParent = (stagger = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
})

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])

  return isDesktop
}

/* 기능 카드 틀 구현 */
function FeatureCard({ id, children }: { id: '1' | '2' | '3'; children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <motion.article
      variants={fadeUp}
      className="flex flex-col rounded-[10px] bg-white p-[clamp(1.25rem,3vw,1.5625rem)]"
    >
      <p className="mb-1.5 text-base font-semibold text-taupe">{t(`landing.features.${id}.kicker`)}</p>
      <h3 className="mb-4.5 text-[clamp(1.25rem,2.2vw,1.6875rem)] font-extrabold tracking-tight text-dark-lava">
        {t(`landing.features.${id}.title`)}
      </h3>
      <p className="mb-6.5 whitespace-pre-line text-base font-medium leading-relaxed text-mocha">
        {t(`landing.features.${id}.desc`)}
      </p>
      <hr className="mb-5.5 border-almond-milk" />
      {children}
    </motion.article>
  )
}

/* 랜딩 페이지-1 콘텐츠 */
function PageOne({ animateMode }: { animateMode: 'mount' | 'inView' }) {
  const { t } = useTranslation()
  const triggerProps =
    animateMode === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

  return (
    <motion.div
      key="page-1"
      {...triggerProps}
      exit="exit"
      variants={pageVariants}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[501fr_996fr] lg:gap-[clamp(2rem,7vw,8.75rem)]"
    >
      {/* 좌측 구현 */}
      <div>
        <motion.div variants={fadeUp} className="mb-4 flex items-center gap-4 lg:gap-5.5">
          <img
            src="/linkboard_icon.svg"
            alt=""
            aria-hidden
            className="size-[clamp(3.5rem,7vw,6.25rem)]"
          />
          <span className="text-[clamp(1.75rem,4vw,3.5rem)] font-extrabold tracking-tight text-mocha">
            LinkBoard
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-6 w-max whitespace-pre-line text-[clamp(2rem,5.5vw,4.5rem)] font-extrabold leading-[1.19] tracking-tight text-dark-lava lg:mb-8"
        >
          {t('landing.headline')}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-7 whitespace-pre-line break-keep text-[clamp(1rem,1.6vw,1.25rem)] font-semibold leading-relaxed text-mocha lg:mb-9"
        >
          {t('landing.lede')}
        </motion.p>

        <motion.ul variants={staggerParent()} className="flex flex-col gap-4 lg:gap-5.25">
          {SOURCES.map((s) => (
            <motion.li key={s.id} variants={fadeLeft} className="flex items-center gap-4 lg:gap-5.5">
              <span
                className={`grid h-[clamp(2.25rem,3.5vw,3.0625rem)] w-[clamp(6rem,10vw,8.6875rem)] shrink-0 place-items-center rounded-[10px] text-[clamp(0.85rem,1.4vw,1.1875rem)] font-bold text-milk ${s.pill}`}
              >
                {s.label}
              </span>
              <span className="break-keep text-[clamp(0.95rem,1.6vw,1.3125rem)] font-semibold text-mocha">
                {t(`landing.sources.${s.id}`)}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* 우측 지도 예시 사진 삽입 */}
      <motion.div
        variants={fadeScale}
        className="aspect-996/600 w-full overflow-hidden rounded-[7px] border-[3px] border-dark-lava"
      >
        <img
          src="/example_map.png"
          alt={t('landing.shotAlt')}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

/* 랜딩 페이지-2 콘텐츠 */
function PageTwo({ animateMode }: { animateMode: 'mount' | 'inView' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const triggerProps =
    animateMode === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.15 } }

  return (
    <motion.div key="page-2" {...triggerProps} exit="exit" variants={pageVariants} className="flex flex-col gap-8 lg:gap-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[531fr_1077fr] lg:gap-[clamp(1.5rem,5vw,5.9375rem)]">
        <motion.div variants={fadeUp}>
          <p className="mb-3 text-[clamp(1rem,1.4vw,1.25rem)] font-extrabold text-taupe">
            {t('landing.problem.kicker')}
          </p>
          <h2 className="whitespace-pre-line text-[clamp(1.75rem,3.5vw,2.8125rem)] font-black leading-tight tracking-tight text-dark-lava">
            {t('landing.problem.title')}
          </h2>
        </motion.div>

        <motion.ul variants={staggerParent()} className="flex flex-col gap-4 lg:gap-5">
          {PROBLEM_IDS.map((id) => (
            <motion.li key={id} variants={fadeLeft} className="flex items-center gap-3 lg:gap-4.5">
              <span className="grid h-[clamp(2rem,3vw,2.8125rem)] w-[clamp(2.1rem,3.2vw,3rem)] shrink-0 place-items-center rounded-[10px] bg-mocha text-lg font-normal text-milk">
                0{id}
              </span>
              <span className="whitespace-nowrap text-[clamp(0.95rem,1.4vw,1.1875rem)] font-semibold text-dark-lava">
                {t(`landing.problem.items.${id}`)}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* 기능 카드 구현 */}
      <motion.div
        variants={staggerParent(0.12)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[clamp(1.5rem,5vw,6.25rem)]"
      >
        {/* 기능 01 */}
        <FeatureCard id="1">
          <ul className="flex flex-col gap-1.5">
            {SOURCES.map((s) => (
              <li key={s.id} className="flex items-center gap-4 lg:gap-5.5">
                <span
                  className={`grid h-[clamp(1.5rem,2.2vw,1.8125rem)] w-[clamp(4.5rem,7vw,5.5625rem)] shrink-0 place-items-center rounded-[9px] text-[clamp(0.7rem,1vw,0.8125rem)] font-bold text-milk ${s.pill}`}
                >
                  {s.label}
                </span>
                <span className="text-[clamp(0.85rem,1.1vw,0.9375rem)] font-semibold text-mocha">
                  {t(`landing.features.1.rows.${s.id}`)}
                </span>
              </li>
            ))}
          </ul>
        </FeatureCard>

        {/* 기능 02 */}
        <FeatureCard id="2">
          <p className="mb-4.5 text-[clamp(0.95rem,1.4vw,1.1875rem)] font-bold text-dark-lava">
            {t('landing.features.2.question')}
          </p>
          <ul className="flex flex-col gap-1.5">
            {(['github', 'notion'] as const).map((id) => (
              <li
                key={id}
                className="flex h-[clamp(1.5rem,2.2vw,1.8125rem)] items-center gap-2 rounded-[9px] bg-mocha px-3 text-[clamp(0.7rem,1vw,0.8125rem)] font-semibold text-milk"
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
                <span className="flex-1 text-[clamp(0.85rem,1.1vw,0.9375rem)] font-semibold text-mocha">
                  {t(`landing.features.3.rows.${id}`)}
                </span>
                <StatusBadge status={id === '3' ? 'progress' : 'done'} />
              </li>
            ))}
          </ul>
        </FeatureCard>
      </motion.div>

      {/* 하단 차콜 카드 */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-start gap-6 rounded-[10px] bg-charcoal px-[clamp(1.25rem,3vw,1.9375rem)] py-[clamp(1.5rem,3vw,2.75rem)] lg:flex-row lg:items-center lg:gap-[clamp(1.5rem,4vw,3.75rem)]"
      >
        <div className="flex-1">
          <h3 className="mb-3.5 whitespace-pre-line text-[clamp(1.5rem,2.8vw,2rem)] font-extrabold leading-tight tracking-tight text-milk">
            {t('landing.cta.title')}
          </h3>
          <p className="break-keep text-[clamp(0.9rem,1.3vw,1.0625rem)] font-medium text-taupe">
            {t('landing.cta.desc')}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-[clamp(1rem,3vw,2.5rem)]">
          {(['member', 'leader'] as const).map((id) => (
            <div key={id} className="max-w-[clamp(10rem,20vw,17.5rem)]">
              <p className="mb-0.5 text-lg font-bold text-milk">{t(`landing.cta.roles.${id}.title`)}</p>
              <p className="break-keep text-[clamp(0.8rem,1.1vw,0.9375rem)] font-medium leading-snug text-taupe">
                {t(`landing.cta.roles.${id}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/sign-in')}
          className="h-[clamp(2.5rem,3.5vw,3.0625rem)] w-full shrink-0 rounded-full bg-oat text-[clamp(0.9rem,1.3vw,1.0625rem)] font-bold text-charcoal sm:w-[clamp(10rem,16vw,14.3125rem)]"
        >
          {t('landing.cta.button')}
        </button>
      </motion.div>
    </motion.div>
  )
}

function DesktopExperience() {
  const [trackEl, setTrackEl] = useState<HTMLDivElement | null>(null)
  const [stage, setStage] = useState<0 | 1>(0)

  useEffect(() => {
    if (!trackEl) return
    let ticking = false

    const computeStage = () => {
      ticking = false
      const rect = trackEl.getBoundingClientRect()
      const pinnedDistance = rect.height - window.innerHeight
      if (pinnedDistance <= 0) return

      const scrolledIntoTrack = -rect.top
      const progress = Math.min(Math.max(scrolledIntoTrack / pinnedDistance, 0), 1)
      setStage(progress < TRANSITION_THRESHOLD ? 0 : 1)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(computeStage)
    }

    computeStage()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [trackEl])

  return (
    <div ref={setTrackEl} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <LandingDecor />
        </div>
        <div className="absolute inset-0 grid place-items-center px-[clamp(1.5rem,6vw,6.8125rem)]">
          <div className="w-full max-w-[1800px]">
            <AnimatePresence mode="wait">
              {stage === 0 ? (
                <PageOne key="content-1" animateMode="mount" />
              ) : (
                <PageTwo key="content-2" animateMode="mount" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: stage === 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden
        className="pointer-events-none fixed bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-semibold tracking-wide text-taupe"
      >
        SCROLL
        <span className="block h-6.5 w-px bg-linear-to-b from-taupe to-transparent" />
      </motion.div>
    </div>
  )
}

function MobileExperience() {
  return (
    <div className="flex flex-col gap-16 px-6 py-16 sm:px-10">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <LandingDecor />
        </div>
        <PageOne animateMode="mount" />
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
        </div>
        <PageTwo animateMode="inView" />
      </div>
    </div>
  )
}

function Landing() {
  const isDesktop = useIsDesktop()

  return (
    <div className="bg-milk">
      {isDesktop ? <DesktopExperience /> : <MobileExperience />}
    </div>
  )
}

export default Landing