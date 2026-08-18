// 프로젝트 지도 페이지
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type { Edge, Node } from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import '@xyflow/react/dist/style.css'
import { MarkerType } from '@xyflow/react'

import FeatureNode from '../../components/map/FeatureNode'
import MapToolbar from '../../components/map/MapToolbar'
import type { CursorMode } from '../../components/map/MapToolbar'
import MapScrollbars from '../../components/map/MapScrollbars'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import { ReloadIcon } from '../../components/ui/icons/ModalIcons'
import { SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import { mockMapDetail, mockMapEdges, mockMapNodes } from '../../mocks/map'

/* 노드 크기 지정*/
const NODE_WIDTH = 240
const NODE_HEIGHT = 60

/* 지도 패널 폭 — 헤더 버튼 정렬 기준 */
const MAP_WIDTH = 'w-[1050px]'

const nodeTypes = { feature: FeatureNode }

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

function layout(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: 40, ranksep: 120 })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach((e) => g.setEdge(e.source, e.target))

  dagre.layout(g)

  return nodes.map((n) => {
    const p = g.node(n.id)
    return {
      ...n,
      position: { x: p.x - NODE_WIDTH / 2, y: p.y - NODE_HEIGHT / 2 },
    }
  })
}

const detailPanelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

function ProjectMap() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language === 'en' ? 'en' : 'ko'

  const [selected, setSelected] = useState<string | null>('onboarding')

  const [mode, setMode] = useState<CursorMode>('select')

  const initial = useMemo(() => {
    const nodes: Node[] = mockMapNodes.map((n) => ({
      id: n.id,
      type: 'feature',
      position: { x: 0, y: 0 },
      data: { label: n.label[lang], tone: n.tone },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      sourcePosition: undefined,
      targetPosition: undefined,
    }))

    const edges: Edge[] = mockMapEdges.map((e) => ({
      ...e,
      type: 'default',
      style: { stroke: '#A39382', strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 18,
        height: 18,
        color: '#A39382',
      },
    }))

    return { nodes: layout(nodes, edges), edges }
  }, [lang])

  const [nodes, , onNodesChange] = useNodesState(initial.nodes)
  const [edges, , onEdgesChange] = useEdgesState(initial.edges)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelected(node.id), [])

  const detail = selected ? mockMapDetail[selected] : undefined
  const DetailIcon = detail ? SOURCE_ICON[detail.source] : null

  return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerParent(0.15)}
        className="mx-auto w-full max-w-372.25"
      >
      {/* 제목  버튼들 */}
      <motion.div variants={staggerParent(0.1)} className={`mb-3 flex ${MAP_WIDTH} items-center gap-2.5`}>
        <motion.h1 variants={fadeUp} className="text-2xl font-bold tracking-tight text-dark-lava">
          {t('map.title')}
        </motion.h1>

        <motion.button
          variants={fadeUp}
          type="button"
          onClick={() => navigate('/overview')}
          className="ml-auto h-9.5 w-40 shrink-0 rounded-lg bg-almond-milk text-sm font-bold text-dark-lava hover:bg-oat"
         >
          {t('map.overview')}
        </motion.button>
        <motion.button
          variants={fadeUp}
          type="button"
          className="flex h-9.5 w-28 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-dark-lava text-sm font-bold text-milk hover:bg-mocha"
         >
          {t('map.sync')}
          <ReloadIcon className="h-3.5 w-3.5" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-[1047fr_420fr] gap-5.5">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`relative h-190 ${MAP_WIDTH} overflow-hidden rounded-[7px] border-[3px] border-taupe bg-milk`}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            zoomOnScroll={false}
            panOnScroll
            minZoom={0.5}
            maxZoom={1.5}
            panOnDrag={mode === 'pan'}
            selectionOnDrag={mode === 'select'}
            selectionMode={SelectionMode.Partial}
            className={mode === 'pan' ? 'cursor-grab active:cursor-grabbing' : ''}
            proOptions={{ hideAttribution: false }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#D2C9BB" />
            <MapScrollbars />
          </ReactFlow>

          <MapToolbar
            mode={mode}
            onChange={setMode}
            selectLabel={t('map.cursorSelect')}
            panLabel={t('map.cursorPan')}
          />
        </motion.div>

        {/* 요약 카드 */}
        <aside className="flex h-190 w-105 flex-col gap-5 overflow-y-auto rounded-lg bg-oat px-5 py-5">
          <AnimatePresence mode="wait">
            {detail ? (
              <motion.div
                key={selected}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={detailPanelVariants}
                className="flex flex-1 flex-col gap-5"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  {DetailIcon && <DetailIcon className="h-7 w-7 shrink-0 text-dark-lava" />}
                  <h2 className="text-xl font-bold text-dark-lava">{detail.title[lang]}</h2>
                </motion.div>

                 {/* 진척률  상태  진척 바 */}
                <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
                   <div className="flex items-center gap-1.5">
                     <span className="grid h-8 w-15 place-items-center rounded-lg bg-milk text-[15px] font-bold text-dark-lava">
                       {detail.progress}%
                     </span>
                     <StatusBadge status={detail.status} />
                   </div>

                   <div className="h-2 w-full overflow-hidden rounded-full bg-milk">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${detail.progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                       className="h-full rounded-full bg-mocha"
                     />
                   </div>
                </motion.div>

                 {/* 한 줄 요약 */}
                <motion.div variants={fadeUp} className="flex flex-col gap-2">
                   <p className="text-base font-semibold text-dark-lava">{t('map.summary')}</p>
                   <p className="rounded-[10px] bg-milk px-3.5 py-3 text-sm leading-relaxed text-taupe">
                     {detail.summary[lang]}
                   </p>
                </motion.div>

                 {/* 연결된 항목 */}
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                   <p className="text-base font-semibold text-dark-lava">
                     {t('map.linked', { count: detail.items.length })}
                   </p>

                  <motion.div variants={staggerParent(0.05)} className="flex gap-2.5">
                     {detail.counts.map((c) => (
                      <motion.span
                         key={c.source}
                        variants={fadeUp}
                         className="grid h-6.25 w-20 place-items-center rounded-lg bg-milk text-sm font-semibold tracking-wide text-mocha uppercase"
                       >
                         {c.source} {c.count}
                      </motion.span>
                     ))}
                  </motion.div>

                  <motion.ul variants={staggerParent(0.05)} className="flex flex-col gap-3">
                     {detail.items.map((item) => {
                       const Icon = SOURCE_ICON[item.source]
                       return (
                        <motion.li
                           key={item.id}
                          variants={fadeUp}
                           className="flex h-11 items-center gap-2 rounded-lg bg-milk px-3"
                         >
                           <Icon className="h-5 w-5 shrink-0 text-dark-lava" />
                           <span className="flex-1 truncate text-sm font-semibold text-mocha">
                             {item.title[lang]}
                           </span>
                           <span className="shrink-0 text-xs font-medium text-taupe">
                             {item.date}
                           </span>
                        </motion.li>
                       )
                     })}
                  </motion.ul>
                </motion.div>

                 {/* 액션 */}
                <motion.div variants={fadeUp} className="mt-auto flex flex-col gap-3 pt-5">
                   <button
                     type="button"
                     onClick={() => navigate(`/features/${selected}`)}
                     className="h-11 w-full rounded-lg bg-dark-lava text-sm font-semibold text-milk hover:bg-mocha"
                   >
                     {t('map.detail')}
                   </button>
                   <button
                     type="button"
                     onClick={() => navigate('/qa')}
                     className="h-11 w-full rounded-lg bg-milk text-sm font-semibold text-dark-lava hover:bg-almond-milk"
                   >
                     {t('map.ask')}
                   </button>
                </motion.div>
              </motion.div>
            ) : (
              /* 아무 노드도 고르지 않은 상태 */
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="m-auto text-center text-[15px] font-medium text-mocha"
              >
                {t('map.empty')}
              </motion.p>
            )}
          </AnimatePresence>
        </aside>
       </div>
    </motion.div>
  )
}

export default ProjectMap