import type { Company } from '@/types/company'

export type CompanyAction =
  | { type: 'SET_COMPANIES'; payload: Company[] }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'UPDATE_STAGE'; payload: { companyId: string; stage: string; data: unknown } }

export function companyReducer(state: Company[], action: CompanyAction): Company[] {
  switch (action.type) {
    case 'SET_COMPANIES':
      return action.payload
    case 'ADD_COMPANY':
      return [...state, action.payload]
    case 'UPDATE_COMPANY':
      return state.map((c) => (c.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : c))
    case 'DELETE_COMPANY':
      return state.filter((c) => c.id !== action.payload)
    case 'UPDATE_STAGE': {
      return state.map((c) => {
        if (c.id !== action.payload.companyId) return c
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          stages: {
            ...c.stages,
            [action.payload.stage]: action.payload.data,
          },
        }
      })
    }
    default:
      return state
  }
}

export function createEmptyCompany(ownerId: string, data: Partial<Company>): Company {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: data.name || '',
    sector: data.sector || '',
    size: data.size || 'micro',
    city: data.city || '',
    description: data.description || '',
    fundadoEn: data.fundadoEn || '',
    empleados: data.empleados || '1',
    tipoRelacion: data.tipoRelacion || 'B2C',
    motivacion: data.motivacion || '',
    createdAt: now,
    updatedAt: now,
    ownerId,
    currentStage: 1,
    stages: {
      stage1: {
        businessProfile: { porQueSeFundo: '', cuandoYDonde: '', empleados: '', productosServicios: '', rangoIngresos: '', contabilidadFormal: null },
        trends: [],
        investigatorNotes: {},
      },
      stage2: { conversations: [], testimonials: [] },
      stage3: {
        megatrends: [],
        industry: { rivalry: 0, newEntrants: 0, substitutes: 0, buyerPower: 0, supplierPower: 0, competitorsDetail: '', newEntrantsDetail: '', substitutesDetail: '', notes: '' },
        strategicClock: { segment: 0, angle: 0, justification: '' },
        principalRiesgo: '',
        principalOportunidad: '',
      },
      stage4: {
        goldenCircle: { why: '', how: '', what: '' },
        vrinResources: [],
        vrinPrincipalResource: '',
        vrinAnalysis: null,
        radar: [],
        strategicChallenge: '',
        conclusions: [],
      },
      stage5: {
        valuePropCanvas: [],
        adLib: { productosServicios: '', segmento: '', tarea: '', frustracion: '', alegria: '', competidor: '' },
        businessModelCanvas: [],
        coherenceNotes: '',
        coherenceScore: null,
        workshop: { agenda: [], participants: [], roles: {}, checklist: {}, agreements: '', strategicAgreement: '', date: '' },
      },
      stage6: { roadmap: [], finalNotes: '' },
    },
    questionnaire: { answers: {} },
  }
}
