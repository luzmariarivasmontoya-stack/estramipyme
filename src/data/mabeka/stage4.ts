import type { Stage4Data } from '@/types/stages'

export const mabekaStage4: Stage4Data = {
  goldenCircle: {
    why: 'Creemos que cada espacio merece muebles con alma. Nos mueve la pasión por el oficio artesanal y el compromiso con la sostenibilidad, preservando la tradición carpintera antioqueña.',
    how: 'Combinamos técnicas artesanales transmitidas por generaciones con maderas sostenibles de origen local, acompañando a cada cliente en un proceso de diseño personalizado desde la primera visita.',
    what: 'Fabricamos muebles de madera a medida: cocinas integrales, bibliotecas, closets, mesas y mobiliario comercial, cada pieza única y hecha para durar.',
  },
  vrinResources: [
    {
      id: 'vr-1',
      resource: 'Experiencia artesanal del maestro carpintero (25+ años)',
      type: 'intangible',
    },
    {
      id: 'vr-2',
      resource: 'Red de proveedores de madera certificada del Urabá',
      type: 'organizacional',
    },
    {
      id: 'vr-3',
      resource: 'Proceso de consultoría de diseño en sitio',
      type: 'organizacional',
    },
    {
      id: 'vr-4',
      resource: 'Taller y maquinaria especializada',
      type: 'tangible',
    },
    {
      id: 'vr-5',
      resource: 'Reputación y portafolio de clientes satisfechos',
      type: 'intangible',
    },
  ],
  vrinPrincipalResource: 'Experiencia artesanal del maestro carpintero (25+ años)',
  vrinAnalysis: {
    resource: 'Experiencia artesanal del maestro carpintero (25+ años)',
    valuable: true,
    valuableJustification: 'Permite crear piezas únicas de alta calidad que satisfacen clientes exigentes y generan recomendaciones boca a boca.',
    rare: true,
    rareJustification: 'Pocos carpinteros en la región combinan 25+ años de experiencia artesanal con conocimiento de maderas sostenibles y diseño contemporáneo.',
    inimitable: true,
    inimitableJustification: 'La experiencia acumulada, las relaciones con proveedores y el conocimiento tácito del oficio son difíciles de replicar en corto plazo.',
    nonSubstitutable: true,
    nonSubstitutableJustification: 'La producción industrial no puede sustituir la personalización y el detalle artesanal que valoran nuestros clientes.',
  },
  radar: [
    { category: 'Conocimiento del cliente', value: 4 },
    { category: 'Conocimiento del negocio', value: 3 },
    { category: 'Coherencia del modelo', value: 3 },
    { category: 'Alineación interna', value: 2 },
    { category: 'Salud financiera', value: 2 },
  ],
  strategicChallenge:
    'Escalar la producción artesanal sin sacrificar la calidad y el toque personalizado que diferencia a Mabeka, mientras se fortalece la presencia digital para alcanzar nuevos segmentos de mercado en el Valle de Aburrá.',
  conclusions: [
    {
      id: 'conc-1',
      source: 'tendencias',
      riesgo: 'Crecimiento de muebles industriales de bajo costo importados',
      oportunidad: 'Mayor interés en productos artesanales y sostenibles',
    },
    {
      id: 'conc-2',
      source: 'industria',
      riesgo: 'Alta rivalidad con talleres informales de menor precio',
      oportunidad: 'Pocos competidores ofrecen diseño personalizado con madera certificada',
    },
    {
      id: 'conc-3',
      source: 'recursos',
      riesgo: 'Dependencia del maestro carpintero como recurso clave',
      oportunidad: 'Ventaja competitiva sostenible por experiencia artesanal única',
    },
    {
      id: 'conc-4',
      source: 'radar',
      riesgo: 'Baja presencia digital y salud financiera ajustada',
      oportunidad: 'Fuerte conocimiento del cliente permite fidelización',
    },
    {
      id: 'conc-5',
      source: 'otros',
      riesgo: 'Falta de plan de sucesión para el conocimiento artesanal',
      oportunidad: 'Posibilidad de crear programa de aprendices y escuela taller',
    },
  ],
}
