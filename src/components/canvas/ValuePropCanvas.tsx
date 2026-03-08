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
  gains: 'Tipo de alegría',
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

export function ValuePropCanvas({ notes, onChange, readOnly = false }: ValuePropCanvasProps) {
  const [editing, setEditing] = useState<EditState>({ noteId: null, content: '' })
  const [addingZone, setAddingZone] = useState<string | null>(null)
  const [newContent, setNewContent] = useState('')
  const [newSubtype, setNewSubtype] = useState<string>('')

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

  // Layout: left side (customer) = circle zones, right side (value) = square zones
  const customerZones = VALUE_PROP_ZONES.filter((z) =>
    ['gains', 'pains', 'jobs'].includes(z.id)
  )
  const valueZones = VALUE_PROP_ZONES.filter((z) =>
    ['gain-creators', 'pain-relievers', 'products'].includes(z.id)
  )

  const renderZone = (zone: typeof VALUE_PROP_ZONES[number]) => {
    const zoneNotes = getNotesForZone(zone.id)
    const subtypes = ZONE_SUBTYPES[zone.id]
    const subtypeLabel = ZONE_SUBTYPE_LABELS[zone.id]

    const headerColors: Record<string, string> = {
      gains: 'bg-green-500',
      pains: 'bg-red-400',
      jobs: 'bg-blue-400',
      'gain-creators': 'bg-green-500',
      'pain-relievers': 'bg-red-400',
      products: 'bg-blue-400',
    }

    return (
      <div
        key={zone.id}
        className="bg-white rounded-lg border border-neutral-light overflow-hidden flex flex-col min-h-[180px]"
      >
        {/* Zone header */}
        <div className={`${headerColors[zone.id] || 'bg-accent'} px-3 py-2`}>
          <h5 className="text-white text-sm font-semibold font-body">{zone.label}</h5>
          <p className="text-white/80 text-xs font-body">{zone.description}</p>
        </div>

        {/* Notes area */}
        <div className="flex-1 p-3 space-y-2">
          {zoneNotes.map((note) => (
            <div
              key={note.id}
              className="relative group px-3 py-2 rounded-md text-xs font-body text-foreground shadow-sm"
              style={{ backgroundColor: note.color }}
            >
              {editing.noteId === note.id ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editing.content}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave()
                      if (e.key === 'Escape') setEditing({ noteId: null, content: '' })
                    }}
                    className="flex-1 bg-white/70 px-1 py-0.5 rounded text-xs focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                    aria-label="Guardar"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{note.content}</span>
                  {/* Subtype badge */}
                  {note.subtype && (
                    <span
                      className={`inline-flex items-center gap-0.5 ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none ${SUBTYPE_BADGE_COLORS[note.subtype] || 'bg-gray-100 text-gray-600'}`}
                    >
                      <Tag size={8} />
                      {note.subtype}
                    </span>
                  )}
                  {!readOnly && (
                    <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                      {/* Subtype selector on hover */}
                      {subtypes && (
                        <select
                          value={note.subtype || ''}
                          onChange={(e) => handleSubtypeChange(note.id, e.target.value)}
                          className="p-0.5 bg-white/80 rounded text-[10px] cursor-pointer focus:outline-none"
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
                        className="p-0.5 bg-white/60 rounded hover:bg-white cursor-pointer"
                        aria-label="Editar nota"
                      >
                        <Edit3 size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-0.5 bg-white/60 rounded hover:bg-red-100 cursor-pointer"
                        aria-label="Eliminar nota"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Add note */}
          {!readOnly && addingZone === zone.id ? (
            <div className="space-y-2">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNote(zone.id)
                    if (e.key === 'Escape') { setAddingZone(null); setNewContent(''); setNewSubtype('') }
                  }}
                  placeholder="Nueva nota..."
                  className="flex-1 px-2 py-1 text-xs border border-neutral-light rounded focus:outline-none focus:ring-1 focus:ring-accent/30"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(zone.id)}
                  className="px-2 py-1 text-xs bg-accent text-white rounded hover:bg-accent-dark cursor-pointer"
                >
                  OK
                </button>
              </div>
              {/* Subtype selector for new note */}
              {subtypes && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral font-body">{subtypeLabel}:</span>
                  <select
                    value={newSubtype}
                    onChange={(e) => setNewSubtype(e.target.value)}
                    className="px-1.5 py-0.5 text-xs border border-neutral-light rounded focus:outline-none focus:ring-1 focus:ring-accent/30"
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
          ) : (
            !readOnly && (
              <button
                type="button"
                onClick={() => { setAddingZone(zone.id); setNewContent(''); setNewSubtype('') }}
                className="flex items-center gap-1 text-xs text-neutral hover:text-accent transition-colors cursor-pointer"
              >
                <Plus size={12} />
                Agregar nota
              </button>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Customer Profile (Circle) */}
        <div>
          <div className="text-center mb-3">
            <span className="inline-block px-3 py-1 bg-neutral-lighter rounded-full text-sm font-body font-medium text-foreground">
              Perfil del Cliente
            </span>
          </div>
          <div className="space-y-4">
            {customerZones.map(renderZone)}
          </div>
        </div>

        {/* Right side - Value Map (Square) */}
        <div>
          <div className="text-center mb-3">
            <span className="inline-block px-3 py-1 bg-neutral-lighter rounded-full text-sm font-body font-medium text-foreground">
              Mapa de Valor
            </span>
          </div>
          <div className="space-y-4">
            {valueZones.map(renderZone)}
          </div>
        </div>
      </div>
    </div>
  )
}
