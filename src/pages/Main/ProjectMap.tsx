// 프로젝트 지도 페이지
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

const nodeTypes = { feature: FeatureNode }

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
    <div className="mx-auto w-full max-w-[1489px]">
      {/* 제목 + 버튼들 */}
      <div className="mb-3 flex items-center gap-2.5">
        <h1 className="text-[40px] font-bold tracking-tight text-dark-lava">
          {t('map.title')}
        </h1>

        <button
          type="button"
          onClick={() => navigate('/overview')}
          className="ml-auto h-[50px] w-[218px] shrink-0 rounded-[10px] bg-almond-milk text-[20px] font-bold text-dark-lava hover:bg-oat"
        >
          {t('map.overview')}
        </button>
        <button
          type="button"
          className="flex h-[50px] w-[150px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-dark-lava text-[20px] font-bold text-milk hover:bg-mocha"
        >
          {t('map.sync')}
          <ReloadIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-[1047fr_420fr] gap-[22px]">
        <div className="relative h-[760px] w-[1050px] overflow-hidden rounded-[7px] border-[3px] border-taupe bg-milk">
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
        </div>

        {/* 요약 카드 */}
        <aside className="flex h-[760px] w-[420px] flex-col overflow-y-auto rounded-[8px] bg-oat px-5 py-5">
          {detail ? (
            <>
              <div className="mb-2.5 flex items-center gap-2">
                {DetailIcon && <DetailIcon className="h-7 w-7 shrink-0 text-dark-lava" />}
                <h2 className="text-[25px] font-bold text-dark-lava">{detail.title[lang]}</h2>
              </div>

              {/* 진척률 + 상태 */}
              <div className="mb-2 flex items-center gap-1.5">
                <span className="grid h-8 w-15 place-items-center rounded-[8px] bg-milk text-[15px] font-bold text-dark-lava">
                  {detail.progress}%
                </span>
                <StatusBadge status={detail.status} />
              </div>

              {/* 진척 바 */}
              <div className="mb-4 h-[10px] w-full overflow-hidden rounded-[5px] bg-milk">
                <div
                  className="h-full rounded-[10px] bg-mocha"
                  style={{ width: `${detail.progress}%` }}
                />
              </div>

              {/* 한 줄 요약 */}
              <p className="mb-1.5 text-[20px] font-semibold text-dark-lava">{t('map.summary')}</p>
              <p className="mb-4 rounded-[10px] bg-milk px-3.5 py-2.5 text-[15px] font-medium leading-relaxed text-charcoal">
                {detail.summary[lang]}
              </p>

              {/* 연결된 항목 */}
              <p className="mb-2 text-[20px] font-semibold text-dark-lava">
                {t('map.linked', { count: detail.items.length })}
              </p>

              <div className="mb-2.5 flex gap-2.5">
                {detail.counts.map((c) => (
                  <span
                    key={c.source}
                    className="grid h-[25px] w-[80px] place-items-center rounded-[8px] bg-milk text-[13px] font-semibold tracking-wide text-taupe uppercase"
                  >
                    {c.source} {c.count}
                  </span>
                ))}
              </div>

              <ul className="flex flex-col gap-2.5">
                {detail.items.map((item) => {
                  const Icon = SOURCE_ICON[item.source]
                  return (
                    <li
                      key={item.id}
                      className="flex h-10 items-center gap-2 rounded-[8px] bg-milk px-3"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-charcoal" />
                      <span className="flex-1 truncate text-[15px] font-semibold text-charcoal">
                        {item.title[lang]}
                      </span>
                      <span className="shrink-0 text-[12px] font-medium text-taupe">
                        {item.date}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* 액션 */}
              <div className="mt-auto flex flex-col gap-2.5 pt-5">
                <button
                  type="button"
                  onClick={() => navigate(`/features/${selected}`)}
                  className="h-10 w-full rounded-[8px] bg-dark-lava text-[15px] font-semibold text-milk hover:bg-mocha"
                >
                  {t('map.detail')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/qa')}
                  className="h-10 w-full rounded-[8px] bg-milk text-[15px] font-semibold text-dark-lava hover:bg-almond-milk"
                >
                  {t('map.ask')}
                </button>
              </div>
            </>
          ) : (
            /* 아무 노드도 고르지 않은 상태 */
            <p className="m-auto text-center text-[15px] font-medium text-mocha">
              {t('map.empty')}
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ProjectMap