import { useTranslation } from 'react-i18next'

function LanguageToggle() {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'

  return (
    <button
      onClick={() => i18n.changeLanguage(lang === 'ko' ? 'en' : 'ko')}
      className={`relative mb-4 h-12.5 w-62.5 self-center rounded-lg transition-colors duration-200 ${
        lang === 'ko' ? 'bg-taupe' : 'bg-dark-lava'
      }`}
    >
      <span
        className={`absolute top-2.5 left-2.5 flex h-7.5 w-28 items-center justify-center rounded-lg bg-milk text-[15px] font-bold text-dark-lava transition-transform duration-200 ease-out ${
          lang === 'en' ? 'translate-x-29.5' : 'translate-x-0'
        }`}
      >
        {lang === 'ko' ? '한국어' : 'ENGLISH'}
      </span>
    </button>
  )
}

export default LanguageToggle