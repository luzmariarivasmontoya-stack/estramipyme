import { useState, useCallback, useEffect, useRef } from 'react'
import type { StrategicClockPosition } from '@/types/stages'

/* ── Props ─────────────────────────────────────────── */
interface StrategicClockProps {
  position: StrategicClockPosition
  onChange: (position: StrategicClockPosition) => void
  readOnly?: boolean
}

/* ── Strategy Definitions ──────────────────────────── */
interface Strategy {
  id: number
  name: string
  lines: string[]
  endX: number
  endY: number
  labelX: number
  labelY: number
  labelAnchor: 'start' | 'middle' | 'end'
  description: string
}

const SVG_W = 480
const SVG_H = 440
const CX = 220
const CY = 210
const SNAP_R = 45
const STAR_OUTER = 12
const STAR_INNER = 5

/**
 * Five competitive strategies from Bowman's Strategic Clock
 * (Faulkner & Bowman, 1995 — Estramipyme, EAFIT 2023, Figura 6)
 *
 * Arranged as arrows from center:
 *   1 → lower-left  (low price, low value)
 *   2 → left         (low price, moderate value)
 *   3 → upper-left   (moderate price, high value)
 *   4 → up           (moderate price, very high value)
 *   5 → upper-right  (premium price, premium value)
 */
const STRATEGIES: Strategy[] = [
  {
    id: 1,
    name: 'Bajo precio / Valor añadido',
    lines: ['Bajo precio /', 'Valor añadido'],
    endX: 120,
    endY: 315,
    labelX: 50,
    labelY: 340,
    labelAnchor: 'start',
    description:
      'Precio bajo con valor básico. Productos sin diferenciación significativa.',
  },
  {
    id: 2,
    name: 'Bajo precio',
    lines: ['Bajo precio'],
    endX: 75,
    endY: 200,
    labelX: 32,
    labelY: 196,
    labelAnchor: 'start',
    description:
      'Competir con precios más bajos que los competidores, manteniendo un valor aceptable.',
  },
  {
    id: 3,
    name: 'Híbrida',
    lines: ['Híbrida'],
    endX: 120,
    endY: 100,
    labelX: 82,
    labelY: 85,
    labelAnchor: 'start',
    description:
      'Combinar precio competitivo con buena diferenciación. Lo mejor de ambos mundos.',
  },
  {
    id: 4,
    name: 'Diferenciación',
    lines: ['Diferenciación'],
    endX: 220,
    endY: 55,
    labelX: 220,
    labelY: 38,
    labelAnchor: 'middle',
    description:
      'Ofrecer alto valor percibido a precio razonable. Destacar por calidad, marca o innovación.',
  },
  {
    id: 5,
    name: 'Diferenciación segmentada',
    lines: ['Diferenciación', 'segmentada'],
    endX: 335,
    endY: 100,
    labelX: 360,
    labelY: 90,
    labelAnchor: 'start',
    description:
      'Máximo valor percibido para un nicho específico, a precio premium.',
  },
]

/* ── SVG Helpers ───────────────────────────────────── */

/** 5-pointed star polygon (points string) */
function starPts(
  cx: number,
  cy: number,
  outer = STAR_OUTER,
  inner = STAR_INNER,
): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i * Math.PI) / 5 - Math.PI / 2
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}

/** Arrowhead triangle (points string) */
function arrowHead(
  fx: number,
  fy: number,
  tx: number,
  ty: number,
  size = 10,
): string {
  const a = Math.atan2(ty - fy, tx - fx)
  const x1 = tx - size * Math.cos(a - Math.PI / 6)
  const y1 = ty - size * Math.sin(a - Math.PI / 6)
  const x2 = tx - size * Math.cos(a + Math.PI / 6)
  const y2 = ty - size * Math.sin(a + Math.PI / 6)
  return `${tx},${ty} ${x1},${y1} ${x2},${y2}`
}

/* ── Component ─────────────────────────────────────── */

export function StrategicClock({
  position,
  onChange,
  readOnly = false,
}: StrategicClockProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDragRef = useRef(false)
  const onChangeRef = useRef(onChange)
  const posRef = useRef(position)

  const [star, setStar] = useState(() => {
    const s = STRATEGIES.find((st) => st.id === position.segment)
    return s ? { x: s.endX, y: s.endY } : { x: CX, y: CY }
  })
  const starRef = useRef(star)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  // Keep refs in sync
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    posRef.current = position
  }, [position])
  useEffect(() => {
    starRef.current = star
  }, [star])

  // Sync star when segment changes externally
  useEffect(() => {
    if (isDragRef.current) return
    const s = STRATEGIES.find((st) => st.id === position.segment)
    if (s) setStar({ x: s.endX, y: s.endY })
    else if (position.segment === 0) setStar({ x: CX, y: CY })
  }, [position.segment])

  /* ── Coordinate conversion ───────────────────────── */
  const toSVG = useCallback((cx: number, cy: number) => {
    const el = svgRef.current
    if (!el) return { x: CX, y: CY }
    const r = el.getBoundingClientRect()
    return {
      x: Math.max(20, Math.min(SVG_W - 20, ((cx - r.left) / r.width) * SVG_W)),
      y: Math.max(20, Math.min(SVG_H - 20, ((cy - r.top) / r.height) * SVG_H)),
    }
  }, [])

  /* ── Find snap target ────────────────────────────── */
  const findSnap = useCallback((x: number, y: number): Strategy | null => {
    let best: Strategy | null = null
    let bestD = SNAP_R
    for (const s of STRATEGIES) {
      const d = Math.hypot(x - s.endX, y - s.endY)
      if (d < bestD) {
        bestD = d
        best = s
      }
    }
    return best
  }, [])

  /* ── Window-level drag listeners ─────────────────── */
  useEffect(() => {
    const move = (cx: number, cy: number) => {
      if (!isDragRef.current) return
      const p = toSVG(cx, cy)
      starRef.current = p
      setStar(p)
    }

    const end = () => {
      if (!isDragRef.current) return
      isDragRef.current = false
      setDragging(false)
      const p = starRef.current
      const s = findSnap(p.x, p.y)
      if (s) {
        const np = { x: s.endX, y: s.endY }
        starRef.current = np
        setStar(np)
        onChangeRef.current({
          ...posRef.current,
          segment: s.id,
          angle: s.id * 45,
        })
      } else {
        // Reset to previous strategy or center
        const prev = STRATEGIES.find((st) => st.id === posRef.current.segment)
        const np = prev ? { x: prev.endX, y: prev.endY } : { x: CX, y: CY }
        starRef.current = np
        setStar(np)
      }
    }

    const onMM = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onTM = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        move(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onMU = () => end()
    const onTE = () => end()

    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseup', onMU)
    window.addEventListener('touchmove', onTM, { passive: false })
    window.addEventListener('touchend', onTE)
    return () => {
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseup', onMU)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('touchend', onTE)
    }
  }, [toSVG, findSnap])

  /* ── Start drag ──────────────────────────────────── */
  const onStarDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (readOnly) return
      e.preventDefault()
      e.stopPropagation()
      isDragRef.current = true
      setDragging(true)
    },
    [readOnly],
  )

  /* ── Click arrow to select ───────────────────────── */
  const clickStrategy = useCallback(
    (id: number) => {
      if (readOnly) return
      const s = STRATEGIES.find((st) => st.id === id)
      if (!s) return
      setStar({ x: s.endX, y: s.endY })
      onChange({ ...position, segment: id, angle: id * 45 })
    },
    [readOnly, onChange, position],
  )

  const selected = STRATEGIES.find((s) => s.id === position.segment)
  const target = STRATEGIES.find((s) => s.id === position.targetPosition)
  const snapPreview = dragging ? findSnap(star.x, star.y) : null

  /* ── Render ──────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-6">
      {/* ── SVG Cartesian Plane ── */}
      <div className="w-full max-w-[520px] mx-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full select-none"
          style={{ touchAction: 'none' }}
          role="img"
          aria-label="Reloj Estratégico de Bowman — plano cartesiano con 5 estrategias"
        >
          {/* Background */}
          <rect width={SVG_W} height={SVG_H} fill="#FAFAF7" rx="8" />

          {/* Subtle quadrant shading */}
          <rect
            x="30"
            y="30"
            width={CX - 30}
            height={CY - 30}
            fill="#f0fdf4"
            opacity="0.25"
            rx="4"
          />
          <rect
            x={CX}
            y={CY}
            width={SVG_W - CX - 30}
            height={SVG_H - CY - 30}
            fill="#fef2f2"
            opacity="0.15"
            rx="4"
          />

          {/* ── Axes ── */}
          <line
            x1="30"
            y1={CY}
            x2={SVG_W - 30}
            y2={CY}
            stroke="#8B8B7A"
            strokeWidth="1.2"
          />
          <line
            x1={CX}
            y1="30"
            x2={CX}
            y2={SVG_H - 30}
            stroke="#8B8B7A"
            strokeWidth="1.2"
          />

          {/* +/− symbols at axis ends */}
          <text
            x={SVG_W - 22}
            y={CY + 5}
            textAnchor="middle"
            fill="#8B8B7A"
            fontSize="16"
            fontWeight="700"
            fontFamily="'DM Sans', sans-serif"
          >
            +
          </text>
          <text
            x="22"
            y={CY + 5}
            textAnchor="middle"
            fill="#8B8B7A"
            fontSize="16"
            fontWeight="700"
            fontFamily="'DM Sans', sans-serif"
          >
            −
          </text>
          <text
            x={CX}
            y="22"
            textAnchor="middle"
            fill="#8B8B7A"
            fontSize="16"
            fontWeight="700"
            fontFamily="'DM Sans', sans-serif"
          >
            +
          </text>
          <text
            x={CX}
            y={SVG_H - 16}
            textAnchor="middle"
            fill="#8B8B7A"
            fontSize="16"
            fontWeight="700"
            fontFamily="'DM Sans', sans-serif"
          >
            −
          </text>

          {/* Axis label: Precio */}
          <rect x={SVG_W - 78} y={CY + 10} width="50" height="16" fill="#FAFAF7" />
          <text
            x={SVG_W - 53}
            y={CY + 23}
            textAnchor="middle"
            fill="#8B8B7A"
            fontSize="11"
            fontFamily="'DM Sans', sans-serif"
          >
            Precio
          </text>

          {/* Axis label: Valor Percibido (rotated) */}
          <g transform={`rotate(-90 ${CX - 20} ${CY})`}>
            <rect
              x={CX - 20 - 48}
              y={CY - 8}
              width="96"
              height="16"
              fill="#FAFAF7"
            />
            <text
              x={CX - 20}
              y={CY + 4}
              textAnchor="middle"
              fill="#8B8B7A"
              fontSize="11"
              fontFamily="'DM Sans', sans-serif"
            >
              Valor Percibido
            </text>
          </g>

          {/* ── Failure ellipse (~45° tilt, lower-right quadrant) ── */}
          <ellipse
            cx={355}
            cy={315}
            rx={85}
            ry={36}
            transform="rotate(-45 355 315)"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.45"
          />
          <rect x={378} y={367} width="96" height="30" fill="#FAFAF7" rx="2" />
          <text
            fill="#ef4444"
            fontSize="9"
            fontFamily="'DM Sans', sans-serif"
            fontStyle="italic"
          >
            <tspan x="426" y="380" textAnchor="middle">
              Estrategias destinadas
            </tspan>
            <tspan x="426" y="392" textAnchor="middle">
              al fracaso
            </tspan>
          </text>

          {/* ── Strategy arrows (5 arrows from center) ── */}
          {STRATEGIES.map((s) => {
            const isActive = position.segment === s.id
            const isHov = hovered === s.id
            const isSnap = snapPreview?.id === s.id
            const color =
              isActive || isHov || isSnap ? '#E8682A' : '#2D5016'
            const sw = isActive || isHov || isSnap ? 2.5 : 1.8
            const op = isActive || isHov || isSnap ? 1 : 0.65

            return (
              <g
                key={s.id}
                className={readOnly ? '' : 'cursor-pointer'}
                onClick={() => clickStrategy(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                opacity={op}
              >
                <line
                  x1={CX}
                  y1={CY}
                  x2={s.endX}
                  y2={s.endY}
                  stroke={color}
                  strokeWidth={sw}
                  className="transition-all duration-200"
                />
                <polygon
                  points={arrowHead(CX, CY, s.endX, s.endY)}
                  fill={color}
                  className="transition-all duration-200"
                />
                {/* Snap preview ring */}
                {isSnap && (
                  <circle
                    cx={s.endX}
                    cy={s.endY}
                    r={SNAP_R}
                    fill="none"
                    stroke="#E8682A"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    opacity="0.35"
                  />
                )}
              </g>
            )
          })}

          {/* ── Strategy labels (white bg + text) ── */}
          {STRATEGIES.map((s) => {
            const isActive = position.segment === s.id
            const fill = isActive ? '#E8682A' : '#1A1A1A'
            const fw = isActive ? '600' : '500'

            const maxLen = Math.max(...s.lines.map((l) => l.length))
            const bw = maxLen * 6.2 + 10
            const bh = s.lines.length * 14 + 6
            let bx: number
            if (s.labelAnchor === 'middle') bx = s.labelX - bw / 2
            else if (s.labelAnchor === 'end') bx = s.labelX - bw
            else bx = s.labelX
            const by = s.labelY - 12

            return (
              <g key={`lbl-${s.id}`}>
                <rect
                  x={bx - 2}
                  y={by}
                  width={bw + 4}
                  height={bh}
                  fill="#FAFAF7"
                  rx="2"
                  opacity="0.92"
                />
                <text
                  x={s.labelX}
                  y={s.labelY}
                  textAnchor={s.labelAnchor}
                  fill={fill}
                  fontSize="11"
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight={fw}
                >
                  {s.lines.map((ln, i) => (
                    <tspan key={i} x={s.labelX} dy={i === 0 ? 0 : 14}>
                      {ln}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}

          {/* ── Target position marker (outline star) ── */}
          {target && target.id !== position.segment && (
            <polygon
              points={starPts(target.endX, target.endY, 10, 4)}
              fill="none"
              stroke="#E8682A"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              opacity="0.45"
            />
          )}

          {/* ── Draggable star marker ── */}
          <polygon
            points={starPts(star.x, star.y)}
            fill={dragging ? '#E8682A' : '#8B8B7A'}
            stroke={dragging ? '#C4541E' : '#6B6B6B'}
            strokeWidth="1.5"
            className={
              readOnly
                ? ''
                : dragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
            }
            onMouseDown={onStarDown}
            onTouchStart={onStarDown}
          />

          {/* Instruction hint */}
          {!readOnly && position.segment === 0 && !dragging && (
            <g>
              <rect
                x={CX - 68}
                y={CY + 22}
                width="136"
                height="18"
                fill="#FAFAF7"
                rx="3"
              />
              <text
                x={CX}
                y={CY + 35}
                textAnchor="middle"
                fill="#8B8B7A"
                fontSize="10"
                fontFamily="'DM Sans', sans-serif"
                fontStyle="italic"
              >
                Arrastra la ★ a tu estrategia
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Reflection Panel (below SVG) ── */}
      {!readOnly && (
        <div className="space-y-4">
          {/* Current selection */}
          <div className="flex items-center gap-2 text-sm font-body">
            <span className="text-neutral">Estrategia actual:</span>
            {selected ? (
              <span className="font-semibold text-accent">
                {selected.name}
              </span>
            ) : (
              <span className="text-neutral italic">
                No seleccionada — arrastra la estrella
              </span>
            )}
          </div>

          {selected && (
            <p className="text-xs text-neutral font-body bg-neutral-lighter/50 rounded-lg px-3 py-2">
              {selected.description}
            </p>
          )}

          {/* Justification textarea */}
          <div className="field-group">
            <label className="field-label">
              ¿Por qué crees que tu negocio está en esta posición?
            </label>
            <textarea
              value={position.justification}
              onChange={(e) =>
                onChange({ ...position, justification: e.target.value })
              }
              placeholder="Explica por qué consideras que tu empresa se ubica en esta posición del reloj estratégico..."
              rows={3}
              className="field-input resize-y"
            />
          </div>

          {/* Target position selector */}
          <div className="field-group">
            <label className="field-label">
              ¿A cuál posición quisieras moverte?
            </label>
            <select
              value={position.targetPosition || ''}
              onChange={(e) =>
                onChange({
                  ...position,
                  targetPosition: Number(e.target.value),
                })
              }
              className="field-input"
            >
              <option value="" disabled>
                Selecciona una posición objetivo…
              </option>
              {STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Read-only display */}
      {readOnly && (
        <div className="space-y-3">
          {selected && (
            <p className="text-sm font-body text-foreground">
              📍 Estrategia actual:{' '}
              <span className="font-semibold text-accent">
                {selected.name}
              </span>
            </p>
          )}
          {position.justification && (
            <div className="space-y-1">
              <p className="text-sm font-heading font-semibold text-foreground">
                Justificación:
              </p>
              <p className="text-sm font-body text-neutral">
                {position.justification}
              </p>
            </div>
          )}
          {target && (
            <div className="space-y-1">
              <p className="text-sm font-heading font-semibold text-foreground">
                Posición objetivo:
              </p>
              <p className="text-sm font-body text-neutral">{target.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
