import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { investigatorRoles } from '@/data/investigatorRoles'

interface InvestigatorRolesProps {
  notes: Record<string, string>
  onNotesChange: (notes: Record<string, string>) => void
}

const roleColors: Record<string, string> = {
  detective: 'bg-accent',
  periodista: 'bg-secondary',
  antropologo: 'bg-amber-500',
  personificador: 'bg-rose-500',
  cocreador: 'bg-emerald-600',
  cientifico: 'bg-violet-600',
}

export function InvestigatorRoles({ notes, onNotesChange }: InvestigatorRolesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleNoteChange = (roleId: string, value: string) => {
    onNotesChange({ ...notes, [roleId]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {investigatorRoles.map((role) => {
        const isExpanded = expandedId === role.id
        const colorClass = roleColors[role.id] || 'bg-accent'
        const initial = role.name.charAt(0).toUpperCase()

        return (
          <Card key={role.id} className="overflow-hidden !p-0">
            <button
              type="button"
              className="w-full text-left p-5 cursor-pointer"
              onClick={() => toggleExpand(role.id)}
              aria-expanded={isExpanded}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full ${colorClass} flex items-center justify-center`}
                >
                  <span className="text-white font-heading font-bold text-lg">{initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-heading font-semibold text-foreground text-base">
                      {role.name}
                    </h4>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-neutral flex-shrink-0" />
                    </motion.div>
                  </div>
                  <p className="text-neutral text-sm mt-1 font-body leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-neutral-lighter">
                    <div className="mt-4">
                      <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
                        Preguntas Guía
                      </h5>
                      <ul className="space-y-2 mb-4">
                        {role.questions.map((question, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-neutral font-body"
                          >
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colorClass} flex-shrink-0`} />
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label className="text-sm font-heading font-medium text-foreground mb-2 block">
                        Tus notas
                      </label>
                      <textarea
                        value={notes[role.id] || ''}
                        onChange={(e) => handleNoteChange(role.id, e.target.value)}
                        placeholder={`Escribe tus observaciones como ${role.name}...`}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-lighter bg-neutral-lighter/30
                          text-foreground font-body text-sm placeholder:text-neutral
                          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                          transition-all duration-200 resize-y"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )
      })}
    </div>
  )
}
