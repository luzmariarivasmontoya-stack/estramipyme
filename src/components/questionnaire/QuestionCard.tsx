import { motion } from 'framer-motion'
import type { QuestionItem } from '@/data/questionnaire'

const LIKERT_LABELS = [
  { value: 1, label: 'Muy en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Muy de acuerdo' },
] as const

interface QuestionCardProps {
  question: QuestionItem
  value: number // 0 = unanswered, 1-5 = Likert
  onChange: (questionId: string, value: number) => void
  disabled?: boolean
}

export function QuestionCard({ question, value, onChange, disabled = false }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-xl shadow-card p-5
        ${disabled ? 'opacity-50 pointer-events-none select-none' : ''}
      `}
    >
      <p className="text-foreground font-body text-sm leading-relaxed mb-4">
        {question.text}
      </p>

      <div className="flex flex-wrap gap-2">
        {LIKERT_LABELS.map(({ value: likertValue, label }) => {
          const isSelected = value === likertValue

          return (
            <button
              key={likertValue}
              type="button"
              disabled={disabled}
              onClick={() => onChange(question.id, likertValue)}
              title={label}
              className={`
                flex-1 min-w-[5.5rem] px-2 py-2 rounded-lg text-xs font-medium
                transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-neutral-lighter text-neutral hover:bg-neutral-light hover:text-foreground'
                }
                disabled:cursor-not-allowed
              `}
            >
              <span className="block text-base font-semibold leading-none mb-1">
                {likertValue}
              </span>
              <span className="block leading-tight">{label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
