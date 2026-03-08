import { useRef, useCallback, useState } from 'react'
import type { StrategicClockPosition } from '@/types/stages'

interface StrategicClockProps {
  position: StrategicClockPosition
  onChange: (position: StrategicClockPosition) => void
  readOnly?: boolean
}

/*
 * Bowman's Strategic Clock
 * 8 segments arranged clockwise starting from the top-right.
 * Each segment spans 45 degrees.
 * Segment 1 starts at -90 degrees (12 o'clock) and moves clockwise.
 *
 * Layout:
 *   Y axis: Valor Percibido (low at bottom, high at top)
 *   X axis: Precio (low at left, high at right)
 */

interface Segment {
  number: number
  label: string
  startAngle: number // degrees, 0 = right, clockwise
  tooltip: string
}

const SEGMENTS: Segment[] = [
  {
    number: 1,
    label: 'Bajo precio / bajo valor',
    startAngle: -112.5,
    tooltip: 'Bajo precio, bajo valor percibido. Productos basicos sin diferenciacion, competencia en costos minimos.',
  },
  {
    number: 2,
    label: 'Bajo precio',
    startAngle: -67.5,
    tooltip: 'Precio bajo con valor aceptable. Estrategia tipo "lider en costos", busca volumen de ventas.',
  },
  {
    number: 3,
    label: 'Hibrido',
    startAngle: -22.5,
    tooltip: 'Combinacion de precio bajo y buen valor percibido. Ofrece diferenciacion a precios competitivos.',
  },
  {
    number: 4,
    label: 'Diferenciacion',
    startAngle: 22.5,
    tooltip: 'Alto valor percibido a precio razonable. Destaca por calidad, marca o innovacion.',
  },
  {
    number: 5,
    label: 'Diferenciacion enfocada',
    startAngle: 67.5,
    tooltip: 'Maximo valor percibido, precio premium. Productos o servicios exclusivos para nichos especificos.',
  },
  {
    number: 6,
    label: 'Alto precio / estandar',
    startAngle: 112.5,
    tooltip: 'Precio alto sin valor diferenciado. Riesgo de perder clientes frente a alternativas mas competitivas.',
  },
  {
    number: 7,
    label: 'Precio elevado / bajo valor',
    startAngle: 157.5,
    tooltip: 'Precio elevado con bajo valor percibido. Posicion insostenible, solo viable con monopolio o cautividad.',
  },
  {
    number: 8,
    label: 'Bajo valor / precio estandar',
    startAngle: -157.5,
    tooltip: 'Valor bajo a precio estandar. Posicion de desventaja competitiva, riesgo de perdida de mercado.',
  },
]

const SVG_SIZE = 440
const CENTER = SVG_SIZE / 2
const CLOCK_RADIUS = 170
const LABEL_RADIUS = CLOCK_RADIUS + 28
const MARKER_RADIUS = 10

/** Convert degrees to radians */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Get (x, y) from center, radius and angle (degrees, 0=right, clockwise) */
function polarToXY(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = degToRad(angleDeg)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

/** Calculate which segment a given angle falls into (1-8) */
function angleToSegment(angleDeg: number): number {
  // Normalize to 0..360
  let a = ((angleDeg % 360) + 360) % 360
  // Shift so segment 1 starts at top-left of clock
  a = (a + 112.5) % 360
  const seg = Math.floor(a / 45) + 1
  return Math.min(Math.max(seg, 1), 8)
}

/** Build an SVG arc path between two angles at a given radius */
function arcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToXY(cx, cy, radius, startAngle)
  const end = polarToXY(cx, cy, radius, endAngle)
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

// Soft alternating fills for segments
const SEGMENT_FILLS = [
  '#f0f4f8', // 1
  '#e8f0fe', // 2
  '#e3f2e8', // 3
  '#dff0f7', // 4
  '#e8e3f2', // 5
  '#fef3e8', // 6
  '#fce8e8', // 7
  '#f5f0e3', // 8
]

export function StrategicClock({
  position,
  onChange,
  readOnly = false,
}: StrategicClockProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  /** Convert pointer event to angle + distance, then call onChange */
  const handlePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (readOnly || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const scale = SVG_SIZE / rect.width
      const px = (clientX - rect.left) * scale - CENTER
      const py = (clientY - rect.top) * scale - CENTER
      const dist = Math.sqrt(px * px + py * py)
      if (dist < 10) return // too close to center

      const angleDeg = (Math.atan2(py, px) * 180) / Math.PI
      const segment = angleToSegment(angleDeg)
      const normalizedAngle = ((angleDeg % 360) + 360) % 360

      onChange({
        ...position,
        segment,
        angle: normalizedAngle,
      })

      void dist
    },
    [readOnly, onChange, position]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (readOnly) return
      setIsDragging(true)
      svgRef.current?.setPointerCapture(e.pointerId)
      handlePointerPosition(e.clientX, e.clientY)
    },
    [readOnly, handlePointerPosition]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging || readOnly) return
      handlePointerPosition(e.clientX, e.clientY)
    },
    [isDragging, readOnly, handlePointerPosition]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging) return
      setIsDragging(false)
      svgRef.current?.releasePointerCapture(e.pointerId)
    },
    [isDragging]
  )

  /** Handle segment hover for tooltips */
  const handleSegmentMouseEnter = (segNumber: number, e: React.MouseEvent) => {
    setHoveredSegment(segNumber)
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (svgRect) {
      setTooltipPos({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      })
    }
  }

  const handleSegmentMouseMove = (e: React.MouseEvent) => {
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (svgRect) {
      setTooltipPos({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      })
    }
  }

  const handleSegmentMouseLeave = () => {
    setHoveredSegment(null)
  }

  // Compute marker position from stored angle
  const markerDistance = CLOCK_RADIUS * 0.65
  const markerAngleRad = degToRad(position.angle)
  const markerX = CENTER + markerDistance * Math.cos(markerAngleRad)
  const markerY = CENTER + markerDistance * Math.sin(markerAngleRad)

  // Get current segment info
  const currentSegment = SEGMENTS.find((s) => s.number === position.segment)
  const hoveredSegmentData = SEGMENTS.find((s) => s.number === hoveredSegment)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG container with relative positioning for tooltip overlay */}
      <div className="relative w-full max-w-md">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className={`w-full select-none ${
            readOnly ? '' : 'cursor-crosshair'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          {/* Background circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CLOCK_RADIUS}
            fill="#fafbfc"
            stroke="#d1d5db"
            strokeWidth={1.5}
          />

          {/* Segments */}
          {SEGMENTS.map((seg, i) => {
            const startA = seg.startAngle
            const endA = startA + 45
            const isActive = position.segment === seg.number
            const isHovered = hoveredSegment === seg.number

            return (
              <path
                key={seg.number}
                d={arcPath(CENTER, CENTER, CLOCK_RADIUS, startA, endA)}
                fill={isActive ? '#e0e7ff' : isHovered ? '#eef2ff' : SEGMENT_FILLS[i]}
                stroke="#c7cdd5"
                strokeWidth={0.8}
                className="transition-colors duration-200"
                onMouseEnter={(e) => handleSegmentMouseEnter(seg.number, e)}
                onMouseMove={handleSegmentMouseMove}
                onMouseLeave={handleSegmentMouseLeave}
              />
            )
          })}

          {/* Axes */}
          {/* X axis (Precio) */}
          <line
            x1={CENTER - CLOCK_RADIUS - 10}
            y1={CENTER}
            x2={CENTER + CLOCK_RADIUS + 10}
            y2={CENTER}
            stroke="#94a3b8"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            className="pointer-events-none"
          />
          {/* Y axis (Valor Percibido) */}
          <line
            x1={CENTER}
            y1={CENTER - CLOCK_RADIUS - 10}
            x2={CENTER}
            y2={CENTER + CLOCK_RADIUS + 10}
            stroke="#94a3b8"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            className="pointer-events-none"
          />

          {/* Axis labels */}
          <text
            x={CENTER + CLOCK_RADIUS + 16}
            y={CENTER + 5}
            textAnchor="start"
            className="fill-neutral text-[11px] font-body pointer-events-none"
          >
            Precio +
          </text>
          <text
            x={CENTER - CLOCK_RADIUS - 16}
            y={CENTER + 5}
            textAnchor="end"
            className="fill-neutral text-[11px] font-body pointer-events-none"
          >
            Precio -
          </text>
          <text
            x={CENTER}
            y={CENTER - CLOCK_RADIUS - 16}
            textAnchor="middle"
            className="fill-neutral text-[11px] font-body pointer-events-none"
          >
            Valor +
          </text>
          <text
            x={CENTER}
            y={CENTER + CLOCK_RADIUS + 24}
            textAnchor="middle"
            className="fill-neutral text-[11px] font-body pointer-events-none"
          >
            Valor -
          </text>

          {/* Segment divider lines */}
          {SEGMENTS.map((seg) => {
            const p = polarToXY(CENTER, CENTER, CLOCK_RADIUS, seg.startAngle)
            return (
              <line
                key={`line-${seg.number}`}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="#c7cdd5"
                strokeWidth={0.8}
                className="pointer-events-none"
              />
            )
          })}

          {/* Segment number labels (inside the segment) */}
          {SEGMENTS.map((seg) => {
            const midAngle = seg.startAngle + 22.5
            const labelPos = polarToXY(CENTER, CENTER, CLOCK_RADIUS * 0.4, midAngle)
            return (
              <text
                key={`num-${seg.number}`}
                x={labelPos.x}
                y={labelPos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-neutral text-xs font-heading font-semibold pointer-events-none"
              >
                {seg.number}
              </text>
            )
          })}

          {/* Segment text labels (outside the circle) */}
          {SEGMENTS.map((seg) => {
            const midAngle = seg.startAngle + 22.5
            const pos = polarToXY(CENTER, CENTER, LABEL_RADIUS, midAngle)

            // Decide text-anchor based on x position relative to center
            let anchor: 'start' | 'middle' | 'end' = 'middle'
            if (pos.x > CENTER + 20) anchor = 'start'
            else if (pos.x < CENTER - 20) anchor = 'end'
            else anchor = 'middle'

            // Break label into lines for long labels
            const words = seg.label.split(' / ')
            const isTwoLine = words.length === 2

            return (
              <text
                key={`label-${seg.number}`}
                x={pos.x}
                y={pos.y}
                textAnchor={anchor}
                dominantBaseline="central"
                className="fill-foreground text-[9px] font-body pointer-events-none"
              >
                {isTwoLine ? (
                  <>
                    <tspan x={pos.x} dy="-0.5em">
                      {words[0]}
                    </tspan>
                    <tspan x={pos.x} dy="1.2em">
                      {words[1]}
                    </tspan>
                  </>
                ) : (
                  seg.label
                )}
              </text>
            )
          })}

          {/* Center dot */}
          <circle cx={CENTER} cy={CENTER} r={3} fill="#94a3b8" className="pointer-events-none" />

          {/* Position marker */}
          <circle
            cx={markerX}
            cy={markerY}
            r={MARKER_RADIUS}
            className={`${
              readOnly
                ? 'fill-accent/80'
                : isDragging
                  ? 'fill-accent'
                  : 'fill-accent/90'
            } transition-colors pointer-events-none`}
            stroke="white"
            strokeWidth={3}
            filter="url(#markerShadow)"
            style={{ cursor: readOnly ? 'default' : 'grab' }}
          />

          {/* Inner ring marker decoration */}
          <circle
            cx={markerX}
            cy={markerY}
            r={4}
            fill="white"
            className="pointer-events-none"
          />

          {/* SVG filter for marker shadow */}
          <defs>
            <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>
        </svg>

        {/* Tooltip overlay */}
        {hoveredSegmentData && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 12,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="max-w-[220px] px-3 py-2 bg-foreground text-white text-xs font-body rounded-lg shadow-lg">
              <span className="font-semibold">{hoveredSegmentData.number}. {hoveredSegmentData.label}</span>
              <br />
              <span className="text-white/80">{hoveredSegmentData.tooltip}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Current position label */}
      {currentSegment && (
        <div className="text-center">
          <p className="text-sm font-body text-neutral">Posicion actual:</p>
          <p className="text-base font-heading font-semibold text-foreground">
            {currentSegment.number}. {currentSegment.label}
          </p>
        </div>
      )}

      {!readOnly && (
        <p className="text-xs text-neutral font-body text-center max-w-sm">
          Haz clic o arrastra el marcador en el reloj para indicar la posicion
          estrategica actual de tu empresa.
        </p>
      )}

      {/* Justification textarea */}
      {!readOnly && (
        <div className="w-full space-y-2">
          <label className="text-sm font-heading font-semibold text-foreground">
            ¿Por que tu negocio esta en esta posicion?
          </label>
          <textarea
            value={position.justification}
            onChange={(e) =>
              onChange({ ...position, justification: e.target.value })
            }
            placeholder="Explica por que consideras que tu empresa se ubica en esta posicion del reloj estrategico..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-neutral-lighter bg-white
              text-foreground font-body text-sm placeholder:text-neutral resize-y
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      )}

      {/* Read-only justification display */}
      {readOnly && position.justification && (
        <div className="w-full space-y-1">
          <p className="text-sm font-heading font-semibold text-foreground">
            Justificacion:
          </p>
          <p className="text-sm font-body text-neutral">
            {position.justification}
          </p>
        </div>
      )}
    </div>
  )
}
