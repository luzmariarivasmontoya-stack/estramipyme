import { useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, AlertCircle } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useFreemium } from '@/hooks/useFreemium'
import { Card } from '@/components/common/Card'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { QuestionCard } from '@/components/questionnaire/QuestionCard'
import { QuestionnaireProgress } from '@/components/questionnaire/QuestionnaireProgress'
import { questions, QUESTIONNAIRE_CATEGORIES } from '@/data/questionnaire'
import { FREE_QUESTION_LIMIT } from '@/utils/constants'
import { staggerContainer, staggerItem } from '@/utils/animations'

export default function Questionnaire() {
  const { currentCompany, dispatchCompany } = useCompany()
  const { isPro } = useFreemium()

  const answers: Record<string, number> = currentCompany?.questionnaire.answers ?? {}

  // ── Derived data ────────────────────────────────────────────────
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v > 0).length,
    [answers]
  )

  const accessibleTotal = isPro ? questions.length : FREE_QUESTION_LIMIT

  const questionsByCategory = useMemo(() => {
    const grouped: Record<string, typeof questions> = {}
    for (const cat of QUESTIONNAIRE_CATEGORIES) {
      grouped[cat] = questions.filter((q) => q.category === cat)
    }
    return grouped
  }, [])

  const categoryAverages = useMemo(() => {
    return QUESTIONNAIRE_CATEGORIES.map((cat) => {
      const catQuestions = questions.filter((q) => q.category === cat)
      const catAnswers = catQuestions
        .map((q) => answers[q.id] ?? 0)
        .filter((v) => v > 0)
      const avg = catAnswers.length > 0
        ? catAnswers.reduce((sum, v) => sum + v, 0) / catAnswers.length
        : 0
      return { category: cat, average: avg, answeredCount: catAnswers.length, totalCount: catQuestions.length }
    })
  }, [answers])

  // ── Handlers ────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (questionId: string, value: number) => {
      if (!currentCompany) return
      const updatedAnswers = { ...currentCompany.questionnaire.answers, [questionId]: value }
      dispatchCompany({
        type: 'UPDATE_COMPANY',
        payload: {
          ...currentCompany,
          questionnaire: {
            ...currentCompany.questionnaire,
            answers: updatedAnswers,
          },
        },
      })
    },
    [currentCompany, dispatchCompany]
  )

  // ── No company fallback ─────────────────────────────────────────
  if (!currentCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={48} className="text-neutral mb-4" />
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          No hay empresa seleccionada
        </h2>
        <p className="text-neutral font-body mb-6 max-w-md">
          Para completar el cuestionario estratégico, primero selecciona o crea una empresa desde el
          panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <ClipboardList size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  // ── Determine which questions are free vs locked ────────────────
  let globalIndex = 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          Cuestionario Estratégico
        </h1>
        <p className="text-neutral font-body text-sm max-w-xl">
          Evalúa el estado actual de tu empresa en seis dimensiones estratégicas clave. Responde
          cada afirmación según tu nivel de acuerdo.
        </p>
      </motion.div>

      {/* Progress */}
      <QuestionnaireProgress answered={answeredCount} total={accessibleTotal} />

      {/* Questions grouped by category */}
      {QUESTIONNAIRE_CATEGORIES.map((category) => {
        const categoryQuestions = questionsByCategory[category]

        return (
          <motion.section
            key={category}
            {...staggerContainer}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-lg font-heading font-semibold text-foreground mb-1">
              {category}
            </h2>
            <p className="text-xs text-neutral font-body mb-4">
              {categoryQuestions.length} preguntas en esta dimensión
            </p>

            <div className="space-y-4">
              {categoryQuestions.map((question) => {
                const currentGlobalIndex = globalIndex
                globalIndex++

                const isFree = currentGlobalIndex < FREE_QUESTION_LIMIT

                if (isFree || isPro) {
                  return (
                    <motion.div key={question.id} {...staggerItem}>
                      <QuestionCard
                        question={question}
                        value={answers[question.id] ?? 0}
                        onChange={handleAnswer}
                      />
                    </motion.div>
                  )
                }

                // Locked question wrapped in FreemiumGate
                return (
                  <motion.div key={question.id} {...staggerItem}>
                    <FreemiumGate feature="todas las preguntas del cuestionario">
                      <QuestionCard
                        question={question}
                        value={0}
                        onChange={() => {}}
                        disabled
                      />
                    </FreemiumGate>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )
      })}

      {/* Category summary */}
      {answeredCount > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
              Resumen por dimensión
            </h2>
            <div className="space-y-3">
              {categoryAverages.map(({ category, average, answeredCount: catAnswered, totalCount }) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-body text-foreground">{category}</span>
                    <span className="text-xs text-neutral font-body">
                      {average > 0 ? average.toFixed(1) : '—'} / 5
                      <span className="ml-2 text-neutral">
                        ({catAnswered}/{totalCount})
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-lighter rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(average / 5) * 100}%`,
                        backgroundColor: average >= 4 ? '#2D5016' : average >= 2.5 ? '#E8682A' : '#8B8B7A',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      )}
    </div>
  )
}
