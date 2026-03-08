import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Palette, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { STICKY_NOTE_COLORS } from '@/utils/constants'
import type { StickyNote as StickyNoteType } from '@/types/stages'

interface StickyNotesBoardProps {
  notes: StickyNoteType[]
  onChange: (updated: StickyNoteType[]) => void
  readOnly?: boolean
}

/* ── DESKTOP: Draggable note on the board ── */
function DraggableStickyNote({
  note,
  onEdit,
  onDelete,
  readOnly,
}: {
  note: StickyNoteType
  onEdit: (id: string, content: string) => void
  onDelete: (id: string) => void
  readOnly: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: note.id,
  })

  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(note.content)
  const [isHovered, setIsHovered] = useState(false)

  const style: React.CSSProperties = {
    position: 'absolute',
    left: note.x,
    top: note.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 999 : isHovered ? 50 : 10,
    opacity: isDragging ? 0.85 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease',
  }

  const handleSave = () => {
    setIsEditing(false)
    if (editValue.trim() !== note.content) {
      onEdit(note.id, editValue.trim())
    }
  }

  const isLong = note.content.length > 120

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setExpanded(false) }}
      onDoubleClick={() => {
        if (!readOnly) {
          setEditValue(note.content)
          setIsEditing(true)
        }
      }}
    >
      <div
        className="w-[180px] rounded-lg p-3 relative transition-shadow duration-200 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: note.color,
          boxShadow: isHovered
            ? '0 8px 20px rgba(0,0,0,0.15)'
            : '0 2px 6px rgba(0,0,0,0.08)',
          minHeight: '100px',
          maxHeight: expanded ? 'none' : '120px',
          overflow: expanded ? 'visible' : 'hidden',
        }}
      >
        {!readOnly && isHovered && !isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-neutral hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer z-30"
            aria-label="Eliminar nota"
          >
            <X size={12} />
          </button>
        )}

        {isEditing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setIsEditing(false); setEditValue(note.content) }
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
            }}
            className="w-full h-full min-h-[80px] resize-none bg-transparent border-0 text-sm text-foreground font-body focus:outline-none"
            autoFocus
            placeholder="Escribe algo..."
          />
        ) : (
          <>
            <p className={`text-sm text-foreground font-body leading-snug ${expanded ? '' : 'line-clamp-4'}`}>
              {note.content || <span className="text-neutral/50 italic">Doble clic para editar</span>}
            </p>
            {isLong && !expanded && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
                className="mt-1 text-[10px] font-body text-foreground/60 hover:text-foreground underline cursor-pointer"
              >
                ... ver mas
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ── MOBILE: Note card in vertical list ── */
function MobileNoteCard({
  note,
  onEdit,
  onDelete,
  readOnly,
}: {
  note: StickyNoteType
  onEdit: (id: string, content: string) => void
  onDelete: (id: string) => void
  readOnly: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(note.content)

  const handleSave = () => {
    setIsEditing(false)
    if (editValue.trim() !== note.content) {
      onEdit(note.id, editValue.trim())
    }
  }

  return (
    <div
      className="w-full rounded-lg p-4 relative"
      style={{ backgroundColor: note.color, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
    >
      {!readOnly && (
        <button
          onClick={() => onDelete(note.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/60 rounded-full flex items-center justify-center text-neutral hover:text-red-500 transition-colors cursor-pointer"
          aria-label="Eliminar nota"
        >
          <X size={14} />
        </button>
      )}

      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setIsEditing(false); setEditValue(note.content) }
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
          }}
          className="w-full min-h-[60px] resize-none bg-transparent border-0 text-sm text-foreground font-body focus:outline-none"
          autoFocus
        />
      ) : (
        <p
          className="text-sm text-foreground font-body leading-relaxed pr-8"
          onDoubleClick={() => {
            if (!readOnly) { setEditValue(note.content); setIsEditing(true) }
          }}
        >
          {note.content || <span className="text-neutral/50 italic">Toca dos veces para editar</span>}
        </p>
      )}
    </div>
  )
}

/* ── MAIN BOARD COMPONENT ── */
export function StickyNotesBoard({ notes, onChange, readOnly = false }: StickyNotesBoardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>(STICKY_NOTE_COLORS[0])
  const boardRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Grid-based slot positioning: 3 columns, avoids random overlap
  const getGridPosition = useCallback((index: number) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    return { x: 20 + col * 200, y: 20 + row * 150 }
  }, [])

  const addNote = () => {
    const pos = getGridPosition(notes.length)
    const newNote: StickyNoteType = {
      id: crypto.randomUUID(),
      content: '',
      color: selectedColor || STICKY_NOTE_COLORS[0],
      x: pos.x,
      y: pos.y,
    }
    onChange([...notes, newNote])
    setShowColorPicker(false)
  }

  const handleEdit = useCallback(
    (id: string, content: string) => {
      onChange(notes.map((n) => (n.id === id ? { ...n, content } : n)))
    },
    [notes, onChange]
  )

  const handleDelete = useCallback(
    (id: string) => {
      onChange(notes.filter((n) => n.id !== id))
    },
    [notes, onChange]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event
      if (!delta) return
      onChange(
        notes.map((n) =>
          n.id === active.id
            ? { ...n, x: Math.max(0, n.x + delta.x), y: Math.max(0, n.y + delta.y) }
            : n
        )
      )
    },
    [notes, onChange]
  )

  const boardMinHeight = Math.max(400, Math.ceil(notes.length / 3) * 160 + 60)

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="primary" size="sm" onClick={() => setShowColorPicker(!showColorPicker)}>
              <Plus size={16} />
              Agregar nota
            </Button>
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-card border border-neutral-lighter p-3 z-30"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Palette size={14} className="text-neutral" />
                    <span className="text-xs font-body text-neutral">Elige un color:</span>
                  </div>
                  <div className="flex gap-2">
                    {STICKY_NOTE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
                          selectedColor === color ? 'border-accent ring-2 ring-accent/30 scale-110' : 'border-neutral-lighter'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                      />
                    ))}
                  </div>
                  <Button variant="primary" size="sm" className="w-full mt-3" onClick={addNote}>
                    Crear nota
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-xs text-neutral font-body">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>
      )}

      {/* ── DESKTOP Board (hidden on mobile) ── */}
      <div className="hidden md:block">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={notes.map((n) => n.id)} strategy={rectSortingStrategy}>
            <div
              ref={boardRef}
              className="relative w-full rounded-xl border-2 border-dashed border-neutral-lighter bg-neutral-lighter/20 overflow-hidden"
              style={{ minHeight: boardMinHeight }}
            >
              {notes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-lighter/60 flex items-center justify-center mb-4">
                    <Plus size={24} className="text-neutral/40" />
                  </div>
                  <p className="text-neutral font-body text-sm max-w-xs">
                    {readOnly ? 'No hay notas todavia.' : 'Haz clic en "Agregar nota" para comenzar tu mural de ideas.'}
                  </p>
                </div>
              )}
              {notes.map((note) => (
                <DraggableStickyNote
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* ── MOBILE List (hidden on desktop) ── */}
      <div className="md:hidden space-y-3">
        {notes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral font-body text-sm">
              {readOnly ? 'No hay notas todavia.' : 'Toca "Agregar nota" para comenzar.'}
            </p>
          </div>
        )}
        {notes.map((note) => (
          <MobileNoteCard
            key={note.id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* Mobile FAB for quick add */}
      {!readOnly && notes.length > 0 && (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={addNote}
            className="w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-accent-dark transition-colors cursor-pointer"
            aria-label="Nueva nota"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
