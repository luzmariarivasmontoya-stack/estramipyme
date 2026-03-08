import { useState } from 'react'
import { Plus, Trash2, ChevronRight, ChevronLeft, Award } from 'lucide-react'
import { InfoTooltip } from '@/components/common/InfoTooltip'
import { Button } from '@/components/common/Button'
import type { VRINResource, VRINAnalysis } from '@/types/stages'

interface VRINFrameworkProps {
  resources: VRINResource[]
  principalResource: string
  analysis: VRINAnalysis | null
  onResourcesChange: (resources: VRINResource[]) => void
  onPrincipalResourceChange: (value: string) => void
  onAnalysisChange: (analysis: VRINAnalysis | null) => void
}

const RESOURCE_TYPES = [
  { value: 'tangible' as const, label: 'Tangible' },
  { value: 'intangible' as const, label: 'Intangible' },
  { value: 'organizacional' as const, label: 'Organizacional' },
]

const RESOURCE_TYPE_COLORS: Record<string, string> = {
  tangible: 'bg-blue-50 text-blue-700 border-blue-200',
  intangible: 'bg-purple-50 text-purple-700 border-purple-200',
  organizacional: 'bg-amber-50 text-amber-700 border-amber-200',
}

function getVRINResult(analysis: VRINAnalysis): { label: string; color: string; description: string } {
  const v = analysis.valuable === true
  const r = analysis.rare === true
  const i = analysis.inimitable === true
  const n = analysis.nonSubstitutable === true

  if (v && r && i && n) {
    return {
      label: 'Ventaja competitiva sostenible',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Tu recurso cumple con los cuatro criterios VRIN. Esto representa una ventaja competitiva difícil de replicar.',
    }
  }
  if (v && r) {
    return {
      label: 'Ventaja temporal',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Tu recurso es valioso y raro, pero puede ser imitado o sustituido. Trabaja en protegerlo.',
    }
  }
  if (v) {
    return {
      label: 'Paridad competitiva',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Tu recurso es valioso pero no es raro. Muchos competidores pueden tenerlo.',
    }
  }
  return {
    label: 'Desventaja competitiva',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Tu recurso no cumple los criterios VRIN. Considera invertir en recursos más diferenciadores.',
  }
}

export function VRINFramework({
  resources,
  principalResource,
  analysis,
  onResourcesChange,
  onPrincipalResourceChange,
  onAnalysisChange,
}: VRINFrameworkProps) {
  const [currentStep, setCurrentStep] = useState(1)

  // --- Step 1: Resource classification ---
  const handleAddResource = () => {
    const newResource: VRINResource = {
      id: crypto.randomUUID(),
      resource: '',
      type: 'tangible',
    }
    onResourcesChange([...resources, newResource])
  }

  const handleDeleteResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id)
    onResourcesChange(updated)
    // Clear principal resource if it was the deleted one
    const deleted = resources.find((r) => r.id === id)
    if (deleted && principalResource === deleted.resource) {
      onPrincipalResourceChange('')
      onAnalysisChange(null)
    }
  }

  const handleResourceNameChange = (id: string, value: string) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, resource: value } : r
    )
    onResourcesChange(updated)
  }

  const handleResourceTypeChange = (id: string, type: VRINResource['type']) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, type } : r
    )
    onResourcesChange(updated)
  }

  // --- Step 2: Principal resource selection ---
  const handlePrincipalSelect = (value: string) => {
    onPrincipalResourceChange(value)
    // Reset analysis when principal resource changes
    if (value && value !== analysis?.resource) {
      onAnalysisChange({
        resource: value,
        valuable: null,
        valuableJustification: '',
        rare: null,
        rareJustification: '',
        inimitable: null,
        inimitableJustification: '',
        nonSubstitutable: null,
        nonSubstitutableJustification: '',
      })
    }
  }

  // --- Step 3: VRIN Analysis ---
  const handleAnalysisFieldChange = (
    field: 'valuable' | 'rare' | 'inimitable' | 'nonSubstitutable',
    value: boolean
  ) => {
    if (!analysis) return
    onAnalysisChange({ ...analysis, [field]: value })
  }

  const handleJustificationChange = (
    field: 'valuableJustification' | 'rareJustification' | 'inimitableJustification' | 'nonSubstitutableJustification',
    value: string
  ) => {
    if (!analysis) return
    onAnalysisChange({ ...analysis, [field]: value })
  }

  const namedResources = resources.filter((r) => r.resource.trim() !== '')
  const groupedResources = {
    tangible: resources.filter((r) => r.type === 'tangible'),
    intangible: resources.filter((r) => r.type === 'intangible'),
    organizacional: resources.filter((r) => r.type === 'organizacional'),
  }

  const canGoToStep2 = namedResources.length > 0
  const canGoToStep3 = principalResource.trim() !== ''

  const analysisHasAllAnswers =
    analysis !== null &&
    analysis.valuable !== null &&
    analysis.rare !== null &&
    analysis.inimitable !== null &&
    analysis.nonSubstitutable !== null

  const CRITERIA = [
    {
      field: 'valuable' as const,
      justificationField: 'valuableJustification' as const,
      label: 'Valioso',
      letter: 'V',
      question: '¿Este recurso permite aprovechar oportunidades o neutralizar amenazas?',
    },
    {
      field: 'rare' as const,
      justificationField: 'rareJustification' as const,
      label: 'Raro',
      letter: 'R',
      question: '¿Pocos competidores lo poseen?',
    },
    {
      field: 'inimitable' as const,
      justificationField: 'inimitableJustification' as const,
      label: 'Inimitable',
      letter: 'I',
      question: '¿Es costoso o difícil de imitar?',
    },
    {
      field: 'nonSubstitutable' as const,
      justificationField: 'nonSubstitutableJustification' as const,
      label: 'No sustituible',
      letter: 'N',
      question: '¿No hay equivalentes estratégicos?',
    },
  ]

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (step === 1) setCurrentStep(1)
                if (step === 2 && canGoToStep2) setCurrentStep(2)
                if (step === 3 && canGoToStep3) setCurrentStep(3)
              }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer
                ${currentStep === step
                  ? 'bg-accent text-white'
                  : currentStep > step
                    ? 'bg-accent/20 text-accent'
                    : 'bg-neutral-lighter text-neutral'
                }
              `}
            >
              {step}
            </button>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 ${
                  currentStep > step ? 'bg-accent' : 'bg-neutral-lighter'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Classification table */}
      {currentStep === 1 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-heading font-semibold text-foreground">
              Paso 1: Clasificacion de recursos
            </h4>
            <InfoTooltip text="Identifica los recursos y capacidades clave de tu empresa. Clasifícalos como tangibles (físicos, financieros), intangibles (marca, conocimiento, reputación) u organizacionales (cultura, procesos, estructura)." />
          </div>

          {/* Add resource form */}
          <div className="mb-4">
            <Button variant="outline" size="sm" onClick={handleAddResource}>
              <Plus size={16} />
              Agregar recurso
            </Button>
          </div>

          {/* Resources input list */}
          {resources.length > 0 && (
            <div className="space-y-2 mb-6">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center gap-3 p-3 bg-neutral-lighter/30 rounded-lg"
                >
                  <input
                    type="text"
                    value={res.resource}
                    onChange={(e) => handleResourceNameChange(res.id, e.target.value)}
                    placeholder="Nombre del recurso..."
                    className="flex-1 px-3 py-2 border border-neutral-light rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <select
                    value={res.type}
                    onChange={(e) =>
                      handleResourceTypeChange(res.id, e.target.value as VRINResource['type'])
                    }
                    className="px-3 py-2 border border-neutral-light rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white cursor-pointer"
                  >
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-2 text-neutral hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Eliminar recurso"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {resources.length === 0 && (
            <p className="text-sm text-neutral text-center py-6 font-body">
              No hay recursos registrados. Agrega uno para comenzar.
            </p>
          )}

          {/* Grouped summary table */}
          {namedResources.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
                Resumen por tipo
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RESOURCE_TYPES.map(({ value, label }) => (
                  <div key={value} className="border border-neutral-lighter rounded-lg p-4">
                    <h6 className="text-sm font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${RESOURCE_TYPE_COLORS[value]}`}
                      >
                        {label}
                      </span>
                      <span className="text-neutral text-xs">
                        ({groupedResources[value].filter((r) => r.resource.trim()).length})
                      </span>
                    </h6>
                    {groupedResources[value].filter((r) => r.resource.trim()).length > 0 ? (
                      <ul className="space-y-1">
                        {groupedResources[value]
                          .filter((r) => r.resource.trim())
                          .map((r) => (
                            <li
                              key={r.id}
                              className="text-sm font-body text-foreground pl-2 border-l-2 border-neutral-lighter"
                            >
                              {r.resource}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-neutral font-body italic">Sin recursos</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next button */}
          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(2)}
              disabled={!canGoToStep2}
            >
              Siguiente
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select principal resource */}
      {currentStep === 2 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-heading font-semibold text-foreground">
              Paso 2: Recurso diferenciador principal
            </h4>
            <InfoTooltip text="Selecciona el recurso o capacidad que consideras más importante para diferenciarte de tus competidores." />
          </div>

          <p className="text-sm text-neutral font-body mb-4">
            ¿Cual es el principal recurso diferenciador de tu empresa?
          </p>

          <select
            value={principalResource}
            onChange={(e) => handlePrincipalSelect(e.target.value)}
            className="w-full max-w-lg px-4 py-3 border border-neutral-light rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white cursor-pointer"
          >
            <option value="">Selecciona un recurso...</option>
            {namedResources.map((r) => (
              <option key={r.id} value={r.resource}>
                {r.resource} ({RESOURCE_TYPES.find((t) => t.value === r.type)?.label})
              </option>
            ))}
          </select>

          {principalResource && (
            <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm font-body text-foreground">
                <span className="font-semibold">Recurso seleccionado:</span>{' '}
                {principalResource}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              <ChevronLeft size={16} />
              Anterior
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(3)}
              disabled={!canGoToStep3}
            >
              Siguiente
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: VRIN Analysis */}
      {currentStep === 3 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-heading font-semibold text-foreground">
              Paso 3: Analisis VRIN
            </h4>
            <InfoTooltip text="Evalúa tu recurso diferenciador principal según los cuatro criterios VRIN para determinar si representa una ventaja competitiva sostenible." />
          </div>

          <p className="text-sm text-neutral font-body mb-1">
            Analizando el recurso:
          </p>
          <p className="text-base font-heading font-semibold text-accent mb-6">
            {principalResource}
          </p>

          {analysis && (
            <div className="space-y-6">
              {CRITERIA.map(({ field, justificationField, label, letter, question }) => (
                <div
                  key={field}
                  className="border border-neutral-lighter rounded-lg p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent/10 text-accent font-heading font-bold text-sm shrink-0">
                      {letter}
                    </span>
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-foreground text-sm">
                        {label}
                      </p>
                      <p className="text-sm text-neutral font-body mt-0.5">
                        {question}
                      </p>
                    </div>
                  </div>

                  {/* Si/No radio buttons */}
                  <div className="flex gap-4 mb-3 ml-11">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field}
                        checked={analysis[field] === true}
                        onChange={() => handleAnalysisFieldChange(field, true)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      <span className="text-sm font-body text-foreground">Si</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field}
                        checked={analysis[field] === false}
                        onChange={() => handleAnalysisFieldChange(field, false)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      <span className="text-sm font-body text-foreground">No</span>
                    </label>
                  </div>

                  {/* Justification */}
                  <div className="ml-11">
                    <textarea
                      value={analysis[justificationField]}
                      onChange={(e) =>
                        handleJustificationChange(justificationField, e.target.value)
                      }
                      placeholder="Justifica tu respuesta..."
                      className="w-full min-h-[80px] p-3 border border-neutral-light rounded-lg text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                  </div>
                </div>
              ))}

              {/* Result display */}
              {analysisHasAllAnswers && (
                <div className="mt-6">
                  {(() => {
                    const result = getVRINResult(analysis)
                    return (
                      <div
                        className={`flex items-start gap-4 p-5 rounded-lg border ${result.color}`}
                      >
                        <Award size={24} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-heading font-bold text-base mb-1">
                            {result.label}
                          </p>
                          <p className="text-sm font-body leading-relaxed">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              <ChevronLeft size={16} />
              Anterior
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
