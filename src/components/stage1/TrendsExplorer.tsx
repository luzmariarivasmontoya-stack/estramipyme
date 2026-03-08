import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { Trend } from '@/types/stages'

interface TrendsExplorerProps {
  trends: Trend[]
  onTrendsChange: (trends: Trend[]) => void
}

const emptyTrend = (): Trend => ({
  id: crypto.randomUUID(),
  name: '',
  source: '',
  date: '',
  type: 'oportunidad',
})

const typeConfig: Record<Trend['type'], { label: string; className: string }> = {
  riesgo: { label: 'Riesgo', className: 'bg-rose-100 text-rose-700' },
  oportunidad: { label: 'Oportunidad', className: 'bg-emerald-100 text-emerald-700' },
}

const suggestedSources = [
  { name: 'Sectorial.co', url: 'https://www.sectorial.co' },
  { name: 'Google Trends', url: 'https://trends.google.com' },
  { name: 'EY Megatrends', url: 'https://www.ey.com/en_gl/megatrends' },
  { name: 'McKinsey Insights', url: 'https://www.mckinsey.com/featured-insights' },
  { name: 'La República', url: 'https://www.larepublica.co' },
  { name: 'Portafolio', url: 'https://www.portafolio.co' },
]

export function TrendsExplorer({ trends, onTrendsChange }: TrendsExplorerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Trend | null>(null)

  const handleAdd = () => {
    const newTrend = emptyTrend()
    onTrendsChange([...trends, newTrend])
    setEditingId(newTrend.id)
    setEditDraft(newTrend)
  }

  const handleEdit = (trend: Trend) => {
    setEditingId(trend.id)
    setEditDraft({ ...trend })
  }

  const handleSave = () => {
    if (!editDraft) return
    onTrendsChange(trends.map((t) => (t.id === editDraft.id ? editDraft : t)))
    setEditingId(null)
    setEditDraft(null)
  }

  const handleCancel = () => {
    if (editDraft && !editDraft.name && !editDraft.source && !editDraft.date) {
      onTrendsChange(trends.filter((t) => t.id !== editDraft.id))
    }
    setEditingId(null)
    setEditDraft(null)
  }

  const handleDelete = (id: string) => {
    onTrendsChange(trends.filter((t) => t.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditDraft(null)
    }
  }

  const updateDraft = (field: keyof Trend, value: string) => {
    if (!editDraft) return
    setEditDraft({ ...editDraft, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Suggested sources section */}
      <div className="rounded-xl border border-neutral-lighter bg-white p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
          Fuentes sugeridas para explorar tendencias
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-lighter
                text-sm font-body text-accent hover:bg-accent/5 hover:border-accent/30
                transition-all duration-200"
            >
              {source.name}
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </div>

      {/* Trends table */}
      {trends.length === 0 && !editingId ? (
        <div className="text-center py-12">
          <p className="text-neutral font-body mb-4">
            Aún no has agregado tendencias. Comienza explorando las tendencias que impactan tu negocio.
          </p>
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={18} />
            Agregar primera tendencia
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-lighter">
                  <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                    Tendencia
                  </th>
                  <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                    Fuente
                  </th>
                  <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                    Fecha
                  </th>
                  <th className="pb-3 pr-4 text-sm font-heading font-semibold text-foreground">
                    ¿Riesgo u Oportunidad?
                  </th>
                  <th className="pb-3 text-sm font-heading font-semibold text-foreground w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend) => {
                  const isEditing = editingId === trend.id
                  const current = isEditing && editDraft ? editDraft : trend
                  const trendType = typeConfig[current.type]

                  return (
                    <tr key={trend.id} className="border-b border-neutral-lighter/50">
                      {isEditing ? (
                        <>
                          <td className="py-3 pr-4">
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                                Tendencia
                              </label>
                              <input
                                type="text"
                                value={editDraft?.name || ''}
                                onChange={(e) => updateDraft('name', e.target.value)}
                                placeholder="Nombre de la tendencia..."
                                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                                Fuente
                              </label>
                              <input
                                type="text"
                                value={editDraft?.source || ''}
                                onChange={(e) => updateDraft('source', e.target.value)}
                                placeholder="Fuente..."
                                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                                Fecha
                              </label>
                              <input
                                type="date"
                                value={editDraft?.date || ''}
                                onChange={(e) => updateDraft('date', e.target.value)}
                                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                                Tipo
                              </label>
                              <select
                                value={editDraft?.type || 'oportunidad'}
                                onChange={(e) =>
                                  updateDraft('type', e.target.value as Trend['type'])
                                }
                                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                              >
                                <option value="riesgo">Riesgo</option>
                                <option value="oportunidad">Oportunidad</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handleSave}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                aria-label="Guardar"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="p-1.5 rounded-lg text-neutral hover:bg-neutral-lighter transition-colors cursor-pointer"
                                aria-label="Cancelar"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 pr-4 text-sm font-body text-foreground">
                            {current.name}
                          </td>
                          <td className="py-3 pr-4 text-sm font-body text-neutral">
                            {current.source}
                          </td>
                          <td className="py-3 pr-4 text-sm font-body text-neutral">
                            {current.date}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${trendType.className}`}
                            >
                              {trendType.label}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(trend)}
                                className="p-1.5 rounded-lg text-neutral hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                                aria-label="Editar"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(trend.id)}
                                className="p-1.5 rounded-lg text-neutral hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                aria-label="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus size={16} />
              Agregar tendencia
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
