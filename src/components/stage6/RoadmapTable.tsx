import { useState } from 'react'
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useSortable, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/common/Button'
import type { RoadmapItem } from '@/types/stages'

interface RoadmapTableProps {
  items: RoadmapItem[]
  onChange: (items: RoadmapItem[]) => void
}

type Timeline = 'corto' | 'mediano' | 'largo'

const TIMELINES: { key: Timeline; label: string; color: string }[] = [
  { key: 'corto', label: 'Corto Plazo', color: 'border-t-green-500' },
  { key: 'mediano', label: 'Mediano Plazo', color: 'border-t-yellow-500' },
  { key: 'largo', label: 'Largo Plazo', color: 'border-t-blue-500' },
]

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', bg: 'bg-neutral-lighter', text: 'text-neutral' },
  en_progreso: { label: 'En progreso', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  completado: { label: 'Completado', bg: 'bg-green-100', text: 'text-green-800' },
} as const

function cycleStatus(status: RoadmapItem['status']): RoadmapItem['status'] {
  if (status === 'pendiente') return 'en_progreso'
  if (status === 'en_progreso') return 'completado'
  return 'pendiente'
}

// Sortable item component
function SortableItem({
  item,
  onDelete,
  onEdit,
  onStatusToggle,
}: {
  item: RoadmapItem
  onDelete: (id: string) => void
  onEdit: (item: RoadmapItem) => void
  onStatusToggle: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const statusInfo = STATUS_CONFIG[item.status]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-neutral-light p-3 shadow-sm group"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-1 text-neutral mb-2 cursor-grab active:cursor-grabbing"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="3" r="1.2" />
          <circle cx="9" cy="3" r="1.2" />
          <circle cx="3" cy="6" r="1.2" />
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="3" cy="9" r="1.2" />
          <circle cx="9" cy="9" r="1.2" />
        </svg>
        <span className="text-[10px] font-body">Arrastrar</span>
      </div>

      {/* Content */}
      <p className="text-sm font-body text-foreground mb-1 font-medium">
        {item.action}
      </p>
      {item.responsible && (
        <p className="text-xs font-body text-neutral mb-1">
          Responsable: {item.responsible}
        </p>
      )}
      {item.recursosNecesarios && (
        <p className="text-xs font-body text-neutral mb-1">
          Recursos: {item.recursosNecesarios}
        </p>
      )}
      {item.indicadorExito && (
        <p className="text-xs font-body text-neutral mb-2">
          Indicador: {item.indicadorExito}
        </p>
      )}

      {/* Footer: status + actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onStatusToggle(item.id)}
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusInfo.bg} ${statusInfo.text} cursor-pointer hover:opacity-80 transition-opacity`}
        >
          {statusInfo.label}
        </button>
        <div className="hidden group-hover:flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1 text-neutral hover:text-accent transition-colors cursor-pointer"
            aria-label="Editar acción"
          >
            <Edit3 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1 text-neutral hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Eliminar acción"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function RoadmapTable({ items, onChange }: RoadmapTableProps) {
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null)
  const [addingTimeline, setAddingTimeline] = useState<Timeline | null>(null)
  const [newAction, setNewAction] = useState('')
  const [newResponsible, setNewResponsible] = useState('')
  const [newRecursos, setNewRecursos] = useState('')
  const [newIndicador, setNewIndicador] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const getItemsForTimeline = (timeline: Timeline) =>
    items.filter((i) => i.timeline === timeline)

  const handleAddItem = (timeline: Timeline) => {
    if (!newAction.trim()) return
    const newItem: RoadmapItem = {
      id: crypto.randomUUID(),
      action: newAction.trim(),
      responsible: newResponsible.trim(),
      timeline,
      status: 'pendiente',
      recursosNecesarios: newRecursos.trim(),
      indicadorExito: newIndicador.trim(),
    }
    onChange([...items, newItem])
    setNewAction('')
    setNewResponsible('')
    setNewRecursos('')
    setNewIndicador('')
    setAddingTimeline(null)
  }

  const handleDeleteItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id))
  }

  const handleStatusToggle = (id: string) => {
    onChange(
      items.map((i) =>
        i.id === id ? { ...i, status: cycleStatus(i.status) } : i
      )
    )
  }

  const handleEditStart = (item: RoadmapItem) => {
    setEditingItem({ ...item })
  }

  const handleEditSave = () => {
    if (!editingItem) return
    onChange(
      items.map((i) => (i.id === editingItem.id ? editingItem : i))
    )
    setEditingItem(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const draggedItem = items.find((i) => i.id === active.id)
    if (!draggedItem) return

    // Check if dropped over a timeline column (over.id might be a column ID)
    const timelineKey = TIMELINES.find((t) => t.key === over.id)
    if (timelineKey) {
      // Move item to a different timeline column
      onChange(
        items.map((i) =>
          i.id === active.id ? { ...i, timeline: timelineKey.key } : i
        )
      )
      return
    }

    // Dropped over another item - move to that item's timeline
    const overItem = items.find((i) => i.id === over.id)
    if (overItem && draggedItem.timeline !== overItem.timeline) {
      onChange(
        items.map((i) =>
          i.id === active.id ? { ...i, timeline: overItem.timeline } : i
        )
      )
    }
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIMELINES.map(({ key, label, color }) => {
            const timelineItems = getItemsForTimeline(key)
            const itemIds = timelineItems.map((i) => i.id)

            return (
              <div
                key={key}
                className={`bg-neutral-lighter/40 rounded-xl border border-neutral-light border-t-4 ${color} p-4 min-h-[200px]`}
              >
                <h4 className="font-heading font-semibold text-foreground text-sm mb-3 text-center">
                  {label}
                </h4>

                <SortableContext items={itemIds}>
                  <div className="space-y-3">
                    {timelineItems.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditStart}
                        onStatusToggle={handleStatusToggle}
                      />
                    ))}
                  </div>
                </SortableContext>

                {timelineItems.length === 0 && !addingTimeline && (
                  <p className="text-xs text-neutral text-center py-4 font-body">
                    Sin acciones registradas
                  </p>
                )}

                {/* Add item form */}
                {addingTimeline === key ? (
                  <div className="mt-3 bg-white rounded-lg border border-neutral-light p-3 space-y-[20px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                        Acción estratégica
                      </label>
                      <input
                        type="text"
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        placeholder="Acción estratégica..."
                        className="w-full px-[14px] py-[10px] text-sm border-[1.5px] border-neutral-lighter rounded-lg font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                        Responsable
                      </label>
                      <input
                        type="text"
                        value={newResponsible}
                        onChange={(e) => setNewResponsible(e.target.value)}
                        placeholder="Responsable..."
                        className="w-full px-[14px] py-[10px] text-sm border-[1.5px] border-neutral-lighter rounded-lg font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                        Recursos necesarios
                      </label>
                      <input
                        type="text"
                        value={newRecursos}
                        onChange={(e) => setNewRecursos(e.target.value)}
                        placeholder="Recursos necesarios..."
                        className="w-full px-[14px] py-[10px] text-sm border-[1.5px] border-neutral-lighter rounded-lg font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-sm font-semibold text-[#4A4A4A] font-body">
                        Indicador de éxito
                      </label>
                      <input
                        type="text"
                        value={newIndicador}
                        onChange={(e) => setNewIndicador(e.target.value)}
                        placeholder="Indicador de éxito..."
                        className="w-full px-[14px] py-[10px] text-sm border-[1.5px] border-neutral-lighter rounded-lg font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => { setAddingTimeline(null); setNewAction(''); setNewResponsible(''); setNewRecursos(''); setNewIndicador('') }}
                        className="p-1.5 text-neutral hover:text-foreground cursor-pointer"
                        aria-label="Cancelar"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddItem(key)}
                        className="p-1.5 text-accent hover:text-accent-dark cursor-pointer"
                        aria-label="Confirmar"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setAddingTimeline(key); setNewAction(''); setNewResponsible(''); setNewRecursos(''); setNewIndicador('') }}
                      className="w-full justify-center"
                    >
                      <Plus size={14} />
                      Agregar acción
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DndContext>

      {/* Edit modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="bg-white rounded-xl shadow-card p-6 w-full max-w-md mx-4 space-y-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-heading font-semibold text-foreground">
              Editar Acción
            </h4>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Acción</label>
              <input
                type="text"
                value={editingItem.action}
                onChange={(e) => setEditingItem({ ...editingItem, action: e.target.value })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Responsable</label>
              <input
                type="text"
                value={editingItem.responsible}
                onChange={(e) => setEditingItem({ ...editingItem, responsible: e.target.value })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Plazo</label>
              <select
                value={editingItem.timeline}
                onChange={(e) => setEditingItem({ ...editingItem, timeline: e.target.value as Timeline })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
              >
                <option value="corto">Corto Plazo</option>
                <option value="mediano">Mediano Plazo</option>
                <option value="largo">Largo Plazo</option>
              </select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Estado</label>
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as RoadmapItem['status'] })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Recursos necesarios</label>
              <input
                type="text"
                value={editingItem.recursosNecesarios}
                onChange={(e) => setEditingItem({ ...editingItem, recursosNecesarios: e.target.value })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                placeholder="Recursos necesarios..."
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-semibold text-[#4A4A4A] font-body">Indicador de éxito</label>
              <input
                type="text"
                value={editingItem.indicadorExito}
                onChange={(e) => setEditingItem({ ...editingItem, indicadorExito: e.target.value })}
                className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                placeholder="Indicador de éxito..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-sm text-neutral hover:text-foreground transition-colors font-body cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-body cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
