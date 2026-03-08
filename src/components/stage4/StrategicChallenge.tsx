import { useState } from 'react'
import { CheckCircle2, Circle, TableProperties } from 'lucide-react'
import { Card } from '@/components/common/Card'
import type { ConclusionEntry } from '@/types/stages'

interface StrategicChallengeProps {
  value: string
  conclusions: ConclusionEntry[]
  onChange: (value: string) => void
  onConclusionsChange: (conclusions: ConclusionEntry[]) => void
}

const MAX_CHARS = 1000

const CONCLUSION_SOURCES: {
  id: ConclusionEntry['source']
  label: string
}[] = [
  { id: 'tendencias', label: 'Tendencias' },
  { id: 'industria', label: 'Industria' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'radar', label: 'Radar' },
  { id: 'otros', label: 'Otros' },
]

const VALIDATION_CRITERIA = [
  {
    id: 'especifico',
    label: '¿Es especifico?',
    description: 'Describe exactamente qué quieres lograr',
  },
  {
    id: 'medible',
    label: '¿Es medible?',
    description: 'Puedes saber cuándo lo lograste',
  },
  {
    id: 'alcanzable',
    label: '¿Es alcanzable?',
    description: 'Es retador pero realista',
  },
  {
    id: 'plazo',
    label: '¿Tiene plazo?',
    description: 'Define un horizonte temporal',
  },
]

function ensureAllSources(conclusions: ConclusionEntry[]): ConclusionEntry[] {
  const existing = [...conclusions]
  for (const source of CONCLUSION_SOURCES) {
    if (!existing.find((c) => c.source === source.id)) {
      existing.push({
        id: crypto.randomUUID(),
        source: source.id,
        riesgo: '',
        oportunidad: '',
      })
    }
  }
  return existing
}

export function StrategicChallenge({
  value,
  conclusions,
  onChange,
  onConclusionsChange,
}: StrategicChallengeProps) {
  const charCount = value.length

  const [validationChecks, setValidationChecks] = useState<Record<string, boolean>>({
    especifico: false,
    medible: false,
    alcanzable: false,
    plazo: false,
  })

  const allConclusions = ensureAllSources(conclusions)

  const handleConclusionChange = (
    source: ConclusionEntry['source'],
    field: 'riesgo' | 'oportunidad',
    newValue: string
  ) => {
    const updated = allConclusions.map((c) =>
      c.source === source ? { ...c, [field]: newValue } : c
    )
    onConclusionsChange(updated)
  }

  const handleValidationToggle = (criterionId: string) => {
    setValidationChecks((prev) => ({
      ...prev,
      [criterionId]: !prev[criterionId],
    }))
  }

  const passedCount = Object.values(validationChecks).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Conclusions table */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TableProperties size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground">
            Tabla de conclusiones
          </h4>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Resume los principales riesgos y oportunidades identificados en cada area de analisis.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-neutral-light">
                <th className="text-left py-3 px-3 text-foreground font-semibold w-32">
                  Fuente
                </th>
                <th className="text-left py-3 px-3 text-foreground font-semibold">
                  Riesgo
                </th>
                <th className="text-left py-3 px-3 text-foreground font-semibold">
                  Oportunidad
                </th>
              </tr>
            </thead>
            <tbody>
              {CONCLUSION_SOURCES.map(({ id, label }) => {
                const entry = allConclusions.find((c) => c.source === id)
                return (
                  <tr
                    key={id}
                    className="border-b border-neutral-lighter hover:bg-neutral-lighter/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className="font-medium text-foreground">{label}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-sm font-semibold text-[#4A4A4A] font-body md:hidden">
                          Riesgo
                        </label>
                        <input
                          type="text"
                          value={entry?.riesgo ?? ''}
                          onChange={(e) => handleConclusionChange(id, 'riesgo', e.target.value)}
                          placeholder="Describe el riesgo..."
                          aria-label={`Riesgo de ${label}`}
                          className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-sm font-semibold text-[#4A4A4A] font-body md:hidden">
                          Oportunidad
                        </label>
                        <input
                          type="text"
                          value={entry?.oportunidad ?? ''}
                          onChange={(e) =>
                            handleConclusionChange(id, 'oportunidad', e.target.value)
                          }
                          placeholder="Describe la oportunidad..."
                          aria-label={`Oportunidad de ${label}`}
                          className="w-full px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Strategic challenge text area */}
      <Card>
        <h4 className="font-heading font-semibold text-foreground mb-2">
          Reto Estrategico
        </h4>
        <p className="text-sm text-neutral font-body mb-4">
          Basandote en las conclusiones anteriores, el analisis VRIN y tu proposito (Circulo
          Dorado), define el reto estrategico principal de tu empresa. ¿Cual es el
          desafio mas importante que debes superar para alcanzar tu vision?
        </p>
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Reto estratégico principal
          </label>
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                onChange(e.target.value)
              }
            }}
            placeholder="Describa el reto estratégico principal de su empresa..."
            className="w-full min-h-[180px] px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white resize-y focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none leading-relaxed"
          />
          <div className="flex justify-between">
            <span className="text-xs text-[#6B6B6B] font-body">
              Define el desafío más importante que debe superar tu empresa.
            </span>
            <span
              className={`text-xs font-body ${
                charCount > MAX_CHARS * 0.9 ? 'text-accent' : 'text-neutral'
              }`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Validation checklist */}
        <div className="mt-6 border-t border-neutral-lighter pt-5">
          <h5 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            Validacion del reto
            <span className="text-xs font-normal text-neutral">
              ({passedCount}/{VALIDATION_CRITERIA.length} criterios)
            </span>
          </h5>
          <div className="space-y-3">
            {VALIDATION_CRITERIA.map(({ id, label, description }) => {
              const checked = validationChecks[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleValidationToggle(id)}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer
                    ${
                      checked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-neutral-lighter hover:bg-neutral-lighter/30'
                    }
                  `}
                >
                  {checked ? (
                    <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={20} className="text-neutral shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-body font-medium ${
                        checked ? 'text-green-800' : 'text-foreground'
                      }`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-xs font-body mt-0.5 ${
                        checked ? 'text-green-600' : 'text-neutral'
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {passedCount === VALIDATION_CRITERIA.length && value.trim() && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-body text-green-800 font-medium">
                Tu reto estrategico cumple con los cuatro criterios de validacion.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
