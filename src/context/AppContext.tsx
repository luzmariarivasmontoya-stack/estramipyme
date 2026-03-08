import { createContext, useState, useEffect, type ReactNode } from 'react'
import { usePersistedReducer } from '@/hooks/usePersistedReducer'
import { companyReducer, type CompanyAction } from '@/reducers/companyReducer'
import type { Company } from '@/types/company'
import { STORAGE_KEYS } from '@/utils/constants'
import { mabekaCompany } from '@/data/mabeka'

interface AppContextType {
  companies: Company[]
  dispatchCompany: React.Dispatch<CompanyAction>
  currentCompanyId: string | null
  setCurrentCompanyId: (id: string | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  upgradeModalOpen: boolean
  setUpgradeModalOpen: (open: boolean) => void
}

export const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [companies, dispatchCompany] = usePersistedReducer<Company[], CompanyAction>(
    companyReducer,
    [],
    STORAGE_KEYS.COMPANIES
  )
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.CURRENT_COMPANY) || null
  )
  // Inject Mabeka demo company if not already present
  useEffect(() => {
    if (!companies.some((c) => c.id === 'mabeka-demo')) {
      dispatchCompany({ type: 'ADD_COMPANY', payload: mabekaCompany })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const handleSetCurrentCompanyId = (id: string | null) => {
    setCurrentCompanyId(id)
    if (id) localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY, id)
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_COMPANY)
  }

  return (
    <AppContext.Provider
      value={{
        companies,
        dispatchCompany,
        currentCompanyId,
        setCurrentCompanyId: handleSetCurrentCompanyId,
        sidebarOpen,
        setSidebarOpen,
        upgradeModalOpen,
        setUpgradeModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
