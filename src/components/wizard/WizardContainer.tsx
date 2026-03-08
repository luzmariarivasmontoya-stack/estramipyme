import { useContext, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lock, Save } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useFreemium } from '@/hooks/useFreemium'
import { useAutosave } from '@/hooks/useAutosave'
import { AppContext } from '@/context/AppContext'
import { STAGES } from '@/utils/constants'
import { StepProgress } from './StepProgress'
import { pageTransition } from '@/utils/animations'

interface WizardContainerProps {
  stageNumber: number
  title: string
  description: string
  children: ReactNode
}

export function WizardContainer({
  stageNumber,
  title,
  description,
  children,
}: WizardContainerProps) {
  const navigate = useNavigate()
  const { isStageAccessible } = useFreemium()
  const { triggerSave } = useAutosave()
  const appContext = useContext(AppContext)

  const isFirst = stageNumber === 1
  const isLast = stageNumber === 6
  const currentStageInfo = STAGES[stageNumber - 1]

  const canGoNext = !isLast && isStageAccessible(stageNumber + 1)
  const nextIsLocked = !isLast && !isStageAccessible(stageNumber + 1)

  const handlePrevious = () => {
    navigate(`/app/etapa/${stageNumber - 1}`)
  }

  const handleNext = () => {
    if (canGoNext) {
      navigate(`/app/etapa/${stageNumber + 1}`)
    } else if (nextIsLocked) {
      appContext?.setUpgradeModalOpen(true)
    }
  }

  const handleSave = () => {
    triggerSave()
  }

  return (
    <motion.div className="max-w-[880px] mx-auto px-4 md:px-8 py-6" {...pageTransition}>
      {/* Step progress bar */}
      <StepProgress currentStep={stageNumber} />

      {/* Stage progress bar (thin line) */}
      <div className="mt-4 mb-2">
        <div className="flex items-center justify-between text-xs text-neutral font-body mb-1">
          <span>Etapa {stageNumber} de 6</span>
        </div>
        <div className="w-full bg-neutral-lighter rounded-full h-1">
          <div
            className="bg-accent rounded-full h-1 transition-all duration-500"
            style={{ width: `${(stageNumber / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold shrink-0">
            {stageNumber}
          </span>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">
            {title}
          </h1>
        </div>
        <p className="text-neutral font-body ml-11">
          {description || currentStageInfo?.description}
        </p>
      </div>

      {/* Stage content with spacing between sections */}
      <div className="min-h-[400px] space-y-12">{children}</div>

      {/* Sticky bottom navigation */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-neutral-lighter mt-10 -mx-4 md:-mx-8 px-4 md:px-8 py-4 flex items-center justify-between z-10">
        {!isFirst ? (
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Etapa anterior</span>
            <span className="sm:hidden">Anterior</span>
          </Button>
        ) : (
          <div />
        )}

        <Button variant="outline" onClick={handleSave} className="hidden sm:flex">
          <Save size={16} />
          Guardar avance
        </Button>

        {!isLast && (
          <Button
            variant={canGoNext ? 'primary' : 'secondary'}
            onClick={handleNext}
          >
            {nextIsLocked ? (
              <>
                <Lock size={16} />
                <span className="hidden sm:inline">Desbloquear con Pro</span>
                <span className="sm:hidden">Pro</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Siguiente etapa</span>
                <span className="sm:hidden">Siguiente</span>
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        )}

        {isLast && (
          <Button variant="primary" onClick={() => navigate('/app/reporte')}>
            Ver reporte
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
