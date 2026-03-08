import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import type { GoldenCircle as GoldenCircleData } from '@/types/stages'

interface GoldenCircleProps {
  data: GoldenCircleData
  onChange: (data: GoldenCircleData) => void
  readOnly?: boolean
}

type CircleField = 'why' | 'how' | 'what'

const CIRCLE_CONFIG: {
  field: CircleField
  label: string
  r: number
  fill: string
  stroke: string
}[] = [
  {
    field: 'what',
    label: '¿Qué?',
    r: 170,
    fill: 'rgba(212, 212, 200, 0.35)',
    stroke: '#D4D4C8',
  },
  {
    field: 'how',
    label: '¿Cómo?',
    r: 115,
    fill: 'rgba(45, 80, 22, 0.15)',
    stroke: '#2D5016',
  },
  {
    field: 'why',
    label: '¿Por qué?',
    r: 60,
    fill: 'rgba(232, 104, 42, 0.25)',
    stroke: '#E8682A',
  },
]

const GUIDING_QUESTIONS: {
  field: CircleField
  title: string
  color: string
  borderColor: string
  question: string
}[] = [
  {
    field: 'why',
    title: 'WHY (¿Por qué?)',
    color: 'bg-orange-50',
    borderColor: 'border-accent',
    question: '¿Por qué existe tu negocio? ¿Cuál es tu propósito? ¿En qué crees?',
  },
  {
    field: 'how',
    title: 'HOW (¿Cómo?)',
    color: 'bg-green-50',
    borderColor: 'border-secondary',
    question: '¿Cómo lo haces diferente? ¿Cuál es tu proceso único?',
  },
  {
    field: 'what',
    title: 'WHAT (¿Qué?)',
    color: 'bg-stone-50',
    borderColor: 'border-neutral-light',
    question: '¿Qué productos o servicios ofreces?',
  },
]

export function GoldenCircle({ data, onChange, readOnly = false }: GoldenCircleProps) {
  const [editing, setEditing] = useState<CircleField | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleCircleClick = (field: CircleField) => {
    if (readOnly) return
    setEditing(field)
    setEditValue(data[field] || '')
  }

  const handleSave = () => {
    if (editing) {
      onChange({ ...data, [editing]: editValue })
      setEditing(null)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel()
  }

  const labelPositions: Record<CircleField, { x: number; y: number }> = {
    what: { x: 200, y: 42 },
    how: { x: 200, y: 110 },
    why: { x: 200, y: 200 },
  }

  const previewPositions: Record<CircleField, { x: number; y: number; width: number }> = {
    what: { x: 200, y: 62, width: 140 },
    how: { x: 200, y: 135, width: 100 },
    why: { x: 200, y: 218, width: 70 },
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Golden Circle SVG */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto">
          {CIRCLE_CONFIG.map(({ field, label, r, fill, stroke }) => (
            <g key={field}>
              <circle
                cx={200}
                cy={200}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                className={readOnly ? '' : 'cursor-pointer hover:opacity-80 transition-opacity'}
                onClick={() => handleCircleClick(field)}
              />
              <text
                x={labelPositions[field].x}
                y={labelPositions[field].y}
                textAnchor="middle"
                className="font-heading font-semibold pointer-events-none select-none"
                fontSize={field === 'why' ? 15 : 14}
                fill="#1A1A1A"
              >
                {label}
              </text>
              {data[field] && (
                <foreignObject
                  x={previewPositions[field].x - previewPositions[field].width / 2}
                  y={previewPositions[field].y}
                  width={previewPositions[field].width}
                  height={field === 'what' ? 40 : 30}
                  className="pointer-events-none"
                >
                  <p className="text-[10px] text-foreground text-center leading-tight line-clamp-2 font-body">
                    {data[field]}
                  </p>
                </foreignObject>
              )}
            </g>
          ))}
        </svg>

        {!readOnly && (
          <p className="text-xs text-neutral mt-2 font-body">
            Haz clic en cada circulo para editar
          </p>
        )}
      </div>

      {/* Guiding Questions Panel */}
      <div className="w-full lg:flex-1 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground text-sm">
            Preguntas guia
          </h4>
        </div>
        {GUIDING_QUESTIONS.map(({ field, title, color, borderColor, question }) => (
          <div
            key={field}
            className={`${color} border-l-4 ${borderColor} rounded-r-lg p-4`}
          >
            <p className="font-heading font-semibold text-foreground text-sm mb-1">
              {title}
            </p>
            <p className="text-sm text-neutral font-body leading-relaxed">
              {question}
            </p>
            {data[field] && (
              <p className="mt-2 text-sm text-foreground font-body italic border-t border-neutral-lighter pt-2">
                {data[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Edit modal overlay */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleCancel}
          onKeyDown={handleKeyDown}
        >
          <div
            className="bg-white rounded-xl shadow-card p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-heading text-lg font-semibold text-foreground mb-1">
              {editing === 'why' && '¿Por qué? - Propósito'}
              {editing === 'how' && '¿Cómo? - Proceso'}
              {editing === 'what' && '¿Qué? - Producto/Servicio'}
            </h4>
            <p className="text-sm text-neutral font-body mb-4">
              {editing === 'why' && '¿Por qué existe tu negocio? ¿Cuál es tu propósito? ¿En qué crees?'}
              {editing === 'how' && '¿Cómo lo haces diferente? ¿Cuál es tu proceso único?'}
              {editing === 'what' && '¿Qué productos o servicios ofreces?'}
            </p>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-neutral-light rounded-lg text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              autoFocus
              placeholder="Escribe aquí..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-neutral hover:text-foreground transition-colors font-body cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
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
