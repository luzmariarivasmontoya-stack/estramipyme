import { useContext } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { AppContext } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'

const freeBenefits = [
  '1 empresa',
  'Etapas 1-3 (Explorar, Conocer, Analizar)',
  '10 preguntas del cuestionario',
  'Canvas en modo lectura',
  'PDF con marca de agua',
]

const proBenefits = [
  'Empresas ilimitadas',
  'Las 6 etapas completas',
  'Cuestionario completo (~30 preguntas)',
  'Canvas editables con notas',
  'PDF limpio sin marca de agua',
  'Radar organizacional',
  'Hoja de ruta estratégica',
]

export function UpgradeModal() {
  const appContext = useContext(AppContext)
  const { togglePlan, user } = useAuth()

  if (!appContext) return null

  const handleUpgrade = () => {
    togglePlan()
    appContext.setUpgradeModalOpen(false)
  }

  return (
    <Modal
      isOpen={appContext.upgradeModalOpen}
      onClose={() => appContext.setUpgradeModalOpen(false)}
      title="Desbloquea todo el potencial"
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="border border-neutral-light rounded-xl p-5">
          <h3 className="font-heading text-lg mb-1">Plan Gratuito</h3>
          <p className="text-neutral text-sm mb-4">Para explorar la metodología</p>
          <ul className="space-y-2">
            {freeBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-neutral mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-accent rounded-xl p-5 relative">
          <div className="absolute -top-3 right-4 bg-accent text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} />
            Recomendado
          </div>
          <h3 className="font-heading text-lg mb-1">Plan Pro</h3>
          <p className="text-neutral text-sm mb-4">Experiencia estratégica completa</p>
          <ul className="space-y-2">
            {proBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-accent mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full mt-6" onClick={handleUpgrade}>
            {user?.plan === 'pro' ? 'Volver a Gratuito' : 'Actualizar a Pro'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
