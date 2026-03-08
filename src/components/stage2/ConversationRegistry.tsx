import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Users, ChevronDown, ChevronUp, Lightbulb, Check } from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { ConversationEntry } from '@/types/stages'

const DEFAULT_ACTORS = [
  'Fundador/dueño',
  'Administrador/gerente',
  'Empleado',
  'Vendedor',
  'Cliente 1',
  'Cliente 2',
  'No cliente',
  'Proveedor',
  'Otros',
]

const QUESTION_HEADERS = [
  { key: 'pregunta1' as const, label: '¿Qué es lo que más valoran los clientes de este negocio?' },
  { key: 'pregunta2' as const, label: '¿Qué nos diferencia del principal competidor?' },
  { key: 'pregunta3' as const, label: 'Si fuera el dueño, ¿qué le cambiaría al negocio?' },
  { key: 'pregunta4' as const, label: '¿Cuál es su mayor preocupación en relación con el negocio?' },
]

const TIPS_BY_TYPE: Record<string, { title: string; questions: string[] }> = {
  clientes: {
    title: 'Preguntas sugeridas para Clientes',
    questions: [
      '¿Cómo conoció este negocio?',
      '¿Qué tan frecuente es su compra?',
      '¿Nos recomendaría? ¿Por qué?',
    ],
  },
  empleados: {
    title: 'Preguntas sugeridas para Empleados',
    questions: [
      '¿Se siente valorado en la empresa?',
      '¿Qué herramientas le hacen falta?',
      '¿Cómo describe el ambiente laboral?',
    ],
  },
  proveedores: {
    title: 'Preguntas sugeridas para Proveedores',
    questions: [
      '¿Cómo califica la relación comercial?',
      '¿Qué mejoraría de la comunicación?',
      '¿Ve potencial de crecimiento en este negocio?',
    ],
  },
}

function getTipsType(actor: string): string | null {
  const lower = actor.toLowerCase().trim()
  if (
    lower === 'cliente 1' ||
    lower === 'cliente 2' ||
    lower === 'no cliente'
  ) {
    return 'clientes'
  }
  if (lower === 'empleado' || lower === 'vendedor') {
    return 'empleados'
  }
  if (lower === 'proveedor') {
    return 'proveedores'
  }
  return null
}

function hasAnyAnswer(entry: ConversationEntry): boolean {
  return !!(
    entry.pregunta1.trim() ||
    entry.pregunta2.trim() ||
    entry.pregunta3.trim() ||
    entry.pregunta4.trim()
  )
}

interface ConversationRegistryProps {
  conversations: ConversationEntry[]
  onChange: (updated: ConversationEntry[]) => void
}

/* ─── Auto-resize textarea ─── */
function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  minHeight = 80,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      const scrollH = ref.current.scrollHeight
      ref.current.style.height = `${Math.max(scrollH, minHeight)}px`
    }
  }, [minHeight])

  useEffect(() => {
    resize()
  }, [value, resize])

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleInput}
      placeholder={placeholder}
      rows={3}
      style={{ minHeight: `${minHeight}px` }}
      className="w-full resize-none bg-transparent border border-neutral-lighter/60 text-sm
        text-foreground font-body placeholder:text-neutral/50 focus:outline-none
        focus:ring-1 focus:ring-accent/30 focus:border-accent rounded-lg p-2
        transition-colors hover:bg-neutral-lighter/30"
    />
  )
}

/* ─── Collapsible tips ─── */
function CollapsibleTips({ actor }: { actor: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const tipsType = getTipsType(actor)

  if (!tipsType) return null

  const tips = TIPS_BY_TYPE[tipsType]

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-dark
          transition-colors font-body cursor-pointer"
      >
        <Lightbulb size={14} />
        <span>Preguntas de seguimiento</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-xs font-heading font-semibold text-accent mb-2">
                {tips.title}
              </p>
              <ul className="space-y-1">
                {tips.questions.map((q) => (
                  <li key={q} className="text-xs text-foreground/70 font-body flex items-start gap-1.5">
                    <span className="text-accent mt-0.5">-</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Mobile accordion item ─── */
function AccordionItem({
  entry,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  entry: ConversationEntry
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (field: keyof ConversationEntry, value: string) => void
  onDelete: () => void
}) {
  const answered = hasAnyAnswer(entry)

  return (
    <div className="border border-neutral-lighter/60 rounded-xl overflow-hidden bg-white">
      {/* Accordion header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-lighter/20
          hover:bg-neutral-lighter/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {answered && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
              <Check size={13} className="text-green-600" />
            </span>
          )}
          <span className="font-heading font-semibold text-sm text-foreground">
            {entry.actor}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                onDelete()
              }
            }}
            className="p-1.5 text-neutral/40 hover:text-red-500 rounded-lg
              hover:bg-red-50 transition-colors"
            aria-label={`Eliminar actor ${entry.actor}`}
          >
            <Trash2 size={15} />
          </span>
          {isExpanded ? (
            <ChevronUp size={18} className="text-neutral" />
          ) : (
            <ChevronDown size={18} className="text-neutral" />
          )}
        </div>
      </button>

      {/* Accordion body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 border-t border-neutral-lighter/60">
              {/* Actor name edit */}
              <div>
                <label className="block text-xs font-heading font-semibold text-foreground mb-1">
                  Nombre del actor
                </label>
                <input
                  type="text"
                  value={entry.actor}
                  onChange={(e) => onUpdate('actor', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-lighter rounded-lg
                    bg-white text-foreground font-body placeholder:text-neutral/50
                    focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent"
                />
                <CollapsibleTips actor={entry.actor} />
              </div>

              {/* Questions */}
              {QUESTION_HEADERS.map((q) => (
                <div key={q.key}>
                  <label className="block text-xs font-heading font-semibold text-foreground/80 mb-1.5 leading-snug">
                    {q.label}
                  </label>
                  <AutoResizeTextarea
                    value={entry[q.key]}
                    onChange={(val) => onUpdate(q.key, val)}
                    placeholder="Escribe aquí..."
                    minHeight={64}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main component ─── */
export function ConversationRegistry({ conversations, onChange }: ConversationRegistryProps) {
  const [newActorName, setNewActorName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Auto-expand first actor on mobile when conversations change from 0 to some
  useEffect(() => {
    if (conversations.length > 0 && expandedId === null) {
      setExpandedId(conversations[0].id)
    }
  }, [conversations, expandedId])

  const existingActors = conversations.map((c) => c.actor)
  const availableSuggestions = DEFAULT_ACTORS.filter(
    (a) => !existingActors.includes(a)
  )

  const addRow = (actorName: string) => {
    const trimmed = actorName.trim()
    if (!trimmed) return

    const newEntry: ConversationEntry = {
      id: crypto.randomUUID(),
      actor: trimmed,
      pregunta1: '',
      pregunta2: '',
      pregunta3: '',
      pregunta4: '',
    }
    onChange([...conversations, newEntry])
    setNewActorName('')
    setShowSuggestions(false)
    // Expand the newly added actor on mobile
    setExpandedId(newEntry.id)
  }

  const deleteRow = (id: string) => {
    onChange(conversations.filter((c) => c.id !== id))
    if (expandedId === id) {
      setExpandedId(null)
    }
  }

  const updateCell = (
    id: string,
    field: keyof ConversationEntry,
    value: string
  ) => {
    onChange(
      conversations.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRow(newActorName)
    }
  }

  // ─── Empty state ───
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-neutral/40 mb-4" />
        <h4 className="font-heading text-lg text-foreground mb-2">
          Sin conversaciones registradas
        </h4>
        <p className="text-neutral font-body text-sm mb-6 max-w-md mx-auto">
          Agrega actores clave de tu negocio para registrar sus respuestas a las 4 preguntas
          estratégicas. Esto te ayudará a conocer mejor tu entorno.
        </p>

        {/* Quick add suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {DEFAULT_ACTORS.map((actor) => (
            <button
              key={actor}
              onClick={() => addRow(actor)}
              className="px-3 py-1.5 text-sm bg-neutral-lighter text-foreground rounded-lg
                hover:bg-accent hover:text-white transition-colors font-body cursor-pointer"
            >
              + {actor}
            </button>
          ))}
        </div>

        {/* Custom actor input */}
        <div className="flex items-center gap-2 justify-center max-w-sm mx-auto">
          <input
            type="text"
            value={newActorName}
            onChange={(e) => setNewActorName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="O escribe un actor personalizado..."
            className="flex-1 px-3 py-2 text-sm border border-neutral-lighter rounded-lg
              bg-white text-foreground font-body placeholder:text-neutral/50
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => addRow(newActorName)}
            disabled={!newActorName.trim()}
          >
            <Plus size={16} />
            Agregar
          </Button>
        </div>
      </div>
    )
  }

  // ─── Populated state ───
  return (
    <div className="space-y-4">

      {/* ═══ DESKTOP / TABLET TABLE (hidden on mobile) ═══ */}
      <div className="hidden md:block">
        <div
          className="overflow-x-auto border border-neutral-lighter/60 rounded-xl"
          style={{ scrollbarGutter: 'stable' }}
        >
          <table className="w-full border-collapse" style={{ minWidth: '1060px' }}>
            <thead>
              <tr className="bg-neutral-lighter/30 border-b-2 border-neutral-lighter">
                {/* Actor column: sticky on tablet, normal on desktop */}
                <th
                  className="text-left py-3 px-3 text-sm font-heading font-semibold text-foreground
                    lg:static md:sticky md:left-0 md:z-10 md:bg-neutral-lighter/30"
                  style={{ width: '140px', minWidth: '140px' }}
                >
                  Actor
                </th>
                {QUESTION_HEADERS.map((q) => (
                  <th
                    key={q.key}
                    className="text-left py-3 px-3 text-xs font-heading font-semibold text-foreground
                      border-l border-neutral-lighter/60"
                    style={{ minWidth: '200px' }}
                  >
                    {q.label}
                  </th>
                ))}
                <th
                  className="py-3 px-3 text-center text-sm font-heading font-semibold text-foreground
                    border-l border-neutral-lighter/60"
                  style={{ width: '70px', minWidth: '70px' }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {conversations.map((entry) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-neutral-lighter/60 hover:bg-neutral-lighter/20
                      transition-colors group"
                  >
                    {/* Actor cell: sticky on tablet */}
                    <td
                      className="py-2 px-3 align-top border-r border-neutral-lighter/60
                        lg:static md:sticky md:left-0 md:z-10 md:bg-white"
                      style={{ width: '140px', minWidth: '140px' }}
                    >
                      <AutoResizeTextarea
                        value={entry.actor}
                        onChange={(val) => updateCell(entry.id, 'actor', val)}
                        placeholder="Actor"
                        minHeight={80}
                      />
                      <CollapsibleTips actor={entry.actor} />
                    </td>
                    {QUESTION_HEADERS.map((q) => (
                      <td
                        key={q.key}
                        className="py-2 px-3 align-top border-r border-neutral-lighter/60"
                        style={{ minWidth: '200px' }}
                      >
                        <AutoResizeTextarea
                          value={entry[q.key]}
                          onChange={(val) => updateCell(entry.id, q.key, val)}
                          placeholder="Escribe aquí..."
                          minHeight={80}
                        />
                      </td>
                    ))}
                    <td
                      className="py-2 px-3 text-center align-top"
                      style={{ width: '70px', minWidth: '70px' }}
                    >
                      <button
                        onClick={() => deleteRow(entry.id)}
                        className="p-1.5 text-neutral/40 hover:text-red-500 rounded-lg
                          hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100
                          focus:opacity-100 cursor-pointer"
                        aria-label={`Eliminar actor ${entry.actor}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ MOBILE ACCORDION (hidden on tablet/desktop) ═══ */}
      <div className="md:hidden space-y-3">
        {conversations.map((entry) => (
          <AccordionItem
            key={entry.id}
            entry={entry}
            isExpanded={expandedId === entry.id}
            onToggle={() =>
              setExpandedId(expandedId === entry.id ? null : entry.id)
            }
            onUpdate={(field, value) => updateCell(entry.id, field, value)}
            onDelete={() => deleteRow(entry.id)}
          />
        ))}
      </div>

      {/* ═══ ADD ROW CONTROLS (shared across all breakpoints) ═══ */}
      <div className="flex items-center gap-2 pt-2">
        <div className="relative flex-1 max-w-xs" ref={suggestionsRef}>
          <input
            type="text"
            value={newActorName}
            onChange={(e) => {
              setNewActorName(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre del actor..."
            className="w-full px-3 py-2 text-sm border border-neutral-lighter rounded-lg
              bg-white text-foreground font-body placeholder:text-neutral/50
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent pr-8"
          />
          {availableSuggestions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral/50
                hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronDown size={16} />
            </button>
          )}

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && availableSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-card
                  border border-neutral-lighter z-20 max-h-48 overflow-y-auto"
              >
                {availableSuggestions
                  .filter((a) =>
                    !newActorName || a.toLowerCase().includes(newActorName.toLowerCase())
                  )
                  .map((actor) => (
                    <button
                      key={actor}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addRow(actor)}
                      className="w-full text-left px-3 py-2 text-sm font-body text-foreground
                        hover:bg-neutral-lighter/50 transition-colors cursor-pointer"
                    >
                      {actor}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => addRow(newActorName)}
          disabled={!newActorName.trim()}
        >
          <Plus size={16} />
          Agregar actor
        </Button>
      </div>
    </div>
  )
}
