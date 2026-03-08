export const STAGES = [
  { number: 1, name: 'Explorar', description: 'Explora tu entorno y define tu negocio', icon: 'Compass', free: true },
  { number: 2, name: 'Conocer', description: 'Conoce a tus actores y sus perspectivas', icon: 'Users', free: true },
  { number: 3, name: 'Analizar', description: 'Analiza las fuerzas del mercado', icon: 'BarChart3', free: true },
  { number: 4, name: 'Integrar', description: 'Integra tu propósito y capacidades', icon: 'Puzzle', free: false },
  { number: 5, name: 'Facilitar', description: 'Facilita la propuesta de valor y modelo', icon: 'Lightbulb', free: false },
  { number: 6, name: 'Consolidar', description: 'Consolida tu hoja de ruta estratégica', icon: 'Flag', free: false },
] as const

export const STICKY_NOTE_COLORS = [
  '#FEF3C7', // yellow
  '#DBEAFE', // blue
  '#D1FAE5', // green
  '#FCE7F3', // pink
  '#E0E7FF', // indigo
  '#FED7AA', // orange
] as const

export const STORAGE_KEYS = {
  AUTH: 'estramipyme_auth',
  COMPANIES: 'estramipyme_companies',
  CURRENT_COMPANY: 'estramipyme_current_company',
  APP_STATE: 'estramipyme_app_state',
} as const

export const FREE_QUESTION_LIMIT = 10
export const MAX_FREE_COMPANIES = 1

export const RADAR_CATEGORIES = [
  'Conocimiento del cliente',
  'Conocimiento del negocio',
  'Coherencia del modelo',
  'Alineación interna',
  'Salud financiera',
] as const
