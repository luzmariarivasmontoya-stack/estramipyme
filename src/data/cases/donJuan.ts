import type { Company } from '@/types/company'

export const donJuanCompany: Company = {
  id: 'case-don-juan',
  name: 'Tienda de Don Juan',
  sector: 'Comercio minorista / Tienda de barrio',
  size: 'micro',
  city: 'Bogota',
  fundadoEn: '2005',
  empleados: '2-3',
  tipoRelacion: 'B2C',
  motivacion:
    'Quiero modernizar mi tienda sin perder el trato cercano con los vecinos del barrio, y encontrar formas de competir con las grandes cadenas.',
  description:
    'Tienda de barrio tradicional en el barrio La Candelaria de Bogota, fundada por Don Juan Morales. Vende viveres, productos de aseo, bebidas y algunos productos frescos. Es un punto de encuentro comunitario para los vecinos.',
  createdAt: '2025-06-15T10:00:00.000Z',
  updatedAt: '2025-12-01T10:00:00.000Z',
  ownerId: 'case-study',
  isDemo: true,
  currentStage: 5,
  stages: {
    stage1: {
      businessProfile: {
        porQueSeFundo:
          'Nacio como negocio familiar para generar ingresos propios y servir al barrio. Don Juan dejo su trabajo como empleado de supermercado para emprender con su esposa.',
        cuandoYDonde: '2005, Bogota, Colombia - Barrio La Candelaria',
        empleados: '3 empleados (Don Juan, su esposa y un sobrino)',
        productosServicios:
          'Viveres, productos de aseo, bebidas, algunos productos frescos (frutas, verduras), recargas de celular, servicio de domicilios al barrio.',
        rangoIngresos: '2m_5m',
        contabilidadFormal: false,
      },
      trends: [
        {
          id: 'dj-trend-1',
          name: 'Crecimiento de tiendas de descuento (D1, Ara, Justo & Bueno)',
          source: 'Portafolio',
          date: '2025-08-10',
          type: 'riesgo',
        },
        {
          id: 'dj-trend-2',
          name: 'Aumento de pagos digitales en tiendas de barrio',
          source: 'Fenalco',
          date: '2025-09-05',
          type: 'oportunidad',
        },
      ],
      investigatorNotes: {
        detective:
          'Las tiendas de barrio siguen siendo el canal numero uno de compra para estratos 2-4 en Colombia, representando el 50% de las ventas de consumo masivo.',
        antropologo:
          'Los vecinos no solo vienen a comprar: piden fiado, conversan, preguntan por los demas. La tienda es un punto de encuentro social.',
      },
    },
    stage2: { conversations: [], testimonials: [] },
    stage3: {
      megatrends: [],
      industry: {
        rivalry: 0,
        newEntrants: 0,
        substitutes: 0,
        buyerPower: 0,
        supplierPower: 0,
        competitorsDetail: '',
        newEntrantsDetail: '',
        substitutesDetail: '',
        notes: '',
      },
      strategicClock: { segment: 0, angle: 0, justification: '', targetPosition: 0 },
      principalRiesgo: '',
      principalOportunidad: '',
    },
    stage4: {
      goldenCircle: {
        why: 'Creemos que el barrio merece una tienda que lo cuide como familia. Nos mueve servir a nuestros vecinos con confianza, cercanía y productos de calidad accesibles.',
        how: 'Ofrecemos atencion personalizada, fiamos a los vecinos de confianza, abrimos desde las 6am y conocemos a cada cliente por su nombre.',
        what: 'Vendemos viveres, productos de aseo, bebidas y productos frescos. Ofrecemos recargas, domicilios al barrio y un lugar donde siempre hay alguien para ayudar.',
      },
      vrinResources: [
        {
          id: 'dj-vr-1',
          resource: 'Relacion de confianza con los vecinos del barrio (20 anos)',
          type: 'intangible',
        },
        {
          id: 'dj-vr-2',
          resource: 'Ubicacion estrategica en esquina principal del barrio',
          type: 'tangible',
        },
        {
          id: 'dj-vr-3',
          resource: 'Sistema de fiado basado en confianza comunitaria',
          type: 'organizacional',
        },
      ],
      vrinPrincipalResource: 'Relacion de confianza con los vecinos del barrio (20 anos)',
      vrinAnalysis: null,
      radar: [
        { category: 'Conocimiento del cliente', value: 5 },
        { category: 'Conocimiento del negocio', value: 2 },
        { category: 'Coherencia del modelo', value: 3 },
        { category: 'Alineacion interna', value: 3 },
        { category: 'Salud financiera', value: 2 },
      ],
      strategicChallenge:
        'Modernizar la gestion de la tienda (inventarios, pagos digitales, contabilidad) sin perder la cercanía y confianza que la diferencian de las cadenas de descuento, para mejorar la rentabilidad y asegurar la sostenibilidad del negocio familiar.',
      conclusions: [
        {
          id: 'dj-conc-1',
          source: 'tendencias',
          riesgo: 'Las cadenas de descuento capturan cada vez mas mercado con precios bajos',
          oportunidad: 'Los clientes siguen valorando la cercanía, el fiado y la atencion personalizada',
        },
        {
          id: 'dj-conc-2',
          source: 'recursos',
          riesgo: 'Falta de contabilidad formal limita el acceso a creditos y la toma de decisiones',
          oportunidad: 'La relacion comunitaria de 20 anos es un activo intangible inimitable',
        },
      ],
    },
    stage5: {
      valuePropCanvas: [],
      adLib: {
        productosServicios: 'productos de consumo diario y atencion personalizada de barrio',
        segmento: 'familias del barrio La Candelaria de estratos 2-3',
        tarea: 'abastecerse de lo que necesitan para el dia a dia de forma rapida, cercana y con confianza',
        frustracion: 'los precios mas altos que en las cadenas de descuento y la falta de variedad',
        alegria: 'poder comprar fiado, recibir atencion personalizada y encontrar todo cerca de casa',
        competidor: 'las cadenas de descuento como D1 y Ara que ofrecen precios mas bajos',
      },
      businessModelCanvas: [],
      coherenceNotes: '',
      coherenceScore: null,
      workshop: {
        agenda: [],
        participants: [],
        roles: {},
        checklist: {},
        agreements: '',
        strategicAgreement: '',
        date: '',
      },
    },
    stage6: { roadmap: [], finalNotes: '' },
  },
  questionnaire: { answers: {} },
}
