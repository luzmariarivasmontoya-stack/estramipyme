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
import { Plus, Palette } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { StickyNote } from './StickyNote'
import { STICKY_NOTE_COLORS } from '@/utils/constants'
import type { StickyNote as StickyNoteType } from '@/types/stages'

interface StickyNotesBoardProps {
  notes: StickyNoteType[]
  onChange: (updated: StickyNoteType[]) => void
  readOnly?: boolean
}

// Wrapper that makes a StickyNote draggable via @dnd-kit
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

  const style: React.CSSProperties = {
    position: 'absolute',
    left: note.x,
    top: note.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <StickyNote
        note={{ ...note, x: 0, y: 0 }}
        onEdit={onEdit}
        onDelete={onDelete}
        readOnly={readOnly}
      />
    </div>
  )
}

export function StickyNotesBoard({ notes, onChange, readOnly = false }: StickyNotesBoardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>(STICKY_NOTE_COLORS[0])
  const boardRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getRandomPosition = useCallback(() => {
    const boardWidth = boardRef.current?.clientWidth || 800
    const boardHeight = boardRef.current?.clientHeight || 600
    const x = Math.floor(Math.random() * Math.max(boardWidth - 200, 100))
    const y = Math.floor(Math.random() * Math.max(boardHeight - 150, 50))
    return { x, y }
  }, [])

  const addNote = () => {
    const { x, y } = getRandomPosition()
    const colorIndex = Math.floor(Math.random() * STICKY_NOTE_COLORS.length)
    const newNote: StickyNoteType = {
      id: crypto.randomUUID(),
      content: '',
      color: selectedColor || STICKY_NOTE_COLORS[colorIndex],
      x,
      y,
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
            ? {
                ...n,
                x: Math.max(0, n.x + delta.x),
                y: Math.max(0, n.y + delta.y),
              }
            : n
        )
      )
    },
    [notes, onChange]
  )

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Plus size={16} />
              Agregar nota
            </Button>

            {/* Color picker dropdown */}
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-card
                    border border-neutral-lighter p-3 z-30"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Palette size={14} className="text-neutral" />
                    <span className="text-xs font-body text-neutral">Elige un color:</span>
                  </div>
                  <div className="flex gap-2">
                    {STICKY_NOTE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color)
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer
                          hover:scale-110 ${
                            selectedColor === color
                              ? 'border-accent ring-2 ring-accent/30 scale-110'
                              : 'border-neutral-lighter'
                          }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                    onClick={addNote}
                  >
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

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={notes.map((n) => n.id)} strategy={rectSortingStrategy}>
          <div
            ref={boardRef}
            className="relative min-h-[600px] w-full rounded-xl border-2 border-dashed
              border-neutral-lighter bg-neutral-lighter/20 overflow-hidden"
          >
            {/* Empty state */}
            {notes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neutral-lighter/60 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-neutral/40" />
                </div>
                <p className="text-neutral font-body text-sm max-w-xs">
                  {readOnly
                    ? 'No hay notas todavia.'
                    : 'Haz clic en "Agregar nota" para comenzar a crear tu mural de ideas.'}
                </p>
              </div>
            )}

            {/* Notes */}
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
  )
}
