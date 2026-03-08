import { useContext, useMemo, useCallback } from 'react'
import { AppContext } from '@/context/AppContext'

export function useCompany() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useCompany must be used within AppProvider')

  const { companies, dispatchCompany, currentCompanyId, setCurrentCompanyId } = context

  const currentCompany = useMemo(
    () => companies.find((c) => c.id === currentCompanyId) || null,
    [companies, currentCompanyId]
  )

  const updateStage = useCallback(
    (stage: string, data: unknown) => {
      if (!currentCompanyId) return
      dispatchCompany({ type: 'UPDATE_STAGE', payload: { companyId: currentCompanyId, stage, data } })
    },
    [currentCompanyId, dispatchCompany]
  )

  return {
    companies,
    currentCompany,
    currentCompanyId,
    setCurrentCompanyId,
    dispatchCompany,
    updateStage,
  }
}
