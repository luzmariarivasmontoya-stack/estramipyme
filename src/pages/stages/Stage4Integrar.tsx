import { Link } from 'react-router-dom'
import { AlertCircle, Puzzle } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { GoldenCircle } from '@/components/canvas/GoldenCircle'
import { VRINFramework } from '@/components/stage4/VRINFramework'
import { RadarChart } from '@/components/charts/RadarChart'
import { StrategicChallenge } from '@/components/stage4/StrategicChallenge'
import type {
  GoldenCircle as GoldenCircleData,
  VRINResource,
  VRINAnalysis,
  RadarData,
  ConclusionEntry,
  Stage4Data,
} from '@/types/stages'

export default function Stage4Integrar() {
  const { currentCompany, updateStage } = useCompany()

  if (!currentCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={48} className="text-neutral mb-4" />
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          No hay empresa seleccionada
        </h2>
        <p className="text-neutral font-body mb-6 max-w-md">
          Para comenzar a integrar, primero selecciona o crea una empresa desde el panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Puzzle size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  const stageData: Stage4Data = currentCompany.stages.stage4

  const handleGoldenCircleChange = (data: GoldenCircleData) => {
    updateStage('stage4', { ...stageData, goldenCircle: data })
  }

  const handleVRINResourcesChange = (resources: VRINResource[]) => {
    updateStage('stage4', { ...stageData, vrinResources: resources })
  }

  const handleVRINPrincipalResourceChange = (value: string) => {
    updateStage('stage4', { ...stageData, vrinPrincipalResource: value })
  }

  const handleVRINAnalysisChange = (analysis: VRINAnalysis | null) => {
    updateStage('stage4', { ...stageData, vrinAnalysis: analysis })
  }

  const handleRadarChange = (data: RadarData[]) => {
    updateStage('stage4', { ...stageData, radar: data })
  }

  const handleChallengeChange = (value: string) => {
    updateStage('stage4', { ...stageData, strategicChallenge: value })
  }

  const handleConclusionsChange = (conclusions: ConclusionEntry[]) => {
    updateStage('stage4', { ...stageData, conclusions: conclusions })
  }

  return (
    <WizardContainer
      stageNumber={4}
      title="Integrar"
      description="Integra tu propósito, capacidades y diagnóstico organizacional para definir tu reto estratégico."
    >
      <FreemiumGate feature="las herramientas de integración estratégica">
        <div className="space-y-10">
          {/* Section 1: Círculo Dorado */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Círculo Dorado
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Define el propósito fundamental de tu empresa usando el modelo de Simon Sinek.
            </p>
            <Card>
              <GoldenCircle
                data={stageData.goldenCircle}
                onChange={handleGoldenCircleChange}
              />
            </Card>
          </section>

          {/* Section 2: Marco VRIN */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Marco VRIN
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Evalúa tus recursos y capacidades para identificar ventajas competitivas sostenibles.
            </p>
            <Card>
              <VRINFramework
                resources={stageData.vrinResources}
                principalResource={stageData.vrinPrincipalResource}
                analysis={stageData.vrinAnalysis}
                onResourcesChange={handleVRINResourcesChange}
                onPrincipalResourceChange={handleVRINPrincipalResourceChange}
                onAnalysisChange={handleVRINAnalysisChange}
              />
            </Card>
          </section>

          {/* Section 3: Radar Organizacional */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Radar Organizacional
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Diagnostica las capacidades de tu organización en cinco dimensiones clave.
            </p>
            <Card>
              <RadarChart
                data={stageData.radar}
                onChange={handleRadarChange}
              />
            </Card>
          </section>

          {/* Section 4: Reto Estratégico */}
          <section>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Reto Estratégico
            </h3>
            <p className="text-sm text-neutral font-body mb-5">
              Sintetiza los hallazgos anteriores en un reto estratégico claro y accionable.
            </p>
            <StrategicChallenge
              value={stageData.strategicChallenge}
              conclusions={stageData.conclusions}
              onChange={handleChallengeChange}
              onConclusionsChange={handleConclusionsChange}
            />
          </section>
        </div>
      </FreemiumGate>
    </WizardContainer>
  )
}
