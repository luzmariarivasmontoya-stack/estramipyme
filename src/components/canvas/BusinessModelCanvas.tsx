import { useState } from 'react'
import { Plus, X, Edit3 } from 'lucide-react'
import { BUSINESS_MODEL_ZONES } from '@/types/canvas'
import { STICKY_NOTE_COLORS } from '@/utils/constants'
import type { CanvasNote } from '@/types/stages'

interface BusinessModelCanvasProps {
  notes: CanvasNote[]
  onChange: (notes: CanvasNote[]) => void
  readOnly?: boolean
}

interface EditState {
  noteId: string | null
  content: string
}

export function BusinessModelCanvas({ notes, onChange, readOnly = false }: BusinessModelCanvasProps) {
  const [editing, setEditing] = useState<EditState>({ noteId: null, content: '' })
  const [addingZone, setAddingZone] = useState<string | null>(null)
  const [newContent, setNewContent] = useState('')

  const getNotesForZone = (zoneId: string) =>
    notes.filter((n) => n.zone === zoneId)

  const handleAddNote = (zoneId: string) => {
    if (!newContent.trim()) return
    const newNote: CanvasNote = {
      id: crypto.randomUUID(),
      content: newContent.trim(),
      zone: zoneId,
      color: STICKY_NOTE_COLORS[Math.floor(Math.random() * STICKY_NOTE_COLORS.length)],
    }
    onChange([...notes, newNote])
    setNewContent('')
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

  const zoneColors: Record<string, string> = {
    'key-partners': 'border-t-indigo-400',
    'key-activities': 'border-t-blue-400',
    'key-resources': 'border-t-blue-300',
    'value-propositions': 'border-t-accent',
    'customer-relationships': 'border-t-green-400',
    'channels': 'border-t-green-300',
    'customer-segments': 'border-t-emerald-400',
    'cost-structure': 'border-t-red-400',
    'revenue-streams': 'border-t-yellow-500',
  }

  const renderBlock = (zone: typeof BUSINESS_MODEL_ZONES[number]) => {
    const zoneNotes = getNotesForZone(zone.id)
    const borderColor = zoneColors[zone.id] || 'border-t-neutral'

    return (
      <div
        key={zone.id}
        className={`bg-white rounded-lg border border-neutral-light border-t-4 ${borderColor} p-3 flex flex-col min-h-[140px]`}
        style={{ gridArea: zone.gridArea }}
      >
        <h5 className="text-xs font-semibold font-body text-foreground mb-0.5">
          {zone.label}
        </h5>
        <p className="text-[10px] text-neutral font-body mb-2 leading-tight">
          {zone.description}
        </p>

        {/* Notes */}
        <div className="flex-1 space-y-1.5 mb-2">
          {zoneNotes.map((note) => (
            <div
              key={note.id}
              className="relative group px-2 py-1.5 rounded text-[11px] font-body text-foreground shadow-sm"
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
                    className="flex-1 bg-white/70 px-1 py-0.5 rounded text-[11px] focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="text-green-600 cursor-pointer"
                    aria-label="Guardar"
                  >
                    <Edit3 size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{note.content}</span>
                  {!readOnly && (
                    <div className="absolute top-0.5 right-0.5 hidden group-hover:flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => setEditing({ noteId: note.id, content: note.content })}
                        className="p-0.5 bg-white/60 rounded hover:bg-white cursor-pointer"
                        aria-label="Editar nota"
                      >
                        <Edit3 size={9} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-0.5 bg-white/60 rounded hover:bg-red-100 cursor-pointer"
                        aria-label="Eliminar nota"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add note */}
        {!readOnly && addingZone === zone.id ? (
          <div className="flex gap-1 mt-auto">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNote(zone.id)
                if (e.key === 'Escape') { setAddingZone(null); setNewContent('') }
              }}
              placeholder="Nueva nota..."
              className="flex-1 px-1.5 py-1 text-[11px] border border-neutral-light rounded focus:outline-none focus:ring-1 focus:ring-accent/30"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleAddNote(zone.id)}
              className="px-1.5 py-1 text-[11px] bg-accent text-white rounded hover:bg-accent-dark cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          !readOnly && (
            <button
              type="button"
              onClick={() => { setAddingZone(zone.id); setNewContent('') }}
              className="flex items-center gap-1 text-[11px] text-neutral hover:text-accent transition-colors mt-auto cursor-pointer"
            >
              <Plus size={11} />
              Agregar
            </button>
          )
        )}
      </div>
    )
  }

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'auto auto auto',
        gridTemplateAreas: `
          "partners partners activities activities value value relationships relationships segments segments"
          "partners partners resources resources value value channels channels segments segments"
          "costs costs costs costs costs revenue revenue revenue revenue revenue"
        `,
      }}
    >
      {BUSINESS_MODEL_ZONES.map(renderBlock)}
    </div>
  )
}
