import type { Stage1Data } from './stages'
import type { Stage2Data } from './stages'
import type { Stage3Data } from './stages'
import type { Stage4Data } from './stages'
import type { Stage5Data } from './stages'
import type { Stage6Data } from './stages'

export interface Company {
  id: string
  name: string
  sector: string
  size: 'micro' | 'pequena' | 'mediana'
  city: string
  description: string
  fundadoEn: string
  empleados: '1' | '2-3' | '4-9' | '10-49' | '50+'
  tipoRelacion: 'B2B' | 'B2C' | 'B2B2C'
  motivacion: string
  createdAt: string
  updatedAt: string
  ownerId: string
  isDemo?: boolean
  currentStage: number
  stages: {
    stage1: Stage1Data
    stage2: Stage2Data
    stage3: Stage3Data
    stage4: Stage4Data
    stage5: Stage5Data
    stage6: Stage6Data
  }
  questionnaire: QuestionnaireData
}

export interface QuestionnaireData {
  answers: Record<string, number>
  completedAt?: string
}
