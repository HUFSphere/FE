// 챗봇 Q&A 페이지
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchIcon, WarningIcon } from '../../components/ui/icons/FeatureIcon'
import { mockAnswer, mockPractices, mockScopes, mockSuggestions } from '../../mocks/QA'

/* 질문 카드 */
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2.5 text-[24px] font-semibold text-dark-lava">{children}</h2>
}

/* 질문 범위 */
function ScopeButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-7.5 shrink-0 items-center rounded-full border-2 px-3.5 text-[14px] font-semibold transition-colors ${
        selected
          ? 'border-charcoal bg-charcoal text-milk'
          : 'border-taupe bg-milk text-taupe hover:border-mocha hover:text-mocha'
      }`}
    >
      {children}
    </button>
  )
}

function QA() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ko'

  /* 범위 선택 — 개별 선택이 비면 '프로젝트 전체'가 켜지도록 */
  const [scopes, setScopes] = useState<string[]>(mockScopes.map((s) => s.id))
  const [scopeQuery, setScopeQuery] = useState('')
  const [question, setQuestion] = useState('')

  const isAll = scopes.length === 0

  const toggleScope = (id: string) =>
    setScopes((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  const query = scopeQuery.trim().toLowerCase()
  const visibleScopes = mockScopes.filter(
    (s) => scopes.includes(s.id) || !query || s.label[lang].toLowerCase().includes(query),
  )

  return (
    <div className="mx-auto w-full max-w-[1477px]">
      <h1 className="mb-4 text-[28px] font-extrabold tracking-tight text-dark-lava">
        {t('qa.title')}
      </h1>

      <div className="grid grid-cols-[914fr_532fr] gap-[31px]">
        {/* 왼쪽 카드 두 가지 */}
        <div className="flex h-full flex-col gap-2">
          {/* 질문 범위 + 입력 */}
          <section className="rounded-[10px] bg-almond-milk px-5 pt-4.5 pb-6">
            <div className="mb-2.5 flex items-center gap-3">
              <CardTitle>{t('qa.scope')}</CardTitle>

              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                {/* 범위 선택 - 프로젝트 전체. 누르면 개별 선택을 모두 해제하도록 */}
                <ScopeButton selected={isAll} onClick={() => setScopes([])}>
                  {t('qa.scopeAll')}
                </ScopeButton>

                {visibleScopes.map((s) => (
                  <ScopeButton
                    key={s.id}
                    selected={scopes.includes(s.id)}
                    onClick={() => toggleScope(s.id)}
                  >
                    {s.label[lang]}
                  </ScopeButton>
                ))}
              </div>
            </div>

            {/* 기능 검색 */}
            <div className="relative mb-3">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-mocha" />
              <input
                type="search"
                value={scopeQuery}
                onChange={(e) => setScopeQuery(e.target.value)}
                placeholder={t('qa.searchFeature')}
                className="h-8.5 w-full rounded-[9px] border border-taupe bg-milk pr-4 pl-11 text-[14px] font-semibold text-dark-lava placeholder-taupe focus:border-mocha focus:outline-none"
              />
            </div>

            {/* 질문 입력 */}
            <label htmlFor="qa-question" className="mb-2.5 block text-xl font-bold text-dark-lava">
              {t('qa.askLabel')}
            </label>
            <textarea
              id="qa-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-34 w-full resize-none rounded-[9px] border border-taupe bg-milk p-4 text-[14px] font-medium leading-relaxed text-dark-lava placeholder-taupe focus:border-mocha focus:outline-none"
            />
          </section>

          <section className="flex flex-1 flex-col rounded-[10px] bg-oat px-5 pt-4.5 pb-5.5">
            <CardTitle>{t('qa.answer')}</CardTitle>

            <div className="mb-4 min-h-79.5 flex-1 overflow-y-auto rounded-[9px] border border-taupe bg-milk p-5 text-[15px] font-medium leading-relaxed whitespace-pre-line text-dark-lava">
              {mockAnswer.text[lang] || (
                <span className="text-taupe">{t('qa.answerPlaceholder')}</span>
              )}
            </div>

            <p className="mb-2.5 text-base font-bold text-dark-lava">{t('qa.evidence')}</p>
            <ul className="flex flex-wrap gap-3.5">
              {mockAnswer.evidence.map((e) => (
                <li key={e.id}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11.5 items-center rounded-[7px] border-2 border-taupe bg-milk px-6 text-base font-semibold text-dark-lava hover:border-mocha"
                  >
                    {e.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 오른쪽 카드들 */}
        <div className="flex h-full flex-col gap-3.5">
          {/* 팀 관행 분석 */}
          <section className="rounded-[10px] bg-mocha px-6.5 pt-5 pb-5">
            <h2 className="mb-3 text-[26px] font-bold text-milk">{t('qa.practices')}</h2>

            <ul className="mb-3.5 flex flex-col gap-2.5">
              {mockPractices.map((p) => (
                <li key={p.id} className="rounded-[8px] bg-oat px-4.5 py-3.5">
                  <p className="mb-1.5 text-[18px] font-semibold whitespace-pre-line text-charcoal">
                    {p.text[lang]}
                  </p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[18px] font-semibold text-mocha underline underline-offset-3 hover:text-almond-milk"
                  >
                    {t('qa.viewEvidence')}
                  </a>
                </li>
              ))}
            </ul>

            {/* 주의 문구 */}
            <div className="flex items-start gap-2">
              <WarningIcon
                className="mt-1 h-5 w-5 shrink-0"
                triangleClassName="text-milk"
                markClassName="text-mocha"
              />
              <p className="text-[16px] font-semibold leading-snug whitespace-pre-line text-milk">
                {t('qa.disclaimer')}
              </p>
            </div>
          </section>

          <section className="flex flex-1 flex-col rounded-[10px] bg-almond-milk px-6.5 pt-5 pb-6">
            <h2 className="mb-4 text-[26px] font-semibold text-dark-lava">{t('qa.suggestions')}</h2>
            <ul className="flex flex-col gap-2.5">
              {mockSuggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setQuestion(s.label[lang])}
                    className="h-13 w-full rounded-[8px] bg-milk px-4 text-[15px] font-semibold text-mocha hover:bg-oat"
                  >
                    {s.label[lang]}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default QA