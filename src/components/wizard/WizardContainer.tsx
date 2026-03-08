import { useContext, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useFreemium } from '@/hooks/useFreemium'
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

  return (
    <motion.div className="max-w-5xl mx-auto px-4 py-6" {...pageTransition}>
      {/* Step progress bar */}
      <StepProgress currentStep={stageNumber} />

      {/* Stage header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold">
            {stageNumber}
          </span>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">
            {title}
          </h1>
        </div>
        <p className="text-neutral ml-11">
          {description || currentStageInfo?.description}
        </p>
      </div>

      {/* Stage content */}
      <div className="min-h-[400px]">{children}</div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-lighter">
        {!isFirst ? (
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeft size={18} />
            Anterior
          </Button>
        ) : (
          <div />
        )}

        {!isLast && (
          <Button
            variant={canGoNext ? 'primary' : 'secondary'}
            onClick={handleNext}
          >
            {nextIsLocked ? (
              <>
                <Lock size={16} />
                Desbloquear
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
