import { useNavigate } from 'react-router-dom'
import { LogOut, User, Crown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useFreemium } from '@/hooks/useFreemium'

export function Navigation() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isPro } = useFreemium()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-neutral-lighter px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-4">
        {isPro && (
          <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
            <Crown size={12} />
            Pro
          </span>
        )}
        <div className="flex items-center gap-2 text-sm">
          <User size={16} className="text-neutral" />
          <span>{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-neutral hover:text-error transition-colors cursor-pointer"
          aria-label="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
