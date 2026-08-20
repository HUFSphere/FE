// 환경 설정 페이지
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Select from '../../components/ui/Select/Select'
import { getTonePresets, getToneSetting, saveToneSetting } from '../../api/toneSetting'
import type { TonePreset, PresetKey } from '../../api/toneSetting'
import { getMyInfo, updateMyInfo } from '../../api/auth'
import type { NativeLang } from '../../api/auth'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/* 카드 제목 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-dark-lava">{children}</h2>
}

function PresetCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-md border-2 border-taupe bg-milk px-5 text-base font-semibold text-mocha">
      <span className="relative grid h-5.5 w-5.5 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-full w-full cursor-pointer appearance-none border-2 border-taupe bg-milk checked:border-taupe checked:bg-taupe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha"
        />
        {checked && (
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute h-3.5 w-3.5 text-milk"
            aria-hidden
          >
            <path
              d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {children}
    </label>
  )
}

function Settings() {
  const { t } = useTranslation()

  const [nativeLang, setNativeLang] = useState<NativeLang | ''>('')
  const [isSavingNativeLang, setIsSavingNativeLang] = useState(false)
  const [nativeLangError, setNativeLangError] = useState<string | null>(null)

  useEffect(() => {
    getMyInfo()
      .then((me) => setNativeLang(me.nativeLang))
      .catch(() => {})
  }, [])

  const handleNativeLangChange = async (value: string) => {
    const prev = nativeLang
    setNativeLang(value as NativeLang)
    setIsSavingNativeLang(true)
    setNativeLangError(null)
    try {
      await updateMyInfo({ nativeLang: value as NativeLang })
    } catch {
      setNativeLang(prev)
      setNativeLangError('저장하지 못했습니다.')
    } finally {
      setIsSavingNativeLang(false)
    }
  }

  const LANGUAGE_OPTIONS = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'DEUTSCH' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中國語' },
    { value: 'es', label: 'ESPAÑOL' },
    { value: 'ms', label: 'BAHASA MELAYU' },
    { value: 'it', label: 'ITALIANO' },
    { value: 'fr', label: 'FRANÇAIS' },
    { value: 'ar', label: 'اللغة العربية' },
    { value: 'ru', label: 'РУССКИЙ' },
  ]

 /* AI 답변 톤 설정 */
 const [tonePresets, setTonePresets] = useState<TonePreset[]>([])
 const [presetKeys, setPresetKeys] = useState<PresetKey[]>([])
 const [customText, setCustomText] = useState('')
 const [isSavingTone, setIsSavingTone] = useState(false)
 const [toneError, setToneError] = useState<string | null>(null)
 const [saved, setSaved] = useState(false)
 const [activePreset, setActivePreset] = useState<PresetKey | null>(null)

 /* 초기 톤 설정 불러오기 */
 useEffect(() => {
   getToneSetting()
     .then((data) => {
       setPresetKeys(data.presetKeys)
       setCustomText(data.customText ?? '')
       setActivePreset(data.presetKeys[0] ?? null)
     })
     .catch(() => {})
 }, [])

 /* 모국어가 바뀔 때마다 프리셋 라벨을 그 언어로 다시 조회 */
 useEffect(() => {
   if (!nativeLang) return
   getTonePresets(nativeLang)
     .then(setTonePresets)
     .catch(() => {})
 }, [nativeLang])

 const togglePreset = (key: PresetKey) => {
   const preset = tonePresets.find((p) => p.presetKey === key)
   setCustomText(preset?.description ?? '')
   setPresetKeys([])
   setActivePreset(key)
   setSaved(false)
 }
 const save = async () => {
   setIsSavingTone(true)
   setToneError(null)
   try {
     await saveToneSetting({ presetKeys, customText: customText || undefined })
     setSaved(true)
   } catch {
     setToneError('저장하지 못했습니다.')
   } finally {
     setIsSavingTone(false)
   }
 }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-369.75"
    >
      <motion.h1 variants={fadeUp} className="mb-4 text-2xl font-bold tracking-tight text-dark-lava">
        {t('settings.title')}
      </motion.h1>

      {/* 모국어 (AI 답변 언어) */}
      <motion.section variants={fadeUp} className="mb-4.25 rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-1.5">
          <CardTitle>{t('settings.nativeLanguage')}</CardTitle>
        </div>

        <label className="mb-2 block text-base font-semibold text-mocha">
          {t('settings.nativeLanguageDesc')}
        </label>

        <Select value={nativeLang} onChange={handleNativeLangChange} options={LANGUAGE_OPTIONS} />

        {isSavingNativeLang && <p className="mt-2 text-sm text-taupe">저장 중...</p>}
        {nativeLangError && <p className="mt-2 text-sm font-semibold text-red-600">{nativeLangError}</p>}
      </motion.section>

      {/* AI 답변 톤 설정 */}
      <motion.section variants={fadeUp} className="rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-3 flex items-end">
          <div>
            <div className="mb-0.5">
              <CardTitle>{t('settings.tone')}</CardTitle>
            </div>
            <p className="text-sm font-semibold text-mocha">{t('settings.toneDesc')}</p>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={isSavingTone}
            className="ml-auto h-9.5 w-20 shrink-0 rounded-[10px] bg-charcoal text-sm font-semibold text-milk hover:bg-mocha"
          >
            {isSavingTone ? '저장 중...' : saved ? t('settings.saved') : t('settings.save')}
          </button>
        </div>

        {/* 지시문 입력 */}
        <textarea
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value)
            setPresetKeys([])
            setActivePreset(null)
            setSaved(false)
          }}
          maxLength={500}
          aria-label={t('settings.tone')}
          className="mb-2.5 h-96.5 w-full resize-none rounded-[10px] border-2 border-mocha bg-milk p-5 text-base leading-relaxed text-mocha placeholder-mocha focus:border-mocha focus:outline-none"
        />

        {/* 프리셋 */}
        <p className="mb-2 text-lg font-semibold text-mocha">{t('settings.presets')}</p>
        <motion.ul variants={staggerParent(0.05)} className="flex flex-wrap gap-2.75">
          {tonePresets.map((p) => (
            <motion.li key={p.presetKey} variants={fadeUp}>
              <PresetCheckbox checked={activePreset === p.presetKey} onChange={() => togglePreset(p.presetKey)}>
                {p.label}
              </PresetCheckbox>
            </motion.li>
          ))}
        </motion.ul>
        {toneError && <p className="mt-2 text-sm font-semibold text-red-600">{toneError}</p>}
      </motion.section>
    </motion.div>
  )
}

export default Settings