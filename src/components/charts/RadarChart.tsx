import { useState } from 'react'
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

export function RadarChart({ data, onChange, readOnly = false }: RadarChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const chartData = RADAR_CATEGORIES.map((cat) => {
    const found = data.find((d) => d.category === cat)
    return {
      category: cat,
      value: found?.value ?? 1,
      fullMark: 4,
    }
  })

  const handleSliderChange = (category: string, newValue: number) => {
    const updated = RADAR_CATEGORIES.map((cat) => {
      const existing = data.find((d) => d.category === cat)
      if (cat === category) return { category: cat, value: newValue }
      return { category: cat, value: existing?.value ?? 1 }
    })
    onChange(updated)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Chart */}
      <div className="w-full max-w-[400px]" style={{ aspectRatio: '1' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#D4D4C8" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#1A1A1A', fontFamily: 'DM Sans' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[1, 4]}
              tickCount={4}
              tick={{ fontSize: 10, fill: '#8B8B7A' }}
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
            const isHovered = hoveredCategory === category

            return (
              <div
                key={category}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <label className="text-sm font-body font-medium text-foreground flex-1 flex items-center gap-1.5">
                    {category}
                    <span className="relative inline-flex">
                      <HelpCircle size={14} className="text-neutral hover:text-accent transition-colors" />
                      {isHovered && description && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-foreground text-white text-xs rounded-lg shadow-lg z-50 font-normal leading-relaxed">
                          {description}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                        </span>
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
                  onChange={(e) => handleSliderChange(category, Number(e.target.value))}
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
