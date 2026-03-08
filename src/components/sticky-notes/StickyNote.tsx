import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { StickyNote as StickyNoteType } from '@/types/stages'

interface StickyNoteProps {
  note: StickyNoteType
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  readOnly?: boolean
}

export function StickyNote({ note, onEdit, onDelete, readOnly = false }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(note.content)
  const [isHovered, setIsHovered] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Random rotation between -3 and 3 degrees, stable per note
  const rotation = useMemo(() => {
    // Use a hash-like approach based on the id to get a stable rotation
    let hash = 0
    for (let i = 0; i < note.id.length; i++) {
      hash = ((hash << 5) - hash + note.id.charCodeAt(i)) | 0
    }
    return (hash % 7) - 3 // Range: -3 to 3
  }, [note.id])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (readOnly) return
    setEditValue(note.content)
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    const trimmed = editValue.trim()
    if (trimmed !== note.content && onEdit) {
      onEdit(note.id, trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(note.content)
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
  }

  return (
    <motion.div
      className="absolute select-none"
      style={{
        left: note.x,
        top: note.y,
        rotate: rotation,
        zIndex: isEditing || isHovered ? 20 : 10,
      }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="w-[180px] h-[120px] rounded-lg p-3 flex flex-col relative
          transition-shadow duration-200 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: note.color,
          boxShadow: isHovered
            ? '0 8px 20px rgba(0, 0, 0, 0.15)'
            : '0 2px 6px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Delete button */}
        {!readOnly && isHovered && !isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(note.id)
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full
              flex items-center justify-center shadow-md text-neutral
              hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer z-30"
            aria-label="Eliminar nota"
          >
            <X size={12} />
          </motion.button>
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none bg-transparent border-0
              text-sm text-foreground font-body focus:outline-none"
            placeholder="Escribe algo..."
          />
        ) : (
          <p className="text-sm text-foreground font-body leading-snug overflow-hidden line-clamp-5">
            {note.content || (
              <span className="text-neutral/50 italic">Doble clic para editar</span>
            )}
          </p>
        )}
      </div>
    </motion.div>
  )
}
