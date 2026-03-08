import { STAGES } from '@/utils/constants'
import { useFreemium } from '@/hooks/useFreemium'
import { Lock } from 'lucide-react'

interface StepProgressProps {
  currentStep: number
  totalSteps?: number
}

export function StepProgress({ currentStep, totalSteps = 6 }: StepProgressProps) {
  const { isStageAccessible } = useFreemium()

  const steps = STAGES.slice(0, totalSteps)

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        {steps.map((stage, index) => {
          const stepNumber = stage.number
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isFuture = stepNumber > currentStep
          const isAccessible = isStageAccessible(stepNumber)
          const isLast = index === steps.length - 1

          return (
            <div
              key={stepNumber}
              className={`flex items-center ${isLast ? '' : 'flex-1'}`}
            >
              {/* Step circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-200 shrink-0
                    ${
                      isCurrent
                        ? 'bg-accent text-white ring-4 ring-accent/20'
                        : isCompleted
                          ? 'bg-accent text-white'
                          : isAccessible
                            ? 'border-2 border-neutral-light text-neutral bg-white'
                            : 'border-2 border-neutral-light text-neutral bg-neutral-lighter'
                    }
                  `}
                >
                  {!isAccessible && isFuture ? (
                    <Lock size={14} />
                  ) : (
                    stepNumber
                  )}
                </div>
                {/* Step label (visible on md+) */}
                <span
                  className={`
                    hidden md:block text-xs mt-1.5 whitespace-nowrap
                    ${isCurrent ? 'text-accent font-semibold' : isCompleted ? 'text-foreground' : 'text-neutral'}
                  `}
                >
                  {stage.name}
                </span>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 mt-[-1.25rem] md:mt-0 md:mb-5
                    transition-colors duration-200
                    ${isCompleted ? 'bg-accent' : 'bg-neutral-light'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
