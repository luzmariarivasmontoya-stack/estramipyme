import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { useCompany } from './useCompany'
import { MAX_FREE_COMPANIES, FREE_QUESTION_LIMIT } from '@/utils/constants'

export function useFreemium() {
  const { user } = useAuth()
  const { companies } = useCompany()

  const isPro = user?.plan === 'pro'

  const canCreateCompany = useMemo(() => {
    if (isPro) return true
    const ownCompanies = companies.filter((c) => c.ownerId === user?.id && !c.isDemo)
    return ownCompanies.length < MAX_FREE_COMPANIES
  }, [isPro, companies, user?.id])

  const isStageAccessible = (stageNumber: number) => {
    if (isPro) return true
    return stageNumber <= 3
  }

  const questionLimit = isPro ? Infinity : FREE_QUESTION_LIMIT

  const unlockedPercentage = useMemo(() => {
    if (isPro) return 100
    return 50 // Stages 1-3 out of 6
  }, [isPro])

  return {
    isPro,
    canCreateCompany,
    isStageAccessible,
    questionLimit,
    unlockedPercentage,
  }
}
