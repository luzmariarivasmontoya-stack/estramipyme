export interface QuestionItem {
  id: string
  text: string
  category: string
}

export const QUESTIONNAIRE_CATEGORIES = [
  'Identidad Estratégica',
  'Conocimiento del Entorno',
  'Capacidades Internas',
  'Propuesta de Valor',
  'Modelo de Negocio',
  'Ejecución Estratégica',
] as const

export type QuestionnaireCategory = (typeof QUESTIONNAIRE_CATEGORIES)[number]

export const questions: QuestionItem[] = [
  // ── Identidad Estratégica (5 preguntas) ─────────────────────────
  {
    id: 'ie-1',
    text: 'La misión de mi empresa está claramente definida y es comprendida por todos los miembros del equipo.',
    category: 'Identidad Estratégica',
  },
  {
    id: 'ie-2',
    text: 'La visión de futuro de mi empresa inspira y guía las decisiones estratégicas del día a día.',
    category: 'Identidad Estratégica',
  },
  {
    id: 'ie-3',
    text: 'Los valores fundamentales de mi empresa se reflejan consistentemente en nuestras acciones y cultura organizacional.',
    category: 'Identidad Estratégica',
  },
  {
    id: 'ie-4',
    text: 'El propósito de mi empresa va más allá de generar ganancias y aporta valor a la sociedad.',
    category: 'Identidad Estratégica',
  },
  {
    id: 'ie-5',
    text: 'La identidad de marca de mi empresa es coherente en todos los puntos de contacto con el cliente.',
    category: 'Identidad Estratégica',
  },

  // ── Conocimiento del Entorno (5 preguntas) ──────────────────────
  {
    id: 'ce-1',
    text: 'Conozco con claridad las tendencias del mercado que afectan a mi industria en el corto y mediano plazo.',
    category: 'Conocimiento del Entorno',
  },
  {
    id: 'ce-2',
    text: 'Tengo identificados a mis principales competidores y comprendo sus fortalezas y debilidades.',
    category: 'Conocimiento del Entorno',
  },
  {
    id: 'ce-3',
    text: 'Monitoreo de forma regular los cambios regulatorios, tecnológicos y sociales que pueden impactar mi negocio.',
    category: 'Conocimiento del Entorno',
  },
  {
    id: 'ce-4',
    text: 'Comprendo las necesidades, deseos y frustraciones de mis clientes actuales y potenciales.',
    category: 'Conocimiento del Entorno',
  },
  {
    id: 'ce-5',
    text: 'Tengo información actualizada sobre el tamaño y crecimiento del mercado en el que opero.',
    category: 'Conocimiento del Entorno',
  },

  // ── Capacidades Internas (5 preguntas) ──────────────────────────
  {
    id: 'ci-1',
    text: 'Los recursos humanos de mi empresa tienen las competencias necesarias para ejecutar la estrategia actual.',
    category: 'Capacidades Internas',
  },
  {
    id: 'ci-2',
    text: 'Los procesos internos de mi empresa están documentados y son eficientes para generar valor.',
    category: 'Capacidades Internas',
  },
  {
    id: 'ci-3',
    text: 'La infraestructura tecnológica de mi empresa apoya adecuadamente las operaciones y la innovación.',
    category: 'Capacidades Internas',
  },
  {
    id: 'ci-4',
    text: 'Cuento con indicadores financieros claros que me permiten evaluar la salud del negocio de forma oportuna.',
    category: 'Capacidades Internas',
  },
  {
    id: 'ci-5',
    text: 'Mi empresa fomenta activamente la cultura de aprendizaje y mejora continua entre sus colaboradores.',
    category: 'Capacidades Internas',
  },

  // ── Propuesta de Valor (5 preguntas) ────────────────────────────
  {
    id: 'pv-1',
    text: 'Mi propuesta de valor resuelve un problema real y relevante para mi segmento de clientes objetivo.',
    category: 'Propuesta de Valor',
  },
  {
    id: 'pv-2',
    text: 'Puedo articular claramente qué nos diferencia de la competencia en una oración.',
    category: 'Propuesta de Valor',
  },
  {
    id: 'pv-3',
    text: 'Mis clientes perciben y valoran los beneficios diferenciales de mi producto o servicio.',
    category: 'Propuesta de Valor',
  },
  {
    id: 'pv-4',
    text: 'La experiencia del cliente está diseñada intencionalmente para generar satisfacción y lealtad.',
    category: 'Propuesta de Valor',
  },
  {
    id: 'pv-5',
    text: 'Valido y ajusto regularmente mi propuesta de valor con retroalimentación directa de los clientes.',
    category: 'Propuesta de Valor',
  },

  // ── Modelo de Negocio (5 preguntas) ─────────────────────────────
  {
    id: 'mn-1',
    text: 'Tengo claridad sobre las principales fuentes de ingresos de mi empresa y su sostenibilidad en el tiempo.',
    category: 'Modelo de Negocio',
  },
  {
    id: 'mn-2',
    text: 'Los canales de distribución que utilizo son efectivos para llegar a mis clientes objetivo.',
    category: 'Modelo de Negocio',
  },
  {
    id: 'mn-3',
    text: 'He identificado aliados y socios estratégicos clave que fortalecen mi modelo de negocio.',
    category: 'Modelo de Negocio',
  },
  {
    id: 'mn-4',
    text: 'La estructura de costos de mi empresa es eficiente y está alineada con la generación de valor.',
    category: 'Modelo de Negocio',
  },
  {
    id: 'mn-5',
    text: 'Evalúo periódicamente la viabilidad y escalabilidad de mi modelo de negocio ante cambios del entorno.',
    category: 'Modelo de Negocio',
  },

  // ── Ejecución Estratégica (5 preguntas) ─────────────────────────
  {
    id: 'ee-1',
    text: 'Cuento con una hoja de ruta estratégica con objetivos, responsables y plazos definidos.',
    category: 'Ejecución Estratégica',
  },
  {
    id: 'ee-2',
    text: 'Los indicadores clave de desempeño (KPIs) que utilizo son relevantes y los reviso con frecuencia.',
    category: 'Ejecución Estratégica',
  },
  {
    id: 'ee-3',
    text: 'Todo el equipo comprende y está alineado con los objetivos estratégicos de la empresa.',
    category: 'Ejecución Estratégica',
  },
  {
    id: 'ee-4',
    text: 'Tengo mecanismos de seguimiento que me permiten detectar desviaciones y corregir el rumbo a tiempo.',
    category: 'Ejecución Estratégica',
  },
  {
    id: 'ee-5',
    text: 'Priorizo las iniciativas estratégicas en función de su impacto y los recursos disponibles.',
    category: 'Ejecución Estratégica',
  },
]
