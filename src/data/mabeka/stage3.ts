import type { Stage3Data } from '@/types/stages'

export const mabekaStage3: Stage3Data = {
  megatrends: [
    {
      id: 'mega-1',
      megatrend: 'Economia Circular y Sostenibilidad',
      source: 'Informe PNUMA 2025',
      date: '2025-03-15',
      impact: 4,
      type: 'oportunidad',
    },
    {
      id: 'mega-2',
      megatrend: 'Transformacion Digital en Manufactura',
      source: 'McKinsey Global Institute',
      date: '2025-01-20',
      impact: 3,
      type: 'oportunidad',
    },
    {
      id: 'mega-3',
      megatrend: 'Urbanizacion y Espacios Reducidos',
      source: 'ONU-Habitat',
      date: '2024-11-10',
      impact: 3,
      type: 'riesgo',
    },
  ],
  industry: {
    rivalry: 3,
    newEntrants: 2,
    substitutes: 3,
    buyerPower: 3,
    supplierPower: 2,
    competitorsDetail:
      'Carpinterias informales del barrio, grandes superficies como Homecenter y Tugo, y plataformas online de muebles importados.',
    newEntrantsDetail:
      'Nuevos emprendimientos de carpinteria con enfoque digital y franquicias de muebles modulares que estan llegando a Medellin.',
    substitutesDetail:
      'Muebles importados de grandes superficies (Homecenter, IKEA-style), muebles de plastico y metal, y opciones de segunda mano en marketplace.',
    notes:
      'La rivalidad es moderada-alta: hay muchos carpinteros informales pero pocos con enfoque en calidad y sostenibilidad. Las barreras de entrada son bajas en carpinteria basica pero altas en el segmento artesanal especializado. Los sustitutos principales son muebles importados de grandes superficies. El poder del comprador es medio porque valoran la personalizacion pero comparan con alternativas industriales. Los proveedores de madera certificada son pocos, lo que les da cierto poder pero la relacion con Mabeka es estable.',
  },
  strategicClock: {
    segment: 4,
    angle: 135,
    justification:
      'Mabeka se ubica en la posicion de diferenciacion porque ofrece muebles artesanales de alta calidad con maderas sostenibles y diseno personalizado, a precios razonables para su segmento objetivo. La propuesta de valor se centra en la artesania, la sostenibilidad y la atencion al detalle, no en competir por precio.',
  },
  principalRiesgo:
    'Nuevas regulaciones ambientales podrian encarecer las materias primas y exigir certificaciones costosas. Ademas, competidores mas grandes pueden implementar tecnologia CNC a gran escala, reduciendo costos que una microempresa no puede igualar.',
  principalOportunidad:
    'Posicionar a Mabeka como marca sostenible y artesanal, aprovechando la economia circular y la creciente demanda de muebles personalizados para espacios urbanos reducidos en Medellin.',
}
