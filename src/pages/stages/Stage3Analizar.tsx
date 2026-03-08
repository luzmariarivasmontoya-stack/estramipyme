import { Link } from 'react-router-dom'
import { AlertCircle, Compass } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useAutosave } from '@/hooks/useAutosave'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { MegatrendsAnalysis } from '@/components/stage3/MegatrendsAnalysis'
import { RiskOpportunitySynthesis } from '@/components/stage3/RiskOpportunitySynthesis'
import { IndustryAnalysis } from '@/components/stage3/IndustryAnalysis'
import { StrategicClock } from '@/components/charts/StrategicClock'
import type {
  MegatrendEntry,
  IndustryAnalysis as IndustryAnalysisType,
  StrategicClockPosition,
  Stage3Data,
} from '@/types/stages'

export default function Stage3Analizar() {
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
          Para comenzar el analisis, primero selecciona o crea una empresa desde el panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Compass size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  const stageData: Stage3Data = currentCompany.stages.stage3

  const handleMegatrendsChange = (megatrends: MegatrendEntry[]) => {
    updateStage('stage3', {
      ...stageData,
      megatrends,
    })
    triggerSave()
  }

  const handleSynthesisChange = (
    field: 'principalRiesgo' | 'principalOportunidad',
    value: string
  ) => {
    updateStage('stage3', {
      ...stageData,
      [field]: value,
    })
    triggerSave()
  }

  const handleIndustryChange = (industry: IndustryAnalysisType) => {
    updateStage('stage3', {
      ...stageData,
      industry,
    })
    triggerSave()
  }

  const handleClockChange = (strategicClock: StrategicClockPosition) => {
    updateStage('stage3', {
      ...stageData,
      strategicClock,
    })
    triggerSave()
  }

  return (
    <WizardContainer
      stageNumber={3}
      title="Analizar"
      description="Analiza las megatendencias, las fuerzas competitivas de tu industria y la posicion estrategica de tu empresa."
    >
      <div className="space-y-10">
        {/* Section 1: Megatrends */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Analisis de Megatendencias
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Identifica las grandes fuerzas globales que pueden generar oportunidades o amenazas para tu negocio.
          </p>
          <Card>
            <MegatrendsAnalysis
              megatrends={stageData.megatrends}
              onChange={handleMegatrendsChange}
            />
          </Card>
        </section>

        {/* Section 1b: Risk / Opportunity Synthesis */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Sintesis de Riesgos y Oportunidades
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Resume el principal riesgo y la principal oportunidad que identificaste en el analisis de megatendencias.
          </p>
          <RiskOpportunitySynthesis
            principalRiesgo={stageData.principalRiesgo}
            principalOportunidad={stageData.principalOportunidad}
            onChange={handleSynthesisChange}
          />
        </section>

        {/* Section 2: Industry (Porter's 5 Forces) */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Analisis de la Industria (5 Fuerzas)
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Evalua las cinco fuerzas competitivas de Porter para entender la dinamica de tu industria.
          </p>
          <Card>
            <IndustryAnalysis
              data={stageData.industry}
              onChange={handleIndustryChange}
            />
          </Card>
        </section>

        {/* Section 3: Strategic Clock */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Reloj Estrategico de Bowman
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Ubica la posicion competitiva de tu empresa segun la relacion entre precio y valor percibido por el cliente.
          </p>
          <Card>
            <StrategicClock
              position={stageData.strategicClock}
              onChange={handleClockChange}
            />
          </Card>
        </section>
      </div>
    </WizardContainer>
  )
}
