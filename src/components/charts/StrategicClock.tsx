import { useState } from 'react'
import type { StrategicClockPosition } from '@/types/stages'

interface StrategicClockProps {
  position: StrategicClockPosition
  onChange: (position: StrategicClockPosition) => void
  readOnly?: boolean
}

/*
 * Bowman's Strategic Clock — Cartesian Plane Implementation
 * X axis: Precio (low left, high right)
 * Y axis: Valor Percibido (low bottom, high top)
 * 8 position circles placed on the plane
 */

interface ClockPosition {
  id: number
  name: string
  cx: number
  cy: number
  failure: boolean
  description: string
}

const POSITIONS: ClockPosition[] = [
  {
    id: 1,
    name: 'Sin frills',
    cx: 110,
    cy: 310,
    failure: false,
    description: 'Precio bajo, bajo valor percibido. Productos basicos sin diferenciacion.',
  },
  {
    id: 2,
    name: 'Precio bajo',
    cx: 90,
    cy: 220,
    failure: false,
    description: 'Precio bajo con valor aceptable. Estrategia tipo lider en costos.',
  },
  {
    id: 3,
    name: 'Hibrida',
    cx: 130,
    cy: 140,
    failure: false,
    description: 'Combinacion de precio bajo y buen valor percibido. Diferenciacion a precios competitivos.',
  },
  {
    id: 4,
    name: 'Diferenciacion',
    cx: 210,
    cy: 90,
    failure: false,
    description: 'Alto valor percibido a precio razonable. Destaca por calidad, marca o innovacion.',
  },
  {
    id: 5,
    name: 'Dif. segmentada',
    cx: 310,
    cy: 90,
    failure: false,
    description: 'Maximo valor percibido, precio premium. Productos exclusivos para nichos especificos.',
  },
  {
    id: 6,
    name: 'Mayor precio / valor std',
    cx: 340,
    cy: 180,
    failure: true,
    description: 'Precio alto sin valor diferenciado. Riesgo de perder clientes frente a alternativas.',
  },
  {
    id: 7,
    name: 'Mayor precio / bajo valor',
    cx: 320,
    cy: 280,
    failure: true,
    description: 'Precio elevado con bajo valor percibido. Posicion insostenible.',
  },
  {
    id: 8,
    name: 'Bajo valor / precio std',
    cx: 220,
    cy: 320,
    failure: true,
    description: 'Valor bajo a precio estandar. Desventaja competitiva, riesgo de perdida de mercado.',
  },
]

/** Build SVG path for the dashed arc connecting viable strategies (1→2→3→4→5) */
function viableStrategiesPath(): string {
  const viablePositions = POSITIONS.filter((p) => p.id >= 1 && p.id <= 5).sort(
    (a, b) => a.id - b.id
  )
  if (viablePositions.length < 2) return ''

  const points = viablePositions.map((p) => ({ x: p.cx, y: p.cy }))

  // Build a smooth quadratic bezier curve through the points
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midX = (prev.x + curr.x) / 2
    const midY = (prev.y + curr.y) / 2
    d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`
  }
  // Final segment to last point
  const last = points[points.length - 1]
  const secondLast = points[points.length - 2]
  d += ` Q ${secondLast.x} ${secondLast.y} ${last.x} ${last.y}`

  return d
}

const CIRCLE_RADIUS = 18

export function StrategicClock({
  position,
  onChange,
  readOnly = false,
}: StrategicClockProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const selectedId = position.segment

  const handleSelectPosition = (id: number) => {
    if (readOnly) return
    onChange({
      ...position,
      segment: id,
      angle: id * 45, // Keep angle consistent with segment
    })
  }

  const selectedPosition = POSITIONS.find((p) => p.id === selectedId)

  return (
    <div className="flex flex-col gap-6">
      {/* Main layout: SVG + Legend side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SVG Cartesian Plane */}
        <div className="w-full max-w-[420px] flex-shrink-0">
          <svg
            viewBox="0 0 400 400"
            className="w-full select-none"
            style={{ touchAction: 'none' }}
          >
            {/* Background */}
            <rect x="0" y="0" width="400" height="400" fill="#FAFAF7" rx="8" />

            {/* Quadrant shading for context */}
            {/* Top-left: Low price, High value (good zone) */}
            <rect x="0" y="0" width="200" height="200" fill="#f0fdf4" opacity="0.4" />
            {/* Bottom-right: High price, Low value (bad zone) */}
            <rect x="200" y="200" width="200" height="200" fill="#fef2f2" opacity="0.3" />

            {/* X axis (horizontal) at y=200 */}
            <line
              x1="20"
              y1="200"
              x2="380"
              y2="200"
              stroke="#8B8B7A"
              strokeWidth="1.2"
            />
            {/* X axis arrow right */}
            <polygon points="380,200 372,196 372,204" fill="#8B8B7A" />
            {/* X axis arrow left */}
            <polygon points="20,200 28,196 28,204" fill="#8B8B7A" />

            {/* Y axis (vertical) at x=200 */}
            <line
              x1="200"
              y1="20"
              x2="200"
              y2="380"
              stroke="#8B8B7A"
              strokeWidth="1.2"
            />
            {/* Y axis arrow top */}
            <polygon points="200,20 196,28 204,28" fill="#8B8B7A" />
            {/* Y axis arrow bottom */}
            <polygon points="200,380 196,372 204,372" fill="#8B8B7A" />

            {/* Axis labels */}
            <text
              x="380"
              y="216"
              textAnchor="end"
              className="text-[11px]"
              fill="#8B8B7A"
              fontFamily="'DM Sans', sans-serif"
            >
              Precio alto
            </text>
            <text
              x="20"
              y="216"
              textAnchor="start"
              className="text-[11px]"
              fill="#8B8B7A"
              fontFamily="'DM Sans', sans-serif"
            >
              Precio bajo
            </text>
            <text
              x="200"
              y="16"
              textAnchor="middle"
              className="text-[11px]"
              fill="#8B8B7A"
              fontFamily="'DM Sans', sans-serif"
            >
              Valor alto
            </text>
            <text
              x="200"
              y="396"
              textAnchor="middle"
              className="text-[11px]"
              fill="#8B8B7A"
              fontFamily="'DM Sans', sans-serif"
            >
              Valor bajo
            </text>

            {/* Dashed curve connecting viable strategies 1→2→3→4→5 */}
            <path
              d={viableStrategiesPath()}
              fill="none"
              stroke="#8B8B7A"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              className="pointer-events-none"
              opacity="0.6"
            />

            {/* Position circles */}
            {POSITIONS.map((pos) => {
              const isSelected = selectedId === pos.id
              const isHovered = hoveredId === pos.id

              // Determine fill and stroke
              let fill = 'white'
              let stroke = '#d1d5db'
              let strokeWidth = 1.5
              let textFill = '#1A1A1A'

              if (pos.failure && !isSelected) {
                fill = '#FEF2F2'
                stroke = '#ef4444'
                strokeWidth = 1.5
              }

              if (isSelected) {
                fill = '#E8682A'
                stroke = '#E8682A'
                strokeWidth = 2
                textFill = 'white'
              } else if (isHovered) {
                fill = pos.failure ? '#fee2e2' : '#f3f4f6'
                strokeWidth = 2
                stroke = pos.failure ? '#ef4444' : '#9ca3af'
              }

              return (
                <g
                  key={pos.id}
                  className={readOnly ? '' : 'cursor-pointer'}
                  onClick={() => handleSelectPosition(pos.id)}
                  onMouseEnter={() => setHoveredId(pos.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={CIRCLE_RADIUS}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200"
                  />
                  <text
                    x={pos.cx}
                    y={pos.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textFill}
                    className="text-[13px] pointer-events-none"
                    fontFamily="'Playfair Display', serif"
                    fontWeight="600"
                  >
                    {pos.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend Panel */}
        <div className="w-full lg:flex-1 space-y-1.5">
          <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
            Posiciones estrategicas
          </h4>
          {POSITIONS.map((pos) => {
            const isSelected = selectedId === pos.id
            const isHovered = hoveredId === pos.id

            return (
              <button
                key={pos.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectPosition(pos.id)}
                onMouseEnter={() => setHoveredId(pos.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                  border border-transparent
                  ${readOnly ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'}
                  ${
                    isSelected
                      ? 'border-l-[3px] border-l-accent bg-orange-50'
                      : isHovered
                        ? pos.failure
                          ? 'bg-red-50/80'
                          : 'bg-gray-50'
                        : pos.failure
                          ? 'bg-[#FEF2F2]'
                          : 'bg-white'
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`
                      inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-heading font-semibold flex-shrink-0 mt-0.5
                      ${
                        isSelected
                          ? 'bg-accent text-white'
                          : pos.failure
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-foreground'
                      }
                    `}
                  >
                    {pos.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-body font-medium text-foreground leading-tight">
                        {pos.name}
                      </span>
                      {pos.failure && (
                        <span className="text-xs text-red-500 flex-shrink-0" title="Estrategia destinada al fracaso">
                          ⚠️
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-body text-neutral leading-snug mt-0.5">
                      {pos.description}
                    </p>
                    {pos.failure && (
                      <p className="text-[10px] font-body text-red-500 mt-0.5 leading-tight">
                        Estrategia destinada al fracaso
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reflection Section */}
      {!readOnly && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Current selection indicator */}
          {selectedPosition && (
            <p className="text-sm font-body text-foreground">
              📍 Posicion actual seleccionada:{' '}
              <span className="font-semibold text-accent">
                {selectedPosition.id}. {selectedPosition.name}
              </span>
            </p>
          )}

          {/* Justification textarea */}
          <div className="space-y-1.5">
            <label className="text-sm font-heading font-semibold text-foreground">
              ¿Por que crees que tu negocio esta en esta posicion?
            </label>
            <textarea
              value={position.justification}
              onChange={(e) =>
                onChange({ ...position, justification: e.target.value })
              }
              placeholder="Explica por que consideras que tu empresa se ubica en esta posicion del reloj estrategico..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white
                text-foreground font-body text-sm placeholder:text-neutral resize-y
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Target position dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-heading font-semibold text-foreground">
              ¿A cual posicion quisieras moverte?
            </label>
            <select
              value={position.targetPosition || ''}
              onChange={(e) =>
                onChange({
                  ...position,
                  targetPosition: Number(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white
                text-foreground font-body text-sm
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            >
              <option value="" disabled>
                Selecciona una posicion objetivo...
              </option>
              {POSITIONS.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.id}. {pos.name}
                  {pos.failure ? ' (⚠️ riesgo de fracaso)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Read-only display */}
      {readOnly && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          {selectedPosition && (
            <p className="text-sm font-body text-foreground">
              📍 Posicion actual:{' '}
              <span className="font-semibold text-accent">
                {selectedPosition.id}. {selectedPosition.name}
              </span>
            </p>
          )}
          {position.justification && (
            <div className="space-y-1">
              <p className="text-sm font-heading font-semibold text-foreground">
                Justificacion:
              </p>
              <p className="text-sm font-body text-neutral">
                {position.justification}
              </p>
            </div>
          )}
          {position.targetPosition > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-heading font-semibold text-foreground">
                Posicion objetivo:
              </p>
              <p className="text-sm font-body text-neutral">
                {position.targetPosition}.{' '}
                {POSITIONS.find((p) => p.id === position.targetPosition)?.name ?? ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
