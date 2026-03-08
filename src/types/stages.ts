// Stage 1: Explorar
export interface BusinessProfile {
  porQueSeFundo: string
  cuandoYDonde: string
  empleados: string
  productosServicios: string
  rangoIngresos: string
  contabilidadFormal: boolean | null
}

export interface Trend {
  id: string
  name: string
  source: string
  date: string
  type: 'riesgo' | 'oportunidad'
}

export interface Stage1Data {
  businessProfile: BusinessProfile
  trends: Trend[]
  investigatorNotes: Record<string, string>
}

// Stage 2: Conocer
export interface ConversationEntry {
  id: string
  actor: string
  pregunta1: string
  pregunta2: string
  pregunta3: string
  pregunta4: string
}

export interface StickyNote {
  id: string
  content: string
  color: string
  x: number
  y: number
  category?: string
}

export interface Stage2Data {
  conversations: ConversationEntry[]
  testimonials: StickyNote[]
}

// Stage 3: Analizar
export interface MegatrendEntry {
  id: string
  megatrend: string
  source: string
  date: string
  impact: number
  type: 'riesgo' | 'oportunidad'
}

export interface IndustryAnalysis {
  rivalry: number
  newEntrants: number
  substitutes: number
  buyerPower: number
  supplierPower: number
  competitorsDetail: string
  newEntrantsDetail: string
  substitutesDetail: string
  notes: string
}

export interface StrategicClockPosition {
  segment: number
  angle: number
  justification: string
  targetPosition: number
}

export interface Stage3Data {
  megatrends: MegatrendEntry[]
  industry: IndustryAnalysis
  strategicClock: StrategicClockPosition
  principalRiesgo: string
  principalOportunidad: string
}

// Stage 4: Integrar (Pro)
export interface GoldenCircle {
  why: string
  how: string
  what: string
}

export interface VRINResource {
  id: string
  resource: string
  type: 'tangible' | 'intangible' | 'organizacional'
}

export interface VRINAnalysis {
  resource: string
  valuable: boolean | null
  valuableJustification: string
  rare: boolean | null
  rareJustification: string
  inimitable: boolean | null
  inimitableJustification: string
  nonSubstitutable: boolean | null
  nonSubstitutableJustification: string
}

export interface RadarData {
  category: string
  value: number
}

export interface ConclusionEntry {
  id: string
  source: 'tendencias' | 'industria' | 'recursos' | 'radar' | 'otros'
  riesgo: string
  oportunidad: string
}

export interface Stage4Data {
  goldenCircle: GoldenCircle
  vrinResources: VRINResource[]
  vrinPrincipalResource: string
  vrinAnalysis: VRINAnalysis | null
  radar: RadarData[]
  strategicChallenge: string
  conclusions: ConclusionEntry[]
}

// Stage 5: Facilitar (Pro)
export interface CanvasNote {
  id: string
  content: string
  zone: string
  color: string
  subtype?: string
}

export interface AdLibData {
  productosServicios: string
  segmento: string
  tarea: string
  frustracion: string
  alegria: string
  competidor: string
}

export interface WorkshopData {
  agenda: string[]
  participants: string[]
  roles: Record<string, string>
  checklist: Record<string, boolean>
  agreements: string
  strategicAgreement: string
  date: string
}

export interface Stage5Data {
  valuePropCanvas: CanvasNote[]
  adLib: AdLibData
  businessModelCanvas: CanvasNote[]
  coherenceNotes: string
  coherenceScore: 'verde' | 'amarillo' | 'rojo' | null
  workshop: WorkshopData
}

// Stage 6: Consolidar (Pro)
export interface RoadmapItem {
  id: string
  action: string
  responsible: string
  timeline: 'corto' | 'mediano' | 'largo'
  status: 'pendiente' | 'en_progreso' | 'completado'
  recursosNecesarios: string
  indicadorExito: string
}

export interface Stage6Data {
  roadmap: RoadmapItem[]
  finalNotes: string
}
