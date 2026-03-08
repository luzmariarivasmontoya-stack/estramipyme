import { createContext, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { User, PlanType } from '@/types/user'
import { STORAGE_KEYS } from '@/utils/constants'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  togglePlan: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface StoredUser extends User {
  password: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useLocalStorage<AuthState>(STORAGE_KEYS.AUTH, {
    user: null,
    isAuthenticated: false,
  })
  const [users, setUsers] = useLocalStorage<StoredUser[]>('estramipyme_users', [])

  const login = useCallback(
    (email: string, password: string): boolean => {
      const found = users.find((u) => u.email === email && u.password === password)
      if (found) {
        const { password: _, ...user } = found
        void _
        setAuthState({ user, isAuthenticated: true })
        return true
      }
      return false
    },
    [users, setAuthState]
  )

  const register = useCallback(
    (name: string, email: string, password: string): boolean => {
      if (users.some((u) => u.email === email)) return false
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        plan: 'free' as PlanType,
        createdAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
      const { password: _, ...user } = newUser
      void _
      setAuthState({ user, isAuthenticated: true })
      return true
    },
    [users, setUsers, setAuthState]
  )

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false })
  }, [setAuthState])

  const togglePlan = useCallback(() => {
    if (!authState.user) return
    const newPlan: PlanType = authState.user.plan === 'free' ? 'pro' : 'free'
    const updatedUser = { ...authState.user, plan: newPlan }
    setAuthState({ user: updatedUser, isAuthenticated: true })
    setUsers(users.map((u) => (u.id === updatedUser.id ? { ...u, plan: newPlan } : u)))
  }, [authState.user, setAuthState, users, setUsers])

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, togglePlan }}>
      {children}
    </AuthContext.Provider>
  )
}
