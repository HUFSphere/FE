import { useRef } from 'react'
import { useNodes, useReactFlow, useStore, useViewport } from '@xyflow/react'

const PADDING = 120

type Axis = 'x' | 'y'

function MapScrollbars() {
  const { x, y, zoom } = useViewport()
  const { setViewport, getNodesBounds } = useReactFlow()
  const nodes = useNodes()
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)

  const dragRef = useRef<{ axis: Axis; start: number; from: number } | null>(null)

  if (nodes.length === 0 || width === 0 || height === 0) return null

  const b = getNodesBounds(nodes)

  const contentW = (b.width + PADDING * 2) * zoom
  const contentH = (b.height + PADDING * 2) * zoom
  const contentX = (b.x - PADDING) * zoom + x
  const contentY = (b.y - PADDING) * zoom + y

  const clamp = (v: number) => Math.min(1, Math.max(0, v))

  const hRatio = clamp(width / contentW)
  const hOffset = clamp(-contentX / contentW)
  const vRatio = clamp(height / contentH)
  const vOffset = clamp(-contentY / contentH)

  const shiftViewport = (axis: Axis, delta: number, from: number) => {
    const track = axis === 'x' ? width : height
    const content = axis === 'x' ? contentW : contentH
    const next = from - (delta / track) * content
    setViewport(axis === 'x' ? { x: next, y, zoom } : { x, y: next, zoom })
  }

  const startDrag = (axis: Axis) => (e: React.PointerEvent) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      axis,
      start: axis === 'x' ? e.clientX : e.clientY,
      from: axis === 'x' ? x : y,
    }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const now = d.axis === 'x' ? e.clientX : e.clientY
    shiftViewport(d.axis, now - d.start, d.from)
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const jumpTo = (axis: Axis) => (e: React.PointerEvent) => {
    if (dragRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const track = axis === 'x' ? rect.width : rect.height
    const pos = axis === 'x' ? e.clientX - rect.left : e.clientY - rect.top
    const ratio = axis === 'x' ? hRatio : vRatio
    const content = axis === 'x' ? contentW : contentH
    const target = clamp(pos / track - ratio / 2)
    setViewport(
      axis === 'x'
        ? { x: -target * content - (b.x - PADDING) * zoom, y, zoom }
        : { x, y: -target * content - (b.y - PADDING) * zoom, zoom },
    )
  }

  return (
    <>
      {/* 가로 */}
      {hRatio < 1 && (
        <div
          className="absolute bottom-2 left-3 right-3 z-20 h-2 cursor-pointer"
          onPointerDown={jumpTo('x')}
        >
          <div
            role="scrollbar"
            aria-orientation="horizontal"
            aria-controls="project-map"
            aria-valuenow={Math.round(hOffset * 100)}
            tabIndex={-1}
            onPointerDown={(e) => {
              e.stopPropagation()
              startDrag('x')(e)
            }}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="h-full cursor-grab rounded-full bg-taupe transition-colors hover:bg-mocha active:cursor-grabbing active:bg-mocha"
            style={{ width: `${hRatio * 100}%`, marginLeft: `${hOffset * 100}%` }}
          />
        </div>
      )}

      {/* 세로 */}
      {vRatio < 1 && (
        <div
          className="absolute top-3 bottom-3 right-2 w-2 z-20 cursor-pointer"
          onPointerDown={jumpTo('y')}
        >
          <div
            role="scrollbar"
            aria-orientation="vertical"
            aria-controls="project-map"
            aria-valuenow={Math.round(vOffset * 100)}
            tabIndex={-1}
            onPointerDown={(e) => {
              e.stopPropagation()
              startDrag('y')(e)
            }}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="w-full cursor-grab rounded-full bg-taupe transition-colors hover:bg-mocha active:cursor-grabbing active:bg-mocha"
            style={{ height: `${vRatio * 100}%`, marginTop: `${vOffset * 100}%` }}
          />
        </div>
      )}
    </>
  )
}

export default MapScrollbars