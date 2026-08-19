// 프로젝트 지도 페이지
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import type { ReactFlowInstance } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { MarkerType } from '@xyflow/react'
import dagre from '@dagrejs/dagre'

import FeatureNode from '../../components/map/FeatureNode'
import MapToolbar from '../../components/map/MapToolbar'
import type { CursorMode } from '../../components/map/MapToolbar'
import MapScrollbars from '../../components/map/MapScrollbars'
import StatusBadge from '../../components/ui/StatusBadge/Statusbadge'
import { ReloadIcon } from '../../components/ui/icons/ModalIcons'
import { SOURCE_ICON } from '../../components/ui/icons/FeatureIcon'
import { getProjectMap } from '../../api/map'
import type { MapNode, MapLink } from '../../api/map'
import { getWorkItemDetail } from '../../api/workItems'
import type { WorkItemDetail } from '../../api/workItems'
import { getSourceConnections, syncSource } from '../../api/sourceSync'
import { getWorkspaceId } from '../../utils/workspaceStorage'
import { getUiLang } from '../../utils/lang'
import { toUiStatus } from '../../utils/statusMap'

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

const detailPanelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

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
  const lang = getUiLang(i18n.language)
  const workspaceId = getWorkspaceId()

  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<CursorMode>('select')
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null)

  const [mapNodes, setMapNodes] = useState<MapNode[]>([])
  const [mapLinks, setMapLinks] = useState<MapLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; label: string } | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  const [detail, setDetail] = useState<WorkItemDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const loadMap = useCallback(() => {
  if (!workspaceId) {
    setLoadError('워크스페이스 정보가 없습니다.')
    setIsLoading(false)
    return
  }
  setIsLoading(true)
  setLoadError(null)
  return getProjectMap(workspaceId, { lang })
    .then((res) => {
      setMapNodes(res.nodes)
      setMapLinks(res.links)
      if (res.nodes.length > 0) {
        setSelected(String(res.nodes[0].id))
      }
    })
    .catch(() => setLoadError('지도를 불러오지 못했습니다.'))
    .finally(() => setIsLoading(false))
}, [workspaceId, lang])

  /* 지도 데이터 로드 */
  useEffect(() => {
    loadMap()
  }, [loadMap])

  const initial = useMemo(() => {
    const validNodes = mapNodes.filter(
      (n) => n.title && n.title.trim() !== '' && n.title !== '(제목 없음)',
    )
    const validIds = new Set(validNodes.map((n) => n.id))

    const nodes: Node[] = validNodes.map((n) => ({
      id: String(n.id),
      type: 'feature',
      position: { x: 0, y: 0 },
      data: { label: n.title, sourceType: n.sourceType },
      sourcePosition: undefined,
      targetPosition: undefined,
    }))

    const edges: Edge[] = mapLinks
      .filter((l) => validIds.has(l.fromWorkItemId) && validIds.has(l.toWorkItemId))
      .map((l, i) => ({
      id: `e-${l.fromWorkItemId}-${l.toWorkItemId}-${i}`,
      source: String(l.fromWorkItemId),
      target: String(l.toWorkItemId),
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
  }, [mapNodes, mapLinks])

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)

  /* 지도 데이터 갱신 시 노드/엣지도 갱신 */
  useEffect(() => {
    setNodes(initial.nodes)
    setEdges(initial.edges)
    requestAnimationFrame(() => flowInstance?.fitView())
  }, [initial])

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelected(node.id), [])

  const handleSync = async () => {
    if (!workspaceId || isSyncing) return
    setIsSyncing(true)
    setSyncError(null)
    try {
      const connections = await getSourceConnections(workspaceId)
      const total = connections.length
      for (let i = 0; i < total; i) {
        const conn = connections[i]
        setSyncProgress({ current: i + 1, total, label: conn.sourceType })
        try {
          await syncSource(conn.id)
        } catch {
          setSyncError(`${conn.sourceType} 동기화에 실패했어요.`)
        }
      }
      await loadMap()
    } catch {
      setSyncError('동기화 대상을 불러오지 못했어요.')
    } finally {
      setIsSyncing(false)
      setSyncProgress(null)
    }
  }

  /* 노드 선택 시 상세 정보 로드 */
  useEffect(() => {
    if (!selected) {
      setDetail(null)
      return
    }
    setIsDetailLoading(true)
    getWorkItemDetail(Number(selected), lang)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setIsDetailLoading(false))
  }, [selected, lang])

  const DetailIcon = detail ? SOURCE_ICON[detail.sourceType as keyof typeof SOURCE_ICON] : null

  /* 연결된 항목을 소스별로 묶어서 개수 표시 */
  const linkedCounts = useMemo(() => {
    if (!detail) return []
    const counts: Record<string, number> = {}
    detail.linkedItems.forEach((item) => {
      counts[item.sourceType] = (counts[item.sourceType] ?? 0) + 1
    })
    return Object.entries(counts).map(([source, count]) => ({ source, count }))
  }, [detail])

  if (isLoading) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">불러오는 중...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="grid min-h-150 place-items-center">
        <p className="text-lg font-medium text-mocha">{loadError}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(0.15)}
      className="mx-auto w-full max-w-372.25"
    >
      {/* 제목 + 버튼들 */}
      <motion.div variants={staggerParent(0.1)} className={`mb-3 flex ${MAP_WIDTH} items-center gap-2.5`}>
        <motion.h1 variants={fadeUp} className="text-2xl font-bold tracking-tight text-dark-lava">
          {t('map.title')}
        </motion.h1>

          {(isSyncing || syncError) && (
            <motion.div variants={fadeUp} className="ml-auto text-right">
              {isSyncing && syncProgress && (
                <p className="text-xs font-medium text-taupe">
                  동기화 중... ({syncProgress.current}/{syncProgress.total}) {syncProgress.label}
                </p>
              )}
              {syncError && <p className="text-xs font-semibold text-red-600">{syncError}</p>}
            </motion.div>
          )}

        <motion.button
          variants={fadeUp}
          type="button"
          onClick={() => navigate('/overview')}
          className={`h-9.5 w-40 shrink-0 rounded-lg bg-almond-milk text-sm font-bold text-dark-lava hover:bg-oat ${
            isSyncing || syncError ? '' : 'ml-auto'
          }`}
        >
          {t('map.overview')}
        </motion.button>
          <motion.button
            variants={fadeUp}
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex h-9.5 w-28 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-dark-lava text-sm font-bold text-milk hover:bg-mocha"
          >
            {isSyncing ? (
              <ReloadIcon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                {t('map.sync')}
                <ReloadIcon className="h-3.5 w-3.5" />
              </>
            )}
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
            onInit={setFlowInstance}
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
            {isDetailLoading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="m-auto text-center text-[15px] font-medium text-mocha"
              >
                불러오는 중...
              </motion.p>
            ) : detail ? (
              <motion.div
                key={detail.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={detailPanelVariants}
                className="flex flex-1 flex-col gap-5"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  {DetailIcon && <DetailIcon className="h-7 w-7 shrink-0 text-dark-lava" />}
                  <h2 className="text-xl font-bold text-dark-lava">{detail.title}</h2>
                </motion.div>

                {/* 상태 */}
                <motion.div variants={fadeUp} className="flex items-center gap-1.5">
                  <StatusBadge status={toUiStatus(detail.status)} />
                  {detail.authorLogin && (
                    <span className="text-sm font-medium text-taupe">by {detail.authorLogin}</span>
                  )}
                </motion.div>

                {/* 요약 */}
                {detail.summaryNative && (
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <p className="text-base font-semibold text-dark-lava">{t('map.summary')}</p>
                    <p className="rounded-[10px] bg-milk px-3.5 py-3 text-sm leading-relaxed text-taupe">
                      {detail.summaryNative}
                    </p>
                  </motion.div>
                )}

                {/* 연결된 항목 */}
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  <p className="text-base font-semibold text-dark-lava">
                    {t('map.linked', { count: detail.linkedItems.length })}
                  </p>

                  {linkedCounts.length > 0 && (
                    <motion.div variants={staggerParent(0.05)} className="flex gap-2.5">
                      {linkedCounts.map((c) => (
                        <motion.span
                          key={c.source}
                          variants={fadeUp}
                          className="grid h-6.25 w-20 place-items-center rounded-lg bg-milk text-sm font-semibold tracking-wide text-mocha uppercase"
                        >
                          {c.source} {c.count}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}

                  <motion.ul variants={staggerParent(0.05)} className="flex flex-col gap-3">
                    {detail.linkedItems.map((item) => {
                      const Icon = SOURCE_ICON[item.sourceType as keyof typeof SOURCE_ICON]
                      return (
                        <motion.li
                          key={item.id}
                          variants={fadeUp}
                          className="flex h-11 items-center gap-2 rounded-lg bg-milk px-3"
                        >
                          {Icon && <Icon className="h-5 w-5 shrink-0 text-dark-lava" />}
                          <a                          
                             href={item.sourceUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex-1 truncate text-sm font-semibold text-mocha hover:underline"
                           >
                             {item.title}
                           </a>
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