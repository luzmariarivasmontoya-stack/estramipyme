import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { HelpCircle } from 'lucide-react'
import { RADAR_CATEGORIES } from '@/utils/constants'
import type { RadarData } from '@/types/stages'

interface RadarChartProps {
  data: RadarData[]
  onChange: (data: RadarData[]) => void
  readOnly?: boolean
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Conocimiento del cliente': '¿Qué tan bien conoces a tu cliente, sus necesidades, frustraciones y expectativas?',
  'Conocimiento del negocio': '¿Qué tan bien entiendes tu industria, competencia y tendencias del mercado?',
  'Coherencia del modelo': '¿Tu propuesta de valor, segmentos y canales están alineados entre sí?',
  'Alineación interna': '¿Tu equipo comparte la visión, y los procesos internos apoyan la estrategia?',
  'Salud financiera': '¿Tu empresa tiene viabilidad financiera, control de costos y márgenes saludables?',
}

const SCALE_LABELS: Record<number, string> = {
  1: 'Bajo',
  2: 'Medio',
  3: 'Alto',
  4: 'Muy alto',
}

/**
 * Split text into two lines if longer than 15 characters.
 * Splits at the space nearest to the middle of the string.
 */
function splitLabel(text: string): string[] {
  if (text.length <= 15) return [text]
  const mid = Math.floor(text.length / 2)
  let bestIndex = -1
  let bestDist = Infinity
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      const dist = Math.abs(i - mid)
      if (dist < bestDist) {
        bestDist = dist
        bestIndex = i
      }
    }
  }
  if (bestIndex === -1) return [text]
  return [text.slice(0, bestIndex), text.slice(bestIndex + 1)]
}

/**
 * Custom tick renderer for PolarAngleAxis.
 * Positions labels correctly based on their angle around the chart center,
 * and splits long labels into two lines using <tspan>.
 */
function CustomAngleTick(props: {
  payload: { value: string }
  x: number
  y: number
  cx: number
  cy: number
  index: number
}) {
  const { payload, x, y, cx, cy } = props
  const label = payload.value
  const lines = splitLabel(label)

  // Calculate angle from center to this tick position (in degrees)
  const dx = x - cx
  const dy = y - cy
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Determine textAnchor based on horizontal position
  let textAnchor: 'start' | 'middle' | 'end' = 'middle'
  if (angle > -60 && angle < 60) {
    // Right side
    textAnchor = 'start'
  } else if (angle > 120 || angle < -120) {
    // Left side
    textAnchor = 'end'
  }

  // Determine vertical offset based on vertical position
  let verticalDy = 0
  if (dy < -10) {
    // Top labels: shift up
    verticalDy = -8
  } else if (dy > 10) {
    // Bottom labels: shift down
    verticalDy = 14
  } else {
    verticalDy = 4
  }

  // Offset the label slightly away from the chart center for breathing room
  const offsetDistance = 8
  const dist = Math.sqrt(dx * dx + dy * dy)
  const offsetX = dist > 0 ? (dx / dist) * offsetDistance : 0
  const offsetY = dist > 0 ? (dy / dist) * offsetDistance : 0

  const lineHeight = 15

  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      textAnchor={textAnchor}
      dy={verticalDy}
      style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '12px',
        fill: '#4A4A4A',
      }}
    >
      {lines.map((line, i) => (
        <tspan
          key={i}
          x={x + offsetX}
          dy={i === 0 ? 0 : lineHeight}
        >
          {line}
        </tspan>
      ))}
    </text>
  )
}

export function RadarChart({ data, onChange, readOnly = false }: RadarChartProps) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)
  const tooltipRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const chartData = RADAR_CATEGORIES.map((cat) => {
    const found = data.find((d) => d.category === cat)
    return {
      category: cat,
      value: found?.value ?? 1,
      fullMark: 4,
    }
  })

  const handleSliderChange = useCallback(
    (category: string, newValue: number) => {
      const updated = RADAR_CATEGORIES.map((cat) => {
        const existing = data.find((d) => d.category === cat)
        if (cat === category) return { category: cat, value: newValue }
        return { category: cat, value: existing?.value ?? 1 }
      })
      onChange(updated)
    },
    [data, onChange]
  )

  // Close tooltip on click outside
  useEffect(() => {
    if (!openTooltip) return

    function handleClickOutside(e: MouseEvent) {
      const tooltipEl = tooltipRefs.current.get(openTooltip!)
      const buttonEl = buttonRefs.current.get(openTooltip!)
      const target = e.target as Node
      if (
        tooltipEl && !tooltipEl.contains(target) &&
        buttonEl && !buttonEl.contains(target)
      ) {
        setOpenTooltip(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openTooltip])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Chart */}
      <div className="w-full max-w-[460px]" style={{ overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadarChart
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
          >
            <PolarGrid stroke="#D4D4C8" />
            <PolarAngleAxis
              dataKey="category"
              tick={(tickProps: Record<string, unknown>) => <CustomAngleTick {...(tickProps as Parameters<typeof CustomAngleTick>[0])} />}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 4]}
              tickCount={5}
              tick={{ fontSize: 10, fill: '#8B8B7A', fontFamily: 'DM Sans' }}
            />
            <Radar
              name="Capacidades"
              dataKey="value"
              stroke="#E8682A"
              fill="#E8682A"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      {!readOnly && (
        <div className="w-full max-w-lg space-y-4">
          {RADAR_CATEGORIES.map((category) => {
            const item = chartData.find((d) => d.category === category)
            const value = item?.value ?? 1
            const description = CATEGORY_DESCRIPTIONS[category]
            const isTooltipOpen = openTooltip === category

            return (
              <div key={category} className="relative">
                <div className="flex items-center gap-3 mb-1">
                  <label className="text-sm font-body font-medium text-foreground flex-1 flex items-center gap-1.5">
                    {category}
                    <span className="relative inline-flex">
                      <button
                        type="button"
                        ref={(el) => {
                          if (el) buttonRefs.current.set(category, el)
                        }}
                        onClick={() =>
                          setOpenTooltip(isTooltipOpen ? null : category)
                        }
                        className="inline-flex items-center"
                        aria-label={`Información sobre ${category}`}
                      >
                        <HelpCircle
                          size={14}
                          className="text-neutral hover:text-accent transition-colors"
                        />
                      </button>
                      {isTooltipOpen && description && (
                        <div
                          ref={(el) => {
                            if (el) tooltipRefs.current.set(category, el)
                          }}
                          className="absolute bottom-full left-0 mb-2 max-w-[240px] p-2.5 bg-foreground text-white text-xs rounded-lg shadow-lg z-50 font-body font-normal leading-relaxed"
                        >
                          {description}
                          <span className="absolute top-full left-4 border-4 border-transparent border-t-foreground" />
                        </div>
                      )}
                    </span>
                  </label>
                  <span className="text-sm font-body text-accent font-semibold w-20 text-right">
                    {value} - {SCALE_LABELS[value]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(category, Number(e.target.value))
                  }
                  className="w-full h-2 accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral font-body mt-0.5">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                </div>
              </div>
            )
          })}
          <p className="text-xs text-neutral font-body text-center pt-2">
            Escala: 1 (Bajo) - 2 (Medio) - 3 (Alto) - 4 (Muy alto)
          </p>
        </div>
      )}
    </div>
  )
}
