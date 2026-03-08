import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Compass, Users, BarChart3, Puzzle, Lightbulb, Flag,
  LayoutDashboard, ClipboardList, FileText, ChevronLeft, ChevronRight, Lock, Sparkles, BookOpen, Check,
} from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '@/context/AppContext'
import { useFreemium } from '@/hooks/useFreemium'
import { useCompany } from '@/hooks/useCompany'
import { STAGES } from '@/utils/constants'

const iconMap: Record<string, React.ElementType> = {
  Compass, Users, BarChart3, Puzzle, Lightbulb, Flag,
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const appContext = useContext(AppContext)
  const { isPro, isStageAccessible, unlockedPercentage } = useFreemium()
  const { currentCompany } = useCompany()

  if (!appContext) return null
  const { sidebarOpen, setSidebarOpen, setUpgradeModalOpen } = appContext

  // Determine current stage from path
  const stageMatch = location.pathname.match(/\/app\/etapa\/(\d+)/)
  const currentStageNum = stageMatch ? parseInt(stageMatch[1]) : 0

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
    ...STAGES.map((s) => ({
      path: `/app/etapa/${s.number}`,
      label: `${s.number}. ${s.name}`,
      icon: iconMap[s.icon],
      locked: !isStageAccessible(s.number),
      stageNumber: s.number,
    })),
    { path: '/app/casos', label: 'Casos', icon: BookOpen, locked: !isPro },
    { path: '/app/preguntas', label: 'Cuestionario', icon: ClipboardList },
    { path: '/app/reporte', label: 'Reporte', icon: FileText },
  ]

  // Get stage state: 'completed' | 'active' | 'pending' | 'locked'
  const getStageState = (stageNumber: number | undefined) => {
    if (!stageNumber) return 'pending'
    if (!isStageAccessible(stageNumber)) return 'locked'
    if (stageNumber === currentStageNum) return 'active'
    if (stageNumber < currentStageNum) return 'completed'
    return 'pending'
  }

  return (
    <motion.aside
      className="bg-white border-r border-neutral-lighter h-screen sticky top-0 flex flex-col z-20"
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-neutral-lighter flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="font-heading text-lg text-accent font-bold truncate">Estramipyme</h1>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-neutral hover:text-foreground transition-colors cursor-pointer p-1"
          aria-label={sidebarOpen ? 'Colapsar menu' : 'Expandir menu'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {sidebarOpen && currentCompany && (
        <div className="px-4 py-3 border-b border-neutral-lighter">
          <p className="text-xs text-neutral font-body">Empresa actual</p>
          <p className="text-sm font-medium truncate">{currentCompany.name}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          const locked = 'locked' in item && item.locked
          const stageNumber = 'stageNumber' in item ? (item as { stageNumber: number }).stageNumber : undefined
          const stageState = getStageState(stageNumber)

          return (
            <button
              key={item.path}
              onClick={() => {
                if (locked) {
                  setUpgradeModalOpen(true)
                } else {
                  navigate(item.path)
                }
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer
                ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-foreground hover:bg-neutral-lighter'}
                ${locked ? 'opacity-60' : ''}
              `}
              title={sidebarOpen ? undefined : item.label}
            >
              {/* Stage state indicator */}
              {stageNumber && sidebarOpen ? (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    stageState === 'active'
                      ? 'bg-accent text-white ring-2 ring-accent/20'
                      : stageState === 'completed'
                        ? 'bg-success text-white'
                        : stageState === 'locked'
                          ? 'bg-neutral-lighter text-neutral'
                          : 'border-2 border-neutral-light text-neutral'
                  }`}
                >
                  {stageState === 'completed' ? (
                    <Check size={12} />
                  ) : stageState === 'locked' ? (
                    <Lock size={10} />
                  ) : stageState === 'active' ? (
                    <span className="text-[10px]">→</span>
                  ) : (
                    <span className="text-[10px]">○</span>
                  )}
                </span>
              ) : (
                <Icon size={18} className="shrink-0" />
              )}
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {sidebarOpen && locked && !stageNumber && <Lock size={14} className="ml-auto text-neutral shrink-0" />}
            </button>
          )
        })}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-neutral-lighter">
          <div className="mb-2">
            <div className="flex justify-between text-xs text-neutral mb-1">
              <span>Potencial desbloqueado</span>
              <span>{unlockedPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-lighter rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-500"
                style={{ width: `${unlockedPercentage}%` }}
              />
            </div>
          </div>
          {!isPro && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-accent hover:text-accent-dark transition-colors cursor-pointer"
            >
              <Sparkles size={12} />
              Actualizar a Pro
            </button>
          )}
        </div>
      )}
    </motion.aside>
  )
}
