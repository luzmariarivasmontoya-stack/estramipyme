import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Crown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useFreemium } from '@/hooks/useFreemium'
import { useCompany } from '@/hooks/useCompany'
import { AutosaveIndicator } from './AutosaveIndicator'
import { STAGES } from '@/utils/constants'

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isPro } = useFreemium()
  const { currentCompany } = useCompany()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Build breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname
    const parts: { label: string; path?: string }[] = [
      { label: 'Estramipyme', path: '/app' },
    ]

    if (currentCompany) {
      parts.push({ label: currentCompany.name })
    }

    // Match stage routes
    const stageMatch = path.match(/\/app\/etapa\/(\d+)/)
    if (stageMatch) {
      const stageNum = parseInt(stageMatch[1])
      const stage = STAGES.find((s) => s.number === stageNum)
      if (stage) {
        parts.push({ label: `Etapa ${stageNum}: ${stage.name}` })
      }
    } else if (path === '/app/preguntas') {
      parts.push({ label: 'Cuestionario' })
    } else if (path === '/app/reporte') {
      parts.push({ label: 'Reporte' })
    } else if (path === '/app/casos') {
      parts.push({ label: 'Casos de Éxito' })
    } else if (path.startsWith('/app/caso/')) {
      parts.push({ label: 'Caso de Estudio' })
    }

    return parts
  }

  const breadcrumb = getBreadcrumb()

  return (
    <header className="bg-white border-b border-neutral-lighter px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm font-body min-w-0 overflow-hidden" aria-label="Breadcrumb">
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight size={14} className="text-neutral shrink-0" />}
            {item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className="text-neutral hover:text-accent transition-colors cursor-pointer truncate"
              >
                {item.label}
              </button>
            ) : (
              <span className={`truncate ${i === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'text-neutral'}`}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        <AutosaveIndicator />
        {isPro && (
          <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
            <Crown size={12} />
            Pro
          </span>
        )}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <User size={16} className="text-neutral" />
          <span className="truncate max-w-[120px]">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-neutral hover:text-error transition-colors cursor-pointer p-2"
          aria-label="Cerrar sesion"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
