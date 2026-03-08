import { InfoTooltip } from '@/components/common/InfoTooltip'
import type { IndustryAnalysis as IndustryAnalysisType } from '@/types/stages'

interface IndustryAnalysisProps {
  data: IndustryAnalysisType
  onChange: (data: IndustryAnalysisType) => void
}

interface ForceConfig {
  key: 'rivalry' | 'newEntrants' | 'substitutes' | 'buyerPower' | 'supplierPower'
  label: string
  tooltip: string
  detailKey?: 'competitorsDetail' | 'newEntrantsDetail' | 'substitutesDetail'
  detailQuestion?: string
}

const FORCES: ForceConfig[] = [
  {
    key: 'rivalry',
    label: 'Rivalidad entre competidores',
    tooltip:
      'Evalua la intensidad de la competencia en tu industria. Un valor alto indica muchos competidores fuertes, guerras de precios frecuentes y baja diferenciacion entre productos.',
    detailKey: 'competitorsDetail',
    detailQuestion: '¿Quienes son los principales competidores?',
  },
  {
    key: 'newEntrants',
    label: 'Amenaza de nuevos entrantes',
    tooltip:
      'Evalua que tan facil es para nuevos competidores ingresar a tu mercado. Un valor alto indica pocas barreras de entrada como costos bajos de inicio, poca regulacion o tecnologia accesible.',
    detailKey: 'newEntrantsDetail',
    detailQuestion: '¿Que nuevos entrantes amenazan?',
  },
  {
    key: 'substitutes',
    label: 'Amenaza de productos sustitutos',
    tooltip:
      'Evalua la probabilidad de que los clientes reemplacen tu producto o servicio por alternativas. Un valor alto indica que existen muchas alternativas disponibles y el costo de cambio es bajo.',
    detailKey: 'substitutesDetail',
    detailQuestion: '¿Que sustitutos existen?',
  },
  {
    key: 'buyerPower',
    label: 'Poder de negociacion de compradores',
    tooltip:
      'Evalua cuanto poder tienen tus clientes para influir en precios y condiciones. Un valor alto indica que los compradores estan concentrados, compran en gran volumen o pueden cambiar facilmente de proveedor.',
  },
  {
    key: 'supplierPower',
    label: 'Poder de negociacion de proveedores',
    tooltip:
      'Evalua cuanto poder tienen tus proveedores sobre precios y disponibilidad. Un valor alto indica pocos proveedores disponibles, materias primas unicas o altos costos de cambio de proveedor.',
  },
]

function getSliderColor(value: number): string {
  if (value <= 3) return '#22c55e' // green-500
  if (value <= 6) return '#eab308' // yellow-500
  return '#ef4444' // red-500
}

function getSliderBackground(value: number): string {
  const pct = (value / 10) * 100
  const color = getSliderColor(value)
  return `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`
}

function ForceSlider({
  config,
  value,
  onChange,
  detailValue,
  onDetailChange,
}: {
  config: ForceConfig
  value: number
  onChange: (val: number) => void
  detailValue?: string
  onDetailChange?: (val: string) => void
}) {
  const color = getSliderColor(value)
  const levelLabel = value <= 3 ? 'Bajo' : value <= 6 ? 'Medio' : 'Alto'

  return (
    <div className="space-y-3">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="text-sm font-heading font-semibold text-foreground">
            {config.label}
          </label>
          <InfoTooltip text={config.tooltip} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {levelLabel}
          </span>
          <span className="text-sm font-body font-semibold text-foreground min-w-[2ch] text-right">
            {value}
          </span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-current
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-current
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer"
        style={{
          background: getSliderBackground(value),
          color: color,
        }}
      />

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-neutral font-body px-0.5">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>

      {/* Detail text input (for forces that have one) */}
      {config.detailKey && config.detailQuestion && onDetailChange !== undefined && (
        <div className="pt-1">
          <label className="text-xs font-medium text-neutral">
            {config.detailQuestion}
          </label>
          <input
            type="text"
            value={detailValue ?? ''}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
              text-foreground font-body text-sm placeholder:text-neutral
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      )}
    </div>
  )
}

export function IndustryAnalysis({ data, onChange }: IndustryAnalysisProps) {
  const handleForceChange = (
    key: 'rivalry' | 'newEntrants' | 'substitutes' | 'buyerPower' | 'supplierPower',
    value: number
  ) => {
    onChange({ ...data, [key]: value })
  }

  const handleDetailChange = (
    key: 'competitorsDetail' | 'newEntrantsDetail' | 'substitutesDetail',
    value: string
  ) => {
    onChange({ ...data, [key]: value })
  }

  const handleNotesChange = (notes: string) => {
    onChange({ ...data, notes })
  }

  return (
    <div className="space-y-8">
      {/* Force sliders */}
      <div className="space-y-6">
        {FORCES.map((force) => (
          <ForceSlider
            key={force.key}
            config={force}
            value={data[force.key]}
            onChange={(val) => handleForceChange(force.key, val)}
            detailValue={force.detailKey ? data[force.detailKey] : undefined}
            onDetailChange={
              force.detailKey
                ? (val) => handleDetailChange(force.detailKey!, val)
                : undefined
            }
          />
        ))}
      </div>

      {/* Notes textarea */}
      <div className="space-y-2">
        <label className="text-sm font-heading font-semibold text-foreground">
          Notas generales del analisis
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Escribe tus observaciones generales sobre las fuerzas competitivas de tu industria..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-neutral-lighter bg-white
            text-foreground font-body text-sm placeholder:text-neutral resize-y
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>
    </div>
  )
}
