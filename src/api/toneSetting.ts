import { apiRequest } from './client'
import type { NativeLang } from './auth'

export type PresetKey = 'beginner' | 'intermediate' | 'expert'

export type TonePreset = {
  presetKey: PresetKey
  label: string
}

export type ToneSetting = {
  presetKeys: PresetKey[]
  customText: string | null
  updatedAt?: string
}

/* lang 생략 시 로그인한 사용자의 모국어 기준. lang 지정 시에도 로그인돼 있으면 토큰 그대로 전송 */
export async function getTonePresets(lang?: NativeLang) {
  const query = lang ? `?lang=${lang}` : ''
  return apiRequest<TonePreset[]>(`/api/v1/tone-presets${query}`, { method: 'GET' })
}

/* 저장된 설정이 없으면 기본값(beginner, customText null)을 에러 없이 반환 */
export async function getToneSetting() {
  return apiRequest<ToneSetting>('/api/v1/tone-setting', { method: 'GET' })
}

export async function saveToneSetting(params: { presetKeys: PresetKey[]; customText?: string }) {
  return apiRequest<ToneSetting>('/api/v1/tone-setting', {
    method: 'PUT',
    body: params,
  })
}