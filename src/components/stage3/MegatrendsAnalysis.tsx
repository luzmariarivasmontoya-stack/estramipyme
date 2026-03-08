import { useState } from 'react'
import { Plus, Trash2, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common/Button'
import type { MegatrendEntry } from '@/types/stages'

interface MegatrendsAnalysisProps {
  megatrends: MegatrendEntry[]
  onChange: (megatrends: MegatrendEntry[]) => void
}

const SUGGESTED_MEGATRENDS = [
  'Digitalizacion',
  'Sostenibilidad',
  'Cambio demografico',
  'Urbanizacion',
  'Economia circular',
  'Inteligencia artificial',
]

function createEmptyEntry(): MegatrendEntry {
  return {
    id: crypto.randomUUID(),
    megatrend: '',
    source: '',
    date: '',
    impact: 3,
    type: 'oportunidad',
  }
}

function ImpactSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) {
  const pct = ((value - 1) / 4) * 100
  const color =
    value <= 2 ? '#22c55e' : value <= 3 ? '#eab308' : '#ef4444'
  const bg = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 h-1.5 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-current
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-current
          [&::-moz-range-thumb]:shadow-sm
          [&::-moz-range-thumb]:cursor-pointer"
        style={{ background: bg, color }}
      />
      <span
        className="text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.5rem] text-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {value}
      </span>
    </div>
  )
}

export function MegatrendsAnalysis({ megatrends, onChange }: MegatrendsAnalysisProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState<MegatrendEntry>(createEmptyEntry)

  const handleAdd = () => {
    if (!newEntry.megatrend.trim()) return
    onChange([...megatrends, { ...newEntry, id: crypto.randomUUID() }])
    setNewEntry(createEmptyEntry())
    setShowAddForm(false)
  }

  const handleAddSuggested = (name: string) => {
    const exists = megatrends.some(
      (m) => m.megatrend.toLowerCase() === name.toLowerCase()
    )
    if (exists) return
    const entry = createEmptyEntry()
    entry.megatrend = name
    onChange([...megatrends, entry])
  }

  const handleDelete = (id: string) => {
    onChange(megatrends.filter((m) => m.id !== id))
  }

  const handleFieldChange = (
    id: string,
    field: keyof MegatrendEntry,
    value: string | number
  ) => {
    onChange(
      megatrends.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  /* ---- Add form ---- */
  const addForm = (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 space-y-4">
        <p className="text-sm font-heading font-semibold text-foreground">
          Nueva megatendencia
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Megatrend name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral">Megatendencia</label>
            <input
              type="text"
              value={newEntry.megatrend}
              onChange={(e) => setNewEntry({ ...newEntry, megatrend: e.target.value })}
              placeholder="Ej: Inteligencia artificial"
              className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                text-foreground font-body text-sm placeholder:text-neutral
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Source */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral">Fuente</label>
            <input
              type="text"
              value={newEntry.source}
              onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
              placeholder="Ej: Informe McKinsey 2025"
              className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                text-foreground font-body text-sm placeholder:text-neutral
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral">Fecha</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                text-foreground font-body text-sm placeholder:text-neutral
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral">Tipo</label>
            <select
              value={newEntry.type}
              onChange={(e) =>
                setNewEntry({ ...newEntry, type: e.target.value as 'riesgo' | 'oportunidad' })
              }
              className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                text-foreground font-body text-sm
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            >
              <option value="oportunidad">Oportunidad</option>
              <option value="riesgo">Riesgo</option>
            </select>
          </div>
        </div>

        {/* Impact slider */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral">
            Impacto (1-5)
          </label>
          <ImpactSlider
            value={newEntry.impact}
            onChange={(val) => setNewEntry({ ...newEntry, impact: val })}
          />
        </div>

        {/* Form actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="primary" size="sm" onClick={handleAdd}>
            <Plus size={16} />
            Agregar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </motion.div>
  )

  /* ---- Empty state ---- */
  if (megatrends.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <p className="text-neutral font-body mb-4">
            Aun no has agregado megatendencias. Identifica las grandes fuerzas globales que impactan tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              Agregar primera megatendencia
            </Button>
            <Button variant="outline" onClick={() => setShowSuggestions(true)}>
              <Lightbulb size={18} />
              Ver sugerencias
            </Button>
          </div>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-6 flex flex-wrap justify-center gap-2"
              >
                {SUGGESTED_MEGATRENDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSuggested(s)}
                    className="px-4 py-2 rounded-xl bg-neutral-lighter text-foreground text-sm font-body
                      hover:bg-accent hover:text-white transition-colors cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>{showAddForm && addForm}</AnimatePresence>
      </div>
    )
  }

  /* ---- Table ---- */
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-lighter">
              <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                Megatendencia
              </th>
              <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                Fuente
              </th>
              <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                Fecha
              </th>
              <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                Impacto (1-5)
              </th>
              <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                Tipo
              </th>
              <th className="pb-3 text-sm font-heading font-semibold text-foreground w-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {megatrends.map((entry) => (
              <tr key={entry.id} className="border-b border-neutral-lighter/50">
                {/* Megatrend name */}
                <td className="py-3 pr-4">
                  <input
                    type="text"
                    value={entry.megatrend}
                    onChange={(e) =>
                      handleFieldChange(entry.id, 'megatrend', e.target.value)
                    }
                    placeholder="Nombre..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                      text-foreground font-body text-sm placeholder:text-neutral
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </td>

                {/* Source */}
                <td className="py-3 pr-4">
                  <input
                    type="text"
                    value={entry.source}
                    onChange={(e) =>
                      handleFieldChange(entry.id, 'source', e.target.value)
                    }
                    placeholder="Fuente..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                      text-foreground font-body text-sm placeholder:text-neutral
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </td>

                {/* Date */}
                <td className="py-3 pr-4">
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      handleFieldChange(entry.id, 'date', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-lighter bg-white
                      text-foreground font-body text-sm
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </td>

                {/* Impact slider */}
                <td className="py-3 pr-4">
                  <ImpactSlider
                    value={entry.impact}
                    onChange={(val) =>
                      handleFieldChange(entry.id, 'impact', val)
                    }
                  />
                </td>

                {/* Type */}
                <td className="py-3 pr-4">
                  <select
                    value={entry.type}
                    onChange={(e) =>
                      handleFieldChange(entry.id, 'type', e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-body
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                      ${
                        entry.type === 'riesgo'
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                  >
                    <option value="oportunidad">Oportunidad</option>
                    <option value="riesgo">Riesgo</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-neutral hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    aria-label="Eliminar megatendencia"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} />
          Agregar megatendencia
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <Lightbulb size={16} />
          Sugerencias
        </Button>
      </div>

      <AnimatePresence>{showAddForm && addForm}</AnimatePresence>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-2 pb-1">
              {SUGGESTED_MEGATRENDS.filter(
                (s) =>
                  !megatrends.some(
                    (m) => m.megatrend.toLowerCase() === s.toLowerCase()
                  )
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSuggested(s)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-lighter text-foreground text-sm font-body
                    hover:bg-accent hover:text-white transition-colors cursor-pointer"
                >
                  + {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
