import type { Company } from '@/types/company'
import { mabekaStage1 } from './stage1'
import { mabekaStage2 } from './stage2'
import { mabekaStage3 } from './stage3'
import { mabekaStage4 } from './stage4'
import { mabekaStage5 } from './stage5'
import { mabekaStage6 } from './stage6'

export const mabekaCompany: Company = {
  id: 'mabeka-demo',
  name: 'Mabeka Carpintería',
  sector: 'Muebles y Carpintería',
  size: 'micro',
  city: 'Medellín',
  fundadoEn: '2018',
  empleados: '4-9',
  tipoRelacion: 'B2C',
  motivacion: 'Quiero entender mejor mi mercado y construir una estrategia que me permita crecer sin perder la esencia artesanal de Mabeka.',
  description:
    'Microempresa de carpintería artesanal en Medellín especializada en muebles de madera a medida. Fundada por el maestro carpintero Jorge Betancur, Mabeka combina técnicas tradicionales con maderas sostenibles de origen local para crear piezas únicas para hogares y negocios.',
  createdAt: '2025-08-10T14:00:00.000Z',
  updatedAt: '2025-12-01T10:30:00.000Z',
  ownerId: 'demo',
  isDemo: true,
  currentStage: 6,
  stages: {
    stage1: mabekaStage1,
    stage2: mabekaStage2,
    stage3: mabekaStage3,
    stage4: mabekaStage4,
    stage5: mabekaStage5,
    stage6: mabekaStage6,
  },
  questionnaire: {
    answers: {
      q1: 4,
      q2: 3,
      q3: 5,
      q4: 2,
      q5: 4,
      q6: 3,
      q7: 4,
      q8: 2,
      q9: 3,
      q10: 5,
      q11: 4,
      q12: 3,
      q13: 2,
      q14: 4,
      q15: 3,
    },
    completedAt: '2025-09-05T16:45:00.000Z',
  },
}

export {
  mabekaStage1,
  mabekaStage2,
  mabekaStage3,
  mabekaStage4,
  mabekaStage5,
  mabekaStage6,
}
