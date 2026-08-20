// 지도에 그려지는 기능 노드
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'

/* 소스별 색상 — 기존 tone(강조 톤) 대신 sourceType으로 구분 */
const SOURCE_TONE: Record<string, string> = {
  figma: 'bg-taupe text-charcoal',
  github: 'bg-charcoal text-milk',
  notion: 'bg-oat text-dark-lava',
}

export type FeatureNodeData = {
  label: string
  sourceType: string
}

function FeatureNode({ data, selected }: NodeProps) {
  const d = data as unknown as FeatureNodeData
  const tone = SOURCE_TONE[d.sourceType] ?? 'bg-mocha text-milk'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: selected ? 1.05 : 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: selected ? 1.05 : 1.03 }}
      className={`flex h-14.25 w-59.5 items-center justify-center rounded-[10px] px-4 text-center text-[15px] font-semibold ${tone} ${
        selected ? 'ring-2 ring-dark-lava ring-offset-2 ring-offset-milk' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="h-1! w-1! border-0! bg-transparent!" />
      <span className="truncate">{d.label}</span>
      <Handle type="source" position={Position.Right} className="h-1! w-1! border-0! bg-transparent!" />
    </motion.div>
  )
}

export default FeatureNode