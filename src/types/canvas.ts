export interface CanvasZone {
  id: string
  label: string
  description: string
  gridArea: string
}

export const VALUE_PROP_ZONES: CanvasZone[] = [
  { id: 'gains', label: 'Ganancias', description: 'Lo que el cliente quiere ganar', gridArea: 'gains' },
  { id: 'pains', label: 'Dolores', description: 'Lo que le genera dolor al cliente', gridArea: 'pains' },
  { id: 'jobs', label: 'Tareas del Cliente', description: 'Lo que el cliente necesita hacer', gridArea: 'jobs' },
  { id: 'gain-creators', label: 'Creadores de Ganancia', description: 'Cómo generamos ganancia', gridArea: 'gain-creators' },
  { id: 'pain-relievers', label: 'Aliviadores de Dolor', description: 'Cómo aliviamos el dolor', gridArea: 'pain-relievers' },
  { id: 'products', label: 'Productos y Servicios', description: 'Lo que ofrecemos', gridArea: 'products' },
]

export const BUSINESS_MODEL_ZONES: CanvasZone[] = [
  { id: 'key-partners', label: 'Socios Clave', description: 'Alianzas estratégicas', gridArea: 'partners' },
  { id: 'key-activities', label: 'Actividades Clave', description: 'Lo más importante que hacemos', gridArea: 'activities' },
  { id: 'key-resources', label: 'Recursos Clave', description: 'Activos esenciales', gridArea: 'resources' },
  { id: 'value-propositions', label: 'Propuesta de Valor', description: 'Lo que nos hace diferentes', gridArea: 'value' },
  { id: 'customer-relationships', label: 'Relación con Clientes', description: 'Cómo nos relacionamos', gridArea: 'relationships' },
  { id: 'channels', label: 'Canales', description: 'Cómo llegamos al cliente', gridArea: 'channels' },
  { id: 'customer-segments', label: 'Segmentos de Cliente', description: 'A quién servimos', gridArea: 'segments' },
  { id: 'cost-structure', label: 'Estructura de Costos', description: 'Costos principales', gridArea: 'costs' },
  { id: 'revenue-streams', label: 'Fuentes de Ingreso', description: 'Cómo generamos ingresos', gridArea: 'revenue' },
]
