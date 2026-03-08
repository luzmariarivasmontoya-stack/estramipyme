import { useState, type KeyboardEvent } from 'react'
import { InfoTooltip } from '@/components/common/InfoTooltip'
import { X } from 'lucide-react'
import type { IndustryAnalysis as IndustryAnalysisType } from '@/types/stages'

interface IndustryAnalysisProps {
  data: IndustryAnalysisType
  onChange: (data: IndustryAnalysisType) => void
}

/* ── helpers ─────────────────────────────────────────────────── */

/** Parse a comma-separated string into an array of trimmed, non-empty chips */
function parseChips(csv: string): string[] {
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Join chip array back to comma-separated string */
function joinChips(chips: string[]): string {
  return chips.join(', ')
}

function getSliderColor(value: number): string {
  if (value <= 3) return '#22c55e'
  if (value <= 6) return '#eab308'
  return '#ef4444'
}

function getSliderBackground(value: number): string {
  const pct = (value / 10) * 100
  const color = getSliderColor(value)
  return `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`
}

/* ── 1. Competitors Chips Input ──────────────────────────────── */

function CompetitorsChips({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [input, setInput] = useState('')
  const chips = parseChips(value)

  const addChip = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    // avoid duplicates (case-insensitive)
    if (chips.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setInput('')
      return
    }
    onChange(joinChips([...chips, trimmed]))
    setInput('')
  }

  const removeChip = (index: number) => {
    onChange(joinChips(chips.filter((_, i) => i !== index)))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChip()
    }
  }

  return (
    <div className="space-y-2">
      {/* Chip list */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, i) => (
            <span
              key={`${chip}-${i}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-lighter text-foreground text-sm font-body"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(i)}
                className="text-neutral hover:text-foreground transition-colors cursor-pointer"
                aria-label={`Eliminar ${chip}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Text input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un competidor y presiona Enter..."
        className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
          text-foreground font-body text-sm placeholder:text-neutral
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
    </div>
  )
}

/* ── 2 & 3. Toggle Force (New Entrants / Substitutes) ────────── */

function ToggleForce({
  label,
  tooltip,
  toggleQuestion,
  detailQuestion,
  intensity,
  detail,
  onIntensityChange,
  onDetailChange,
}: {
  label: string
  tooltip: string
  toggleQuestion: string
  detailQuestion: string
  intensity: number
  detail: string
  onIntensityChange: (val: number) => void
  onDetailChange: (val: string) => void
}) {
  // Derive toggle from intensity: if intensity > 0, treat as "yes"
  const isYes = intensity > 0

  const handleToggle = (yes: boolean) => {
    if (!yes) {
      // Reset intensity and detail when toggling to "No"
      onIntensityChange(0)
      onDetailChange('')
    } else {
      // Default to 5 when toggling to "Yes" from 0
      if (intensity === 0) {
        onIntensityChange(5)
      }
    }
  }

  const color = getSliderColor(intensity)
  const levelLabel = intensity <= 3 ? 'Bajo' : intensity <= 6 ? 'Medio' : 'Alto'

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center">
        <label className="text-sm font-heading font-semibold text-foreground">
          {label}
        </label>
        <InfoTooltip text={tooltip} />
      </div>

      {/* Toggle question */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral">{toggleQuestion}</span>
        <div className="flex rounded-lg overflow-hidden border border-neutral-lighter">
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isYes
                ? 'bg-accent text-white'
                : 'bg-white text-neutral hover:bg-neutral-lighter/50'
            }`}
          >
            Si
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              !isYes
                ? 'bg-accent text-white'
                : 'bg-white text-neutral hover:bg-neutral-lighter/50'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Conditional content when "Yes" */}
      {isYes && (
        <div className="space-y-3 pl-0">
          {/* Detail textarea */}
          <div>
            <label className="text-xs font-medium text-neutral">
              {detailQuestion}
            </label>
            <textarea
              value={detail}
              onChange={(e) => onDetailChange(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={2}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                text-foreground font-body text-sm placeholder:text-neutral resize-y
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Intensity slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral">Intensidad</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {levelLabel}
                </span>
                <span className="text-sm font-body font-semibold text-foreground min-w-[2ch] text-right">
                  {intensity}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={intensity}
              onChange={(e) => onIntensityChange(Number(e.target.value))}
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
                background: getSliderBackground(intensity),
                color: color,
              }}
            />

            <div className="flex justify-between text-[10px] text-neutral font-body px-0.5">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 4. Buyer / Supplier Power Dual Slider ───────────────────── */

function PowerBalance({
  buyerPower,
  supplierPower,
  onChange,
}: {
  buyerPower: number
  supplierPower: number
  onChange: (buyer: number, supplier: number) => void
}) {
  // Map the two values to a single 0-10 slider.
  // slider=0 means buyer=10, supplier=0; slider=10 means buyer=0, supplier=10.
  const sliderValue = 10 - buyerPower

  const handleSlider = (val: number) => {
    onChange(10 - val, val)
  }

  // Color: green when balanced, blue-ish/purple toward extremes
  const balanceLabel =
    sliderValue <= 3
      ? 'Clientes dominan'
      : sliderValue >= 7
        ? 'Proveedores dominan'
        : 'Equilibrado'

  const balanceColor =
    sliderValue <= 3 ? '#3b82f6' : sliderValue >= 7 ? '#a855f7' : '#22c55e'

  const pct = (sliderValue / 10) * 100

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center">
        <label className="text-sm font-heading font-semibold text-foreground">
          Poder de negociacion: Clientes vs. Proveedores
        </label>
        <InfoTooltip text="Evalua el equilibrio de poder entre tus clientes y proveedores. Mueve el control hacia quien tiene mas influencia en precios y condiciones." />
      </div>

      {/* Balance badge */}
      <div className="flex justify-center">
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: `${balanceColor}20`, color: balanceColor }}
        >
          {balanceLabel}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={sliderValue}
        onChange={(e) => handleSlider(Number(e.target.value))}
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
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          color: balanceColor,
        }}
      />

      {/* Endpoint labels */}
      <div className="flex justify-between text-xs text-neutral font-body px-0.5">
        <span className="flex flex-col items-start">
          <span className="font-semibold text-foreground">Los clientes</span>
          <span className="text-[10px]">Poder: {buyerPower}</span>
        </span>
        <span className="flex flex-col items-center">
          <span className="text-[10px]">Equilibrado</span>
        </span>
        <span className="flex flex-col items-end">
          <span className="font-semibold text-foreground">Los proveedores</span>
          <span className="text-[10px]">Poder: {supplierPower}</span>
        </span>
      </div>
    </div>
  )
}

/* ── 5. Rivalry Visual Scale (5 circles) ─────────────────────── */

const RIVALRY_LEVELS = [
  { value: 1, mapped: 2, label: 'Baja' },
  { value: 2, mapped: 4, label: '' },
  { value: 3, mapped: 6, label: 'Media' },
  { value: 4, mapped: 8, label: '' },
  { value: 5, mapped: 10, label: 'Muy alta' },
] as const

function RivalryScale({
  value,
  onChange,
}: {
  value: number // 0-10 scale
  onChange: (val: number) => void
}) {
  // Reverse-map from 0-10 to 1-5. Find the closest level.
  const selectedLevel =
    RIVALRY_LEVELS.reduce((closest, level) =>
      Math.abs(level.mapped - value) < Math.abs(closest.mapped - value) ? level : closest
    ).value

  return (
    <div className="space-y-3">
      {/* Circles row */}
      <div className="flex items-center justify-between gap-2">
        {RIVALRY_LEVELS.map((level) => {
          const isSelected = level.value <= selectedLevel
          const isExact = level.value === selectedLevel
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.mapped)}
              className={`flex flex-col items-center gap-1.5 group cursor-pointer transition-all`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-neutral-lighter text-neutral hover:bg-neutral-lighter/80'
                  }
                  ${isExact ? 'ring-2 ring-accent/30 ring-offset-2' : ''}
                `}
              >
                {level.value}
              </div>
              <span
                className={`text-[10px] font-body h-3 ${
                  level.label
                    ? isSelected
                      ? 'text-accent font-medium'
                      : 'text-neutral'
                    : ''
                }`}
              >
                {level.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────────── */

export function IndustryAnalysis({ data, onChange }: IndustryAnalysisProps) {
  const update = (patch: Partial<IndustryAnalysisType>) => {
    onChange({ ...data, ...patch })
  }

  return (
    <div className="space-y-8">
      {/* 1. Rivalry (5 clickable circles) + Competitors (chips) */}
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="text-sm font-heading font-semibold text-foreground">
            Rivalidad entre competidores
          </label>
          <InfoTooltip text="Evalua la intensidad de la competencia en tu industria. Un valor alto indica muchos competidores fuertes, guerras de precios frecuentes y baja diferenciacion entre productos." />
        </div>

        {/* Competitors chips input */}
        <div>
          <label className="text-xs font-medium text-neutral">
            ¿Quienes son los principales competidores?
          </label>
          <CompetitorsChips
            value={data.competitorsDetail}
            onChange={(val) => update({ competitorsDetail: val })}
          />
        </div>

        {/* Rivalry scale */}
        <div>
          <label className="text-xs font-medium text-neutral mb-2 block">
            Nivel de rivalidad
          </label>
          <RivalryScale
            value={data.rivalry}
            onChange={(val) => update({ rivalry: val })}
          />
        </div>
      </div>

      {/* 2. New Entrants (toggle + conditional) */}
      <ToggleForce
        label="Amenaza de nuevos entrantes"
        tooltip="Evalua que tan facil es para nuevos competidores ingresar a tu mercado. Un valor alto indica pocas barreras de entrada como costos bajos de inicio, poca regulacion o tecnologia accesible."
        toggleQuestion="¿Hay posibles nuevos entrantes al sector?"
        detailQuestion="¿Quienes y por que?"
        intensity={data.newEntrants}
        detail={data.newEntrantsDetail}
        onIntensityChange={(val) => update({ newEntrants: val })}
        onDetailChange={(val) => update({ newEntrantsDetail: val })}
      />

      {/* 3. Substitutes (toggle + conditional) */}
      <ToggleForce
        label="Amenaza de productos sustitutos"
        tooltip="Evalua la probabilidad de que los clientes reemplacen tu producto o servicio por alternativas. Un valor alto indica que existen muchas alternativas disponibles y el costo de cambio es bajo."
        toggleQuestion="¿Existen productos o servicios sustitutos?"
        detailQuestion="¿Cuales?"
        intensity={data.substitutes}
        detail={data.substitutesDetail}
        onIntensityChange={(val) => update({ substitutes: val })}
        onDetailChange={(val) => update({ substitutesDetail: val })}
      />

      {/* 4. Buyer vs Supplier Power (single slider) */}
      <PowerBalance
        buyerPower={data.buyerPower}
        supplierPower={data.supplierPower}
        onChange={(buyer, supplier) =>
          update({ buyerPower: buyer, supplierPower: supplier })
        }
      />

      {/* Notes textarea */}
      <div className="space-y-2">
        <label className="text-sm font-heading font-semibold text-foreground">
          Notas generales del analisis
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
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
