import React, { useMemo } from 'react'
import {
  CheckCircle,
  AlertTriangle,
  Circle,
  CircleDot,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useCompany } from '@/hooks/useCompany'
import type { AdLibData } from '@/types/stages'

interface CoherenceCheckerProps {
  notes: string
  onChange: (notes: string) => void
  coherenceScore: 'verde' | 'amarillo' | 'rojo' | null
  onScoreChange: (score: 'verde' | 'amarillo' | 'rojo' | null) => void
  adLib: AdLibData
}

interface CheckItem {
  label: string
  description: string
  completed: boolean
}

// Simple word tokenizer: lowercase, remove punctuation, split by spaces
function tokenize(text: string): string[] {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[.,;:!?¿¡()"'-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3) // skip short words
}

function findCommonWords(textA: string, textB: string): string[] {
  const wordsA = new Set(tokenize(textA))
  const wordsB = tokenize(textB)
  const common = new Set<string>()
  for (const word of wordsB) {
    if (wordsA.has(word)) common.add(word)
  }
  return Array.from(common)
}

function highlightCommon(text: string, commonWords: string[]): React.ReactElement[] {
  if (!text || commonWords.length === 0) return [<span key="0">{text}</span>]
  const lowerCommon = new Set(commonWords.map((w) => w.toLowerCase()))
  const words = text.split(/(\s+)/)
  return words.map((word, i) => {
    const cleaned = word.toLowerCase().replace(/[.,;:!?¿¡()"'-]/g, '')
    if (lowerCommon.has(cleaned)) {
      return (
        <span key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5 font-medium">
          {word}
        </span>
      )
    }
    return <span key={i}>{word}</span>
  })
}

const SCORE_OPTIONS: {
  value: 'verde' | 'amarillo' | 'rojo'
  label: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}[] = [
  {
    value: 'verde',
    label: 'Verde',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    description: 'Coherente',
  },
  {
    value: 'amarillo',
    label: 'Amarillo',
    color: 'bg-yellow-400',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    description: 'Parcialmente coherente',
  },
  {
    value: 'rojo',
    label: 'Rojo',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    description: 'No coherente',
  },
]

export function CoherenceChecker({
  notes,
  onChange,
  coherenceScore,
  onScoreChange,
  adLib,
}: CoherenceCheckerProps) {
  const { currentCompany } = useCompany()

  if (!currentCompany) return null

  const stages = currentCompany.stages

  // Calculate checks from prior stages
  const goldenCircle = stages.stage4?.goldenCircle
  const hasWhy = !!(goldenCircle?.why?.trim())
  const hasHow = !!(goldenCircle?.how?.trim())
  const hasWhat = !!(goldenCircle?.what?.trim())
  const goldenCircleComplete = hasWhy && hasHow && hasWhat

  const vpNotes = stages.stage5?.valuePropCanvas || []
  const vpCount = vpNotes.length
  const hasValuePropNotes = vpCount >= 3

  const vrinAnalysis = stages.stage4?.vrinAnalysis
  const hasStrongVRIN =
    vrinAnalysis?.valuable === true &&
    vrinAnalysis?.rare === true &&
    vrinAnalysis?.inimitable === true &&
    vrinAnalysis?.nonSubstitutable === true
  const strongResources = hasStrongVRIN ? 1 : 0

  const radarData = stages.stage4?.radar || []
  const hasRadar = radarData.some((d) => d.value > 0)

  const businessProfile = stages.stage1?.businessProfile
  const hasProfile = !!(
    businessProfile?.porQueSeFundo?.trim() &&
    businessProfile?.productosServicios?.trim()
  )

  const strategicChallenge = stages.stage4?.strategicChallenge
  const hasChallenge = !!(strategicChallenge?.trim())

  const checks: CheckItem[] = [
    {
      label: 'Círculo Dorado completo',
      description: `Por qué, Cómo y Qué definidos`,
      completed: goldenCircleComplete,
    },
    {
      label: 'Propuesta de valor articulada',
      description: `${vpCount} notas en el canvas de propuesta de valor`,
      completed: hasValuePropNotes,
    },
    {
      label: 'Recursos VRIN identificados',
      description: `${strongResources} recurso(s) con ventaja competitiva sostenida`,
      completed: hasStrongVRIN,
    },
    {
      label: 'Radar organizacional evaluado',
      description: 'Al menos una dimensión evaluada',
      completed: hasRadar,
    },
    {
      label: 'Perfil del negocio definido',
      description: 'Misión y visión establecidas',
      completed: hasProfile,
    },
    {
      label: 'Reto estratégico formulado',
      description: 'Reto principal de la empresa definido',
      completed: hasChallenge,
    },
  ]

  const completedCount = checks.filter((c) => c.completed).length
  const totalChecks = checks.length
  const score = Math.round((completedCount / totalChecks) * 100)

  const scoreColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-400'
  const scoreTextColor = score >= 80 ? 'text-green-700' : score >= 50 ? 'text-yellow-700' : 'text-red-600'

  // Build Ad-Lib full text for comparison
  const adLibText = useMemo(() => {
    return `${adLib.productosServicios} ${adLib.segmento} ${adLib.tarea} ${adLib.frustracion} ${adLib.alegria} ${adLib.competidor}`.trim()
  }, [adLib])

  const whyText = goldenCircle?.why?.trim() || ''

  // Find common words between WHY and Ad-Lib
  const commonWords = useMemo(
    () => findCommonWords(whyText, adLibText),
    [whyText, adLibText]
  )

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-semibold text-foreground">
            Puntuación de Coherencia
          </h4>
          <span className={`text-2xl font-heading font-bold ${scoreTextColor}`}>
            {score}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-lighter rounded-full h-3 mb-6">
          <div
            className={`h-3 rounded-full ${scoreColor} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Check items */}
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3">
              {check.completed ? (
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-neutral-light shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-body font-medium ${check.completed ? 'text-foreground' : 'text-neutral'}`}>
                  {check.label}
                </p>
                <p className="text-xs text-neutral font-body">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Coherence Table: WHY vs Ad-Lib */}
      <Card>
        <h4 className="font-heading font-semibold text-foreground mb-2">
          Tabla de Coherencia
        </h4>
        <p className="text-sm text-neutral font-body mb-4">
          Alineación entre el Propósito (Golden Circle WHY) y la Propuesta de Valor (Ad-Lib).
          Las palabras comunes se resaltan en amarillo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          {/* WHY column */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-1.5 mb-2">
              <CircleDot size={14} className="text-blue-600" />
              <span className="text-xs font-body font-semibold text-blue-700 uppercase tracking-wide">
                Propósito (WHY)
              </span>
            </div>
            <p className="text-sm font-body text-foreground leading-relaxed">
              {whyText
                ? highlightCommon(whyText, commonWords)
                : <span className="text-neutral italic">No definido aún. Completa el Círculo Dorado en la Etapa 4.</span>
              }
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-8">
            <ArrowRight size={24} className="text-neutral" />
          </div>

          {/* Ad-Lib column */}
          <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-1.5 mb-2">
              <CircleDot size={14} className="text-accent" />
              <span className="text-xs font-body font-semibold text-accent uppercase tracking-wide">
                Propuesta de Valor (Ad-Lib)
              </span>
            </div>
            <p className="text-sm font-body text-foreground leading-relaxed">
              {adLibText.trim()
                ? highlightCommon(adLibText, commonWords)
                : <span className="text-neutral italic">No definida aún. Completa la plantilla Ad-Lib arriba.</span>
              }
            </p>
          </div>
        </div>

        {commonWords.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-body text-neutral">Palabras comunes:</span>
            {commonWords.map((word) => (
              <span
                key={word}
                className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-body font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        )}

        {whyText && adLibText.trim() && commonWords.length === 0 && (
          <div className="mt-4 flex items-start gap-2 text-xs font-body text-orange-600 bg-orange-50 p-3 rounded-lg">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>No se encontraron palabras comunes entre el propósito y la propuesta de valor. Considera alinear el lenguaje para mayor coherencia.</span>
          </div>
        )}
      </Card>

      {/* Traffic Light Semaphore */}
      <Card>
        <h4 className="font-heading font-semibold text-foreground mb-2">
          Semáforo de Coherencia
        </h4>
        <p className="text-sm text-neutral font-body mb-4">
          Selecciona tu evaluación manual de la coherencia estratégica.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SCORE_OPTIONS.map((option) => {
            const isSelected = coherenceScore === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onScoreChange(isSelected ? null : option.value)
                }
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer
                  ${isSelected
                    ? `${option.bgColor} ${option.borderColor}`
                    : 'border-neutral-light bg-white hover:border-neutral'
                  }
                `}
              >
                <div className={`w-5 h-5 rounded-full ${option.color} shrink-0`} />
                <div className="text-left">
                  <p className="text-sm font-body font-medium text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs font-body text-neutral">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {coherenceScore && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg text-sm font-body ${
              coherenceScore === 'verde'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : coherenceScore === 'amarillo'
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {coherenceScore === 'verde' &&
              'La estrategia muestra buena alineación entre propósito, propuesta de valor y modelo de negocio.'}
            {coherenceScore === 'amarillo' &&
              'Hay elementos desalineados. Revisa los puntos débiles para fortalecer la coherencia.'}
            {coherenceScore === 'rojo' &&
              'Se detecta desalineación significativa. Es necesario revisar y ajustar la estrategia.'}
          </div>
        )}
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-xs text-neutral font-body mb-1">Propósito (Por qué)</p>
          <p className="text-sm font-body text-foreground line-clamp-2">
            {goldenCircle?.why?.trim() || '---'}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral font-body mb-1">Notas de Propuesta de Valor</p>
          <p className="text-2xl font-heading font-bold text-accent">{vpCount}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral font-body mb-1">Recursos VRIN Fuertes</p>
          <p className="text-2xl font-heading font-bold text-secondary">{strongResources}</p>
        </Card>
      </div>

      {/* Alert if score is low */}
      {score < 50 && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-body font-medium text-yellow-800">
              Coherencia baja
            </p>
            <p className="text-xs font-body text-yellow-700 mt-1">
              Revisa las etapas anteriores para completar los elementos faltantes y fortalecer
              la alineación estratégica de tu empresa.
            </p>
          </div>
        </div>
      )}

      {/* Coherence notes */}
      <Card>
        <h4 className="font-heading font-semibold text-foreground mb-2">
          Observaciones de Coherencia
        </h4>
        <p className="text-sm text-neutral font-body mb-3">
          Registra tus observaciones sobre la alineación entre los diferentes elementos estratégicos.
        </p>
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Anota las observaciones sobre la coherencia estratégica de tu empresa..."
          className="w-full min-h-[120px] p-4 border border-neutral-light rounded-lg text-foreground font-body text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </Card>
    </div>
  )
}
