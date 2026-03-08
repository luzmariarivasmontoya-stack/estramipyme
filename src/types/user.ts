export type PlanType = 'free' | 'pro'

export interface User {
  id: string
  name: string
  email: string
  plan: PlanType
  createdAt: string
}
