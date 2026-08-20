// 팀 설정 더미 데이터 — API 연동 시 이 파일을 fetch 훅으로 교체 필요
import type { SourceKind } from './featuredetail'

export type Member = {
  id: string
  name: { ko: string; en: string }
  avatar?: string
}

export const mockLeader: Member = {
  id: 'leader',
  name: { ko: '성이름', en: 'Full Name' },
}

export const mockMembers: Member[] = [
  { id: 'm1', name: { ko: '성이름', en: 'Full Name' } },
  { id: 'm2', name: { ko: '성이름', en: 'Full Name' } },
  { id: 'm3', name: { ko: '성이름', en: 'Full Name' } },
  { id: 'm4', name: { ko: '성이름', en: 'Full Name' } },
  { id: 'm5', name: { ko: '성이름', en: 'Full Name' } },
]

export type Connection = {
  source: SourceKind
  label: string
  url: string
}

export const mockConnections: Connection[] = [
  { source: 'github', label: 'Github', url: 'https://github.com/?locale=ko-kr' },
  { source: 'figma', label: 'Figma', url: 'https://www.figma.com/ko-kr/' },
  { source: 'notion', label: 'Notion', url: '' },
]

export function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export const mockConnectedUrl: Record<SourceKind, string> = {
  github: 'https://github.com/HUFSphere/FE',
  figma: 'https://www.figma.com/file/linkboard',
  notion: 'https://www.notion.so/linkboard',
}