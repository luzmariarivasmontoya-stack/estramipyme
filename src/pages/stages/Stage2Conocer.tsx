import { Link } from 'react-router-dom'
import { Users, AlertCircle } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import { Card } from '@/components/common/Card'
import { ConversationRegistry } from '@/components/stage2/ConversationRegistry'
import { TestimonialMural } from '@/components/stage2/TestimonialMural'
import type { ConversationEntry, StickyNote, Stage2Data } from '@/types/stages'

export default function Stage2Conocer() {
  const { currentCompany, updateStage } = useCompany()

  if (!currentCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={48} className="text-neutral mb-4" />
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          No hay empresa seleccionada
        </h2>
        <p className="text-neutral font-body mb-6 max-w-md">
          Para comenzar a conocer a tus actores clave, primero selecciona o crea una empresa
          desde el panel principal.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Users size={18} />
          Ir al panel principal
        </Link>
      </div>
    )
  }

  const stageData: Stage2Data = currentCompany.stages.stage2

  const handleConversationsChange = (updated: ConversationEntry[]) => {
    updateStage('stage2', {
      ...stageData,
      conversations: updated,
    })
  }

  const handleTestimonialsChange = (updated: StickyNote[]) => {
    updateStage('stage2', {
      ...stageData,
      testimonials: updated,
    })
  }

  return (
    <WizardContainer
      stageNumber={2}
      title="Conocer"
      description="Conoce a tus actores clave a traves de conversaciones estructuradas y captura sus testimonios para descubrir patrones y oportunidades."
    >
      <div className="space-y-10">
        {/* Section 1: Registro de Conversaciones */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Registro de Conversaciones
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Identifica a los actores clave de tu negocio y registra las respuestas que obtienes
            al conversar con ellos sobre sus necesidades, valores, preocupaciones y expectativas.
          </p>
          <Card>
            <ConversationRegistry
              conversations={stageData.conversations}
              onChange={handleConversationsChange}
            />
          </Card>
        </section>

        {/* Section 2: Mural de Testimonios */}
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Mural de Testimonios
          </h3>
          <p className="text-sm text-neutral font-body mb-5">
            Recopila las voces de tus actores clave en notas adhesivas. Arrastra y organiza
            los testimonios para visualizar patrones y temas recurrentes.
          </p>
          <TestimonialMural
            testimonials={stageData.testimonials}
            onChange={handleTestimonialsChange}
          />
        </section>
      </div>
    </WizardContainer>
  )
}
