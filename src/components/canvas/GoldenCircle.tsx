import { useState, useEffect, useCallback } from 'react'
import { X, HelpCircle } from 'lucide-react'
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
  svgLabel: string
  r: number
  fill: string
  stroke: string
}[] = [
  {
    field: 'what',
    label: '¿Qué? — Producto/Servicio',
    svgLabel: '¿QUÉ?',
    r: 170,
    fill: 'rgba(212, 212, 200, 0.35)',
    stroke: '#D4D4C8',
  },
  {
    field: 'how',
    label: '¿Cómo? — Proceso',
    svgLabel: '¿CÓMO?',
    r: 115,
    fill: 'rgba(45, 80, 22, 0.15)',
    stroke: '#2D5016',
  },
  {
    field: 'why',
    label: '¿Por qué? — Propósito',
    svgLabel: '¿POR QUÉ?',
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
  questions: string[]
}[] = [
  {
    field: 'why',
    title: 'WHY (¿Por qué?)',
    color: 'bg-orange-50',
    borderColor: 'border-accent',
    questions: [
      '¿Por qué existe tu negocio?',
      '¿Cuál es tu propósito más profundo?',
      '¿En qué crees firmemente?',
    ],
  },
  {
    field: 'how',
    title: 'HOW (¿Cómo?)',
    color: 'bg-green-50',
    borderColor: 'border-secondary',
    questions: [
      '¿Cómo lo haces diferente a los demás?',
      '¿Cuál es tu proceso único o ventaja?',
    ],
  },
  {
    field: 'what',
    title: 'WHAT (¿Qué?)',
    color: 'bg-stone-50',
    borderColor: 'border-neutral-light',
    questions: [
      '¿Qué productos o servicios ofreces?',
      '¿Qué resultado tangible entregas?',
    ],
  },
]

const MODAL_CONFIG: Record<
  CircleField,
  { title: string; questions: string[] }
> = {
  why: {
    title: '¿Por qué? — Propósito',
    questions: [
      '¿Por qué existe tu negocio?',
      '¿Cuál es tu propósito más profundo?',
      '¿En qué crees firmemente?',
    ],
  },
  how: {
    title: '¿Cómo? — Proceso',
    questions: [
      '¿Cómo lo haces diferente a los demás?',
      '¿Cuál es tu proceso único o ventaja?',
    ],
  },
  what: {
    title: '¿Qué? — Producto/Servicio',
    questions: [
      '¿Qué productos o servicios ofreces?',
      '¿Qué resultado tangible entregas?',
    ],
  },
}

// SVG label positions — placed in the visible "ring" area of each circle
const LABEL_POSITIONS: Record<CircleField, { x: number; y: number }> = {
  what: { x: 200, y: 46 },
  how: { x: 200, y: 108 },
  why: { x: 200, y: 200 },
}

// White background rect dimensions per label
const LABEL_BG: Record<CircleField, { w: number; h: number }> = {
  what: { w: 54, h: 22 },
  how: { w: 68, h: 22 },
  why: { w: 100, h: 22 },
}

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
      setEditValue('')
    }
  }

  const handleCancel = useCallback(() => {
    setEditing(null)
    setEditValue('')
  }, [])

  // Global Escape key listener for modal
  useEffect(() => {
    if (!editing) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [editing, handleCancel])

  return (
    <div className="space-y-8">
      {/* Top section: SVG + guiding questions side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Golden Circle SVG — structure only, no user text */}
        <div className="relative flex flex-col items-center flex-shrink-0">
          <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto">
            {CIRCLE_CONFIG.map(({ field, r, fill, stroke, svgLabel }) => {
              const pos = LABEL_POSITIONS[field]
              const bg = LABEL_BG[field]
              return (
                <g key={field}>
                  {/* Circle ring */}
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
                  {/* White background rect behind label */}
                  <rect
                    x={pos.x - bg.w / 2}
                    y={pos.y - bg.h / 2 - 1}
                    width={bg.w}
                    height={bg.h}
                    rx={4}
                    fill="white"
                    className="pointer-events-none"
                  />
                  {/* Short label text */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
                    fontSize={field === 'why' ? 14 : 13}
                    fill="#1A1A1A"
                  >
                    {svgLabel}
                  </text>
                </g>
              )
            })}
          </svg>

          {!readOnly && (
            <p className="text-xs text-neutral mt-2 font-body">
              Haz clic en cada anillo para editar
            </p>
          )}
        </div>

        {/* Guiding Questions Panel */}
        <div className="w-full lg:flex-1 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-accent" />
            <h4 className="font-heading font-semibold text-foreground text-sm">
              Preguntas guía
            </h4>
          </div>
          {GUIDING_QUESTIONS.map(({ field, title, color, borderColor, questions }) => (
            <div
              key={field}
              className={`${color} border-l-4 ${borderColor} rounded-r-lg p-4`}
            >
              <p className="font-heading font-semibold text-foreground text-sm mb-1">
                {title}
              </p>
              <ul className="space-y-0.5">
                {questions.map((q, i) => (
                  <li key={i} className="text-sm text-neutral font-body leading-relaxed">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section — below SVG and questions */}
      <div className="w-full">
        <h4 className="font-heading font-semibold text-foreground text-base mb-4">
          Resumen del Círculo Dorado
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WHY card */}
          <div className="bg-orange-50 border-l-4 border-accent rounded-r-lg p-4">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">
              ¿Por qué?
            </p>
            {data.why ? (
              <p className="text-sm text-foreground font-body leading-relaxed">
                {data.why}
              </p>
            ) : (
              <p className="text-sm text-neutral font-body italic leading-relaxed">
                Sin completar — haz clic en el anillo para responder
              </p>
            )}
          </div>

          {/* HOW card */}
          <div className="bg-green-50 border-l-4 border-secondary rounded-r-lg p-4">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">
              ¿Cómo?
            </p>
            {data.how ? (
              <p className="text-sm text-foreground font-body leading-relaxed">
                {data.how}
              </p>
            ) : (
              <p className="text-sm text-neutral font-body italic leading-relaxed">
                Sin completar — haz clic en el anillo para responder
              </p>
            )}
          </div>

          {/* WHAT card */}
          <div className="bg-stone-50 border-l-4 border-neutral rounded-r-lg p-4">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">
              ¿Qué?
            </p>
            {data.what ? (
              <p className="text-sm text-foreground font-body leading-relaxed">
                {data.what}
              </p>
            ) : (
              <p className="text-sm text-neutral font-body italic leading-relaxed">
                Sin completar — haz clic en el anillo para responder
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleCancel}
        >
          <div
            className="relative bg-white rounded-xl shadow-modal p-6 w-full max-w-[500px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral hover:text-foreground transition-colors rounded-lg hover:bg-stone-100 cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h4 className="font-heading text-lg font-semibold text-foreground mb-2 pr-10">
              {MODAL_CONFIG[editing].title}
            </h4>

            {/* Guiding questions */}
            <div className="mb-4 space-y-0.5">
              {MODAL_CONFIG[editing].questions.map((q, i) => (
                <p key={i} className="text-sm text-neutral font-body">
                  {q}
                </p>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-neutral-light rounded-lg text-foreground font-body text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              autoFocus
              placeholder="Escribe aquí..."
            />

            {/* Action buttons */}
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
                Guardar y cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
