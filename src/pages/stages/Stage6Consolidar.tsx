import { Link } from 'react-router-dom'
import { AlertCircle, Flag, FileText } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useAutosave } from '@/hooks/useAutosave'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { RoadmapTable } from '@/components/stage6/RoadmapTable'
import type { RoadmapItem, Stage6Data } from '@/types/stages'

export default function Stage6Consolidar() {
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
          Para consolidar tu estrategia, primero selecciona o crea una empresa desde el panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Flag size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  const stageData: Stage6Data = currentCompany.stages.stage6

  const handleRoadmapChange = (items: RoadmapItem[]) => {
    updateStage('stage6', { ...stageData, roadmap: items })
    triggerSave()
  }

  const handleNotesChange = (value: string) => {
    updateStage('stage6', { ...stageData, finalNotes: value })
    triggerSave()
  }

  return (
    <WizardContainer
      stageNumber={6}
      title="Consolidar"
      description="Consolida tu hoja de ruta estratégica y prepárate para la ejecución."
    >
      <FreemiumGate feature="las herramientas de consolidación estratégica">
        <div className="space-y-10">
          {/* Section 1: Hoja de Ruta Estratégica */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Hoja de Ruta Estratégica
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Define las acciones estratégicas por plazo, asigna responsables y haz
              seguimiento al progreso. Arrastra las tarjetas entre columnas para reasignar plazos.
            </p>
            <RoadmapTable
              items={stageData.roadmap}
              onChange={handleRoadmapChange}
            />
          </section>

          {/* Section 2: Notas Finales */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Notas Finales
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Registra reflexiones finales, aprendizajes y próximos pasos para tu empresa.
            </p>
            <Card>
              <textarea
                value={stageData.finalNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Registra aquí tus reflexiones finales, aprendizajes clave y próximos pasos..."
                className="w-full min-h-[180px] p-4 border border-neutral-light rounded-lg text-foreground font-body text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent leading-relaxed"
              />
            </Card>
          </section>

          {/* Generate Report Button */}
          <section className="flex justify-center pt-4">
            <Link to="/app/reporte">
              <Button variant="primary" size="lg">
                <FileText size={20} />
                Ver Reporte Final
              </Button>
            </Link>
          </section>
        </div>
      </FreemiumGate>
    </WizardContainer>
  )
}
