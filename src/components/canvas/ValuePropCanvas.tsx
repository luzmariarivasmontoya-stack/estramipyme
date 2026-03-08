import { useState } from 'react'
import { Plus, X, Edit3, Tag } from 'lucide-react'
import { VALUE_PROP_ZONES } from '@/types/canvas'
import { STICKY_NOTE_COLORS } from '@/utils/constants'
import type { CanvasNote } from '@/types/stages'

interface ValuePropCanvasProps {
  notes: CanvasNote[]
  onChange: (notes: CanvasNote[]) => void
  readOnly?: boolean
}

interface EditState {
  noteId: string | null
  content: string
}

type TabKey = 'customer' | 'value' | 'full'

// Subtypes per zone
const ZONE_SUBTYPES: Record<string, string[]> = {
  jobs: ['Funcionales', 'Sociales', 'Emocionales', 'De apoyo'],
  pains: ['Alta', 'Media', 'Baja'],
  gains: ['Necesarias', 'Esperadas', 'Deseadas', 'Inesperadas'],
}

// Labels for the subtype groups
const ZONE_SUBTYPE_LABELS: Record<string, string> = {
  jobs: 'Tipo de tarea',
  pains: 'Criticidad',
  gains: 'Tipo de alegria',
}

// Badge colors per subtype
const SUBTYPE_BADGE_COLORS: Record<string, string> = {
  // Jobs subtypes
  Funcionales: 'bg-blue-100 text-blue-700',
  Sociales: 'bg-purple-100 text-purple-700',
  Emocionales: 'bg-pink-100 text-pink-700',
  'De apoyo': 'bg-gray-100 text-gray-700',
  // Pains subtypes (criticidad)
  Alta: 'bg-red-100 text-red-700',
  Media: 'bg-yellow-100 text-yellow-700',
  Baja: 'bg-green-100 text-green-700',
  // Gains subtypes
  Necesarias: 'bg-emerald-100 text-emerald-700',
  Esperadas: 'bg-teal-100 text-teal-700',
  Deseadas: 'bg-cyan-100 text-cyan-700',
  Inesperadas: 'bg-violet-100 text-violet-700',
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'customer', label: 'Perfil del cliente' },
  { key: 'value', label: 'Mapa de valor' },
  { key: 'full', label: 'Vista completa' },
]

const HEADER_COLORS: Record<string, string> = {
  gains: 'bg-green-500',
  pains: 'bg-red-400',
  jobs: 'bg-blue-400',
  'gain-creators': 'bg-green-500',
  'pain-relievers': 'bg-red-400',
  products: 'bg-blue-400',
}

export function ValuePropCanvas({ notes, onChange, readOnly = false }: ValuePropCanvasProps) {
  const [editing, setEditing] = useState<EditState>({ noteId: null, content: '' })
  const [addingZone, setAddingZone] = useState<string | null>(null)
  const [newContent, setNewContent] = useState('')
  const [newSubtype, setNewSubtype] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabKey>('customer')

  const getNotesForZone = (zoneId: string) =>
    notes.filter((n) => n.zone === zoneId)

  const handleAddNote = (zoneId: string) => {
    if (!newContent.trim()) return
    const newNote: CanvasNote = {
      id: crypto.randomUUID(),
      content: newContent.trim(),
      zone: zoneId,
      color: STICKY_NOTE_COLORS[Math.floor(Math.random() * STICKY_NOTE_COLORS.length)],
      ...(newSubtype ? { subtype: newSubtype } : {}),
    }
    onChange([...notes, newNote])
    setNewContent('')
    setNewSubtype('')
    setAddingZone(null)
  }

  const handleDeleteNote = (noteId: string) => {
    onChange(notes.filter((n) => n.id !== noteId))
  }

  const handleEditSave = () => {
    if (!editing.noteId || !editing.content.trim()) return
    onChange(
      notes.map((n) =>
        n.id === editing.noteId ? { ...n, content: editing.content.trim() } : n
      )
    )
    setEditing({ noteId: null, content: '' })
  }

  const handleSubtypeChange = (noteId: string, subtype: string) => {
    onChange(
      notes.map((n) =>
        n.id === noteId ? { ...n, subtype: subtype || undefined } : n
      )
    )
  }

  const customerZones = VALUE_PROP_ZONES.filter((z) =>
    ['gains', 'pains', 'jobs'].includes(z.id)
  )
  const valueZones = VALUE_PROP_ZONES.filter((z) =>
    ['gain-creators', 'pain-relievers', 'products'].includes(z.id)
  )

  const renderNote = (note: CanvasNote, subtypes: string[] | undefined, subtypeLabel: string | undefined) => (
    <div
      key={note.id}
      className="relative group px-4 py-3 rounded-lg text-sm font-body text-foreground shadow-sm min-w-[120px] min-h-[60px]"
      style={{ backgroundColor: note.color }}
    >
      {editing.noteId === note.id ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave()
              if (e.key === 'Escape') setEditing({ noteId: null, content: '' })
            }}
            className="flex-1 bg-white/70 px-2 py-1 rounded text-sm focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={handleEditSave}
            className="text-green-600 hover:text-green-800 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Guardar"
          >
            <Edit3 size={14} />
          </button>
        </div>
      ) : (
        <>
          <span>{note.content}</span>
          {/* Subtype badge */}
          {note.subtype && (
            <span
              className={`inline-flex items-center gap-0.5 ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none ${SUBTYPE_BADGE_COLORS[note.subtype] || 'bg-gray-100 text-gray-600'}`}
            >
              <Tag size={9} />
              {note.subtype}
            </span>
          )}
          {!readOnly && (
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 items-center">
              {/* Subtype selector on hover */}
              {subtypes && (
                <select
                  value={note.subtype || ''}
                  onChange={(e) => handleSubtypeChange(note.id, e.target.value)}
                  className="p-1 bg-white/80 rounded text-[11px] cursor-pointer focus:outline-none min-h-[44px]"
                  aria-label={`Cambiar ${subtypeLabel}`}
                >
                  <option value="">Sin tipo</option>
                  {subtypes.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => setEditing({ noteId: note.id, content: note.content })}
                className="p-1.5 bg-white/60 rounded hover:bg-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Editar nota"
              >
                <Edit3 size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteNote(note.id)}
                className="p-1.5 bg-white/60 rounded hover:bg-red-100 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Eliminar nota"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderAddNoteArea = (zone: typeof VALUE_PROP_ZONES[number]) => {
    const subtypes = ZONE_SUBTYPES[zone.id]
    const subtypeLabel = ZONE_SUBTYPE_LABELS[zone.id]

    if (readOnly) return null

    if (addingZone === zone.id) {
      return (
        <div className="space-y-3 p-4 bg-neutral-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNote(zone.id)
                if (e.key === 'Escape') {
                  setAddingZone(null)
                  setNewContent('')
                  setNewSubtype('')
                }
              }}
              placeholder="Nueva nota..."
              className="flex-1 px-3 py-2 text-sm border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 font-body"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleAddNote(zone.id)}
              className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-dark cursor-pointer font-body font-medium min-w-[44px] min-h-[44px]"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingZone(null)
                setNewContent('')
                setNewSubtype('')
              }}
              className="px-3 py-2 text-sm text-neutral border border-neutral-light rounded-lg hover:bg-neutral-100 cursor-pointer min-w-[44px] min-h-[44px]"
              aria-label="Cancelar"
            >
              <X size={14} />
            </button>
          </div>
          {/* Subtype selector for new note */}
          {subtypes && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral font-body">{subtypeLabel}:</span>
              <select
                value={newSubtype}
                onChange={(e) => setNewSubtype(e.target.value)}
                className="px-2 py-1.5 text-sm border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 font-body min-h-[44px]"
              >
                <option value="">Sin tipo</option>
                {subtypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        type="button"
        onClick={() => {
          setAddingZone(zone.id)
          setNewContent('')
          setNewSubtype('')
        }}
        className="flex items-center gap-2 text-sm text-neutral hover:text-accent transition-colors cursor-pointer font-body py-2 min-h-[44px]"
      >
        <Plus size={16} />
        Agregar nota
      </button>
    )
  }

  const renderZoneCard = (zone: typeof VALUE_PROP_ZONES[number]) => {
    const zoneNotes = getNotesForZone(zone.id)
    const subtypes = ZONE_SUBTYPES[zone.id]
    const subtypeLabel = ZONE_SUBTYPE_LABELS[zone.id]

    return (
      <div
        key={zone.id}
        className="bg-white rounded-xl border border-neutral-light overflow-hidden flex flex-col min-h-[200px] shadow-sm"
      >
        {/* Zone header */}
        <div className={`${HEADER_COLORS[zone.id] || 'bg-accent'} px-4 py-3`}>
          <h5 className="text-white text-base font-semibold font-body">{zone.label}</h5>
          <p className="text-white/80 text-sm font-body mt-0.5">{zone.description}</p>
        </div>

        {/* Notes area */}
        <div className="flex-1 p-4 space-y-3">
          {zoneNotes.length === 0 && (
            <p className="text-sm text-neutral/60 font-body italic py-2">
              No hay notas en esta zona.
            </p>
          )}
          {zoneNotes.map((note) => renderNote(note, subtypes, subtypeLabel))}

          {/* Add note button / form */}
          {renderAddNoteArea(zone)}
        </div>
      </div>
    )
  }

  const renderZoneList = (zones: typeof VALUE_PROP_ZONES) => (
    <div className="space-y-5">
      {zones.map(renderZoneCard)}
    </div>
  )

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-neutral-light mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-body font-medium cursor-pointer transition-colors ${
              activeTab === tab.key
                ? 'text-accent border-b-2 border-accent'
                : 'text-neutral hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'customer' && renderZoneList(customerZones)}

      {activeTab === 'value' && renderZoneList(valueZones)}

      {activeTab === 'full' && (
        <>
          {/* Desktop: 2-column grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-sm font-body font-medium text-foreground">
                  Perfil del Cliente
                </span>
              </div>
              <div className="space-y-5">
                {customerZones.map(renderZoneCard)}
              </div>
            </div>
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-sm font-body font-medium text-foreground">
                  Mapa de Valor
                </span>
              </div>
              <div className="space-y-5">
                {valueZones.map(renderZoneCard)}
              </div>
            </div>
          </div>

          {/* Mobile: informational message */}
          <div className="block md:hidden">
            <div className="bg-neutral-50 border border-neutral-light rounded-xl p-6 text-center">
              <p className="text-sm text-neutral font-body leading-relaxed">
                Para ver la vista completa, usa una pantalla mas grande o selecciona las pestanas individuales.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
