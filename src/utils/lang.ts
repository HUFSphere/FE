// mockUser, mockProjectStatus처럼 { ko, en } 구조로 된 목업 데이터에서
// 화면에 표시할 언어를 고를 때 쓰는 공용 헬퍼.
//
// i18next의 fallbackLng('en')은 t() 함수로 불러오는 번역 텍스트에만 적용되고,
// 이런 로컬 목업 객체를 i18n.language로 직접 인덱싱하는 곳에는 적용되지 않습니다.
// 그래서 'ko'/'en' 외의 언어(예: 'es')가 선택되면 값이 undefined가 되어 텍스트가
// 사라지는 문제가 생깁니다. 이 함수를 거쳐서 항상 'ko' 아니면 'en'만 반환하게 해서
// 전역 fallback 정책과 일치시킵니다.

export function getUiLang(language: string): 'ko' | 'en' {
  return language === 'ko' ? 'ko' : 'en'
}