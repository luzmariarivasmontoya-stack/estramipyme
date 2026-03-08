import { useContext, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { AppContext } from '@/context/AppContext'
import { useFreemium } from '@/hooks/useFreemium'

interface FreemiumGateProps {
  children: ReactNode
  feature?: string
}

export function FreemiumGate({ children, feature = 'esta funcionalidad' }: FreemiumGateProps) {
  const { isPro } = useFreemium()
  const appContext = useContext(AppContext)

  if (isPro) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[1px] select-none">{children}</div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl cursor-pointer"
        onClick={() => appContext?.setUpgradeModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') appContext?.setUpgradeModalOpen(true) }}
      >
        <div className="flex flex-col items-center gap-2 p-6 bg-white/90 rounded-xl shadow-card">
          <Lock className="text-accent" size={24} />
          <p className="text-sm font-medium text-foreground">Disponible en Plan Pro</p>
          <p className="text-xs text-neutral text-center max-w-48">
            Actualiza tu plan para acceder a {feature}
          </p>
        </div>
      </div>
    </div>
  )
}
