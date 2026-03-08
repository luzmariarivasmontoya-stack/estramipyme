import { Link } from 'react-router-dom'
import { AlertCircle, Lightbulb } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useAutosave } from '@/hooks/useAutosave'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { ValuePropCanvas } from '@/components/canvas/ValuePropCanvas'
import { AdLibTemplate } from '@/components/stage5/AdLibTemplate'
import { BusinessModelCanvas } from '@/components/canvas/BusinessModelCanvas'
import { CoherenceChecker } from '@/components/stage5/CoherenceChecker'
import { WorkshopManager } from '@/components/stage5/WorkshopManager'
import type { CanvasNote, AdLibData, WorkshopData, Stage5Data } from '@/types/stages'

export default function Stage5Facilitar() {
  const { currentCompany, updateStage } = useCompany()
  const { triggerSave } = useAutosave()

  if (!currentCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={48} className="text-neutral mb-4" />
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          No hay empresa seleccionada
        </h2>
        <p className="text-neutral font-body mb-6 max-w-md">
          Para comenzar a facilitar, primero selecciona o crea una empresa desde el panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Lightbulb size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  const stageData: Stage5Data = currentCompany.stages.stage5

  const handleValuePropChange = (notes: CanvasNote[]) => {
    updateStage('stage5', { ...stageData, valuePropCanvas: notes })
    triggerSave()
  }

  const handleAdLibChange = (data: AdLibData) => {
    updateStage('stage5', { ...stageData, adLib: data })
    triggerSave()
  }

  const handleBMCChange = (notes: CanvasNote[]) => {
    updateStage('stage5', { ...stageData, businessModelCanvas: notes })
    triggerSave()
  }

  const handleCoherenceNotesChange = (notes: string) => {
    updateStage('stage5', { ...stageData, coherenceNotes: notes })
    triggerSave()
  }

  const handleCoherenceScoreChange = (score: 'verde' | 'amarillo' | 'rojo' | null) => {
    updateStage('stage5', { ...stageData, coherenceScore: score })
    triggerSave()
  }

  const handleWorkshopChange = (data: WorkshopData) => {
    updateStage('stage5', { ...stageData, workshop: data })
    triggerSave()
  }

  return (
    <WizardContainer
      stageNumber={5}
      title="Facilitar"
      description="Facilita la construcción de tu propuesta de valor, modelo de negocio y alineación estratégica."
    >
      <FreemiumGate feature="las herramientas de facilitación estratégica">
        <div className="space-y-10">
          {/* Section 1: Canvas de Propuesta de Valor */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Canvas de Propuesta de Valor
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Mapea cómo tu propuesta de valor encaja con las necesidades de tu cliente.
            </p>
            <Card>
              <ValuePropCanvas
                notes={stageData.valuePropCanvas}
                onChange={handleValuePropChange}
              />
            </Card>
          </section>

          {/* Section 2: Plantilla Ad-Lib */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Plantilla Ad-Lib
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Articula tu propuesta de valor en una frase clara y diferenciadora.
            </p>
            <AdLibTemplate
              data={stageData.adLib}
              onChange={handleAdLibChange}
            />
          </section>

          {/* Section 3: Canvas de Modelo de Negocio */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Canvas de Modelo de Negocio
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Diseña tu modelo de negocio completo usando el Business Model Canvas.
            </p>
            <Card>
              <BusinessModelCanvas
                notes={stageData.businessModelCanvas}
                onChange={handleBMCChange}
              />
            </Card>
          </section>

          {/* Section 4: Verificador de Coherencia */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Verificador de Coherencia
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Verifica la alineación entre tu propósito, propuesta de valor y modelo de negocio.
            </p>
            <CoherenceChecker
              notes={stageData.coherenceNotes}
              onChange={handleCoherenceNotesChange}
              coherenceScore={stageData.coherenceScore}
              onScoreChange={handleCoherenceScoreChange}
              adLib={stageData.adLib}
            />
          </section>

          {/* Section 5: Gestor de Taller */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Gestor de Taller
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Planifica y documenta tu taller de alineación estratégica.
            </p>
            <WorkshopManager
              data={stageData.workshop}
              onChange={handleWorkshopChange}
            />
          </section>
        </div>
      </FreemiumGate>
    </WizardContainer>
  )
}
