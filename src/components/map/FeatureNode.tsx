// 지도에 그려지는 기능 노드
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'

/* 강조 톤 4가지 */
const TONE = {
  root: 'bg-mocha text-milk',
  dark: 'bg-charcoal text-milk',
  light: 'bg-oat text-dark-lava',
  muted: 'bg-taupe text-charcoal',
} as const

export type FeatureNodeData = {
  label: string
  tone: keyof typeof TONE
  selected?: boolean
}

function FeatureNode({ data, selected }: NodeProps) {
  const d = data as unknown as FeatureNodeData

  return (
    <div
      className={`flex h-14.25 w-59.5 items-center justify-center rounded-[10px] px-4 text-center text-[15px] font-semibold ${
        TONE[d.tone]
      } ${selected ? 'ring-2 ring-dark-lava ring-offset-2 ring-offset-milk' : ''}`}
    >
      {/* 연결점은 보이지 않게 두고 선만 이어집니다 */}
      <Handle type="target" position={Position.Left} className="!h-1 !w-1 !border-0 !bg-transparent" />
      <span className="truncate">{d.label}</span>
      <Handle type="source" position={Position.Right} className="!h-1 !w-1 !border-0 !bg-transparent" />
    </div>
  )
}

export default FeatureNode