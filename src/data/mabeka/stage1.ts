import type { Stage1Data } from '@/types/stages'

export const mabekaStage1: Stage1Data = {
  businessProfile: {
    porQueSeFundo:
      'Nació de la pasión por la carpintería artesanal y la necesidad de ofrecer muebles de madera personalizados con altos estándares de calidad en Medellín.',
    cuandoYDonde: '2018, Medellín, Colombia',
    empleados: '8 empleados',
    productosServicios:
      'Muebles de madera a medida: cocinas integrales, bibliotecas, closets, mesas de comedor y mobiliario comercial para pequeños negocios. Servicio de diseño personalizado y restauración de muebles.',
    rangoIngresos: '5m_20m',
    contabilidadFormal: true,
  },
  trends: [
    {
      id: 'trend-1',
      name: 'Sostenibilidad en materiales',
      source: 'Sectorial.co',
      date: '2025-11-15',
      type: 'oportunidad',
    },
    {
      id: 'trend-2',
      name: 'Diseño personalizado digital',
      source: 'McKinsey Insights',
      date: '2025-09-20',
      type: 'oportunidad',
    },
    {
      id: 'trend-3',
      name: 'Competencia de grandes superficies con precios bajos',
      source: 'La República',
      date: '2025-10-05',
      type: 'riesgo',
    },
  ],
  investigatorNotes: {
    detective:
      'El segmento de muebles a medida en Medellín crece un 8% anual. La competencia principal viene de grandes superficies con precios bajos, pero la calidad artesanal sigue siendo un diferenciador fuerte.',
    periodista:
      '¿Por qué los clientes siguen eligiendo muebles genéricos si valoran la calidad? La historia detrás: falta de visibilidad de los talleres artesanales y percepción de precios altos.',
    antropologo:
      'Los clientes que visitamos valoran mucho el trato personalizado y la posibilidad de elegir la madera. El taller tiene buena ubicación pero la señalización es escasa.',
    personificador:
      'Al recorrer la experiencia completa del cliente, se identifica fricción en el proceso de cotización: demasiado lento y sin visualización previa del resultado.',
    cocreador:
      'En una sesión con 5 clientes frecuentes surgieron ideas de líneas modulares y un catálogo interactivo donde ellos personalizan dimensiones y acabados.',
    cientifico:
      'Las ferias de diseño en Medellín muestran una clara preferencia por materiales naturales y diseño colombiano. Hay oportunidad de posicionarse como marca sostenible local.',
  },
}
