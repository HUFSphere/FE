// 환경 설정 페이지
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '../../components/ui/icons/FeatureIcon'
import { mockToneInstruction, mockTonePresets } from '../../mocks/settings'

/* 카드 제목 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[28px] font-semibold text-dark-lava">{children}</h2>
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
    <label className="flex h-10 w-37.5 shrink-0 cursor-pointer items-center gap-2.5 rounded-[6px] border-2 border-taupe bg-milk px-5.5 text-[15px] font-semibold text-mocha">
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
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ko'

  const [uiLang, setUiLang] = useState(i18n.language === 'en' ? 'en' : 'ko')

  const changeLanguage = (next: string) => {
    setUiLang(next)
    i18n.changeLanguage(next)
  }

  /* AI 답변 톤 설정 */
  const [instruction, setInstruction] = useState(mockToneInstruction[lang])
  const [presets, setPresets] = useState<string[]>(['concise'])
  const [saved, setSaved] = useState(false)

  const togglePreset = (id: string) => {
    const next = presets.includes(id) ? presets.filter((p) => p !== id) : [...presets, id]
    setPresets(next)
    setInstruction(
      mockTonePresets
        .filter((p) => next.includes(p.id))
        .map((p) => p.prompt[lang])
        .join('\n'),
    )
    setSaved(false)
  }

  /* 백엔드 연동 시 지시문을 서버에 저장 필요 */
  const save = () => setSaved(true)

  return (
    <div className="mx-auto w-full max-w-[1479px]">
      <h1 className="mb-4 text-[40px] font-semibold tracking-tight text-dark-lava">
        {t('settings.title')}
      </h1>

      {/* 언어 변경 */}
      <section className="mb-3.25 rounded-[10px] bg-oat px-6 pt-3.5 pb-6">
        <div className="mb-1.5">
          <CardTitle>{t('settings.language')}</CardTitle>
        </div>

        <label htmlFor="ui-lang" className="mb-2 block text-[24px] font-semibold text-mocha">
          {t('settings.uiLanguage')}
        </label>

        <div className="relative">
          <select
            id="ui-lang"
            value={uiLang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="h-11.5 w-full appearance-none rounded-[10px] border border-taupe bg-milk pr-12 pl-4.5 text-[16px] font-semibold text-taupe focus:border-mocha focus:outline-none"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4.5 h-5 w-5 -translate-y-1/2 text-taupe" />
        </div>
      </section>

      {/* AI 답변 톤 설정 */}
      <section className="rounded-[10px] bg-almond-milk px-6 pt-3.5 pb-6">
        <div className="mb-3 flex items-end">
          <div>
            <div className="mb-0.5">
              <CardTitle>{t('settings.tone')}</CardTitle>
            </div>
            <p className="text-[18px] font-semibold text-mocha">{t('settings.toneDesc')}</p>
          </div>

          <button
            type="button"
            onClick={save}
            className="ml-auto h-[38px] w-[100px] shrink-0 rounded-[10px] bg-charcoal text-[18px] font-semibold text-milk hover:bg-mocha"
          >
            {saved ? t('settings.saved') : t('settings.save')}
          </button>
        </div>

        {/* 지시문 입력 */}
        <textarea
          value={instruction}
          onChange={(e) => {
            setInstruction(e.target.value)
            setPresets([]) 
            setSaved(false)
          }}
          aria-label={t('settings.tone')}
          className="mb-2.5 h-96.5 w-full resize-none rounded-[10px] border-2 border-mocha bg-milk p-5 text-[20px] font-semibold leading-relaxed text-mocha placeholder-mocha focus:border-mocha focus:outline-none"
        />

        {/* 프리셋 */}
        <p className="mb-2 text-[16px] font-semibold text-mocha">{t('settings.presets')}</p>
        <ul className="flex flex-wrap gap-2.75">
          {mockTonePresets.map((p) => (
            <li key={p.id}>
              <PresetCheckbox checked={presets.includes(p.id)} onChange={() => togglePreset(p.id)}>
                {p.label[lang]}
              </PresetCheckbox>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Settings