import { Link } from 'react-router-dom'
import { Compass, AlertCircle } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useAutosave } from '@/hooks/useAutosave'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { BusinessProfileForm } from '@/components/stage1/BusinessProfileForm'
import { InvestigatorRoles } from '@/components/stage1/InvestigatorRoles'
import { TrendsExplorer } from '@/components/stage1/TrendsExplorer'
import type { BusinessProfile, Trend, Stage1Data } from '@/types/stages'

export default function Stage1Explorar() {
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
          Para comenzar a explorar, primero selecciona o crea una empresa desde el panel principal.
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

  const stageData: Stage1Data = currentCompany.stages.stage1

  const handleProfileChange = (updated: BusinessProfile) => {
    updateStage('stage1', {
      ...stageData,
      businessProfile: updated,
    })
    triggerSave()
  }

  const handleNotesChange = (notes: Record<string, string>) => {
    updateStage('stage1', {
      ...stageData,
      investigatorNotes: notes,
    })
    triggerSave()
  }

  const handleTrendsChange = (trends: Trend[]) => {
    updateStage('stage1', {
      ...stageData,
      trends,
    })
    triggerSave()
  }

  return (
    <WizardContainer
      stageNumber={1}
      title="Explorar"
      description="Explora el entorno de tu negocio, define tu perfil estratégico y descubre las tendencias que pueden transformar tu mercado."
    >
      <div className="space-y-10">
        {/* Section 1: Perfil del Negocio */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Perfil del Negocio
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Define los elementos fundamentales que dan identidad a tu empresa.
          </p>
          <Card>
            <BusinessProfileForm
              data={stageData.businessProfile}
              onChange={handleProfileChange}
            />
          </Card>
        </section>

        {/* Section 2: Roles del Investigador */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Roles del Investigador
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Adopta diferentes perspectivas para explorar tu negocio desde ángulos diversos.
          </p>
          <InvestigatorRoles
            notes={stageData.investigatorNotes}
            onNotesChange={handleNotesChange}
          />
        </section>

        {/* Section 3: Explorador de Tendencias */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Explorador de Tendencias
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Identifica y registra las tendencias del mercado que pueden impactar tu negocio.
          </p>
          <Card>
            <TrendsExplorer
              trends={stageData.trends}
              onTrendsChange={handleTrendsChange}
            />
          </Card>
        </section>
      </div>
    </WizardContainer>
  )
}
