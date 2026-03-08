import type { Company } from '@/types/company'

export const ninosFelicesCompany: Company = {
  id: 'case-ninos-felices',
  name: 'Fundacion Ninos Felices',
  sector: 'Organizacion sin animo de lucro / Educacion infantil',
  size: 'pequena',
  city: 'Cali',
  fundadoEn: '2012',
  empleados: '10-49',
  tipoRelacion: 'B2B2C',
  motivacion:
    'Queremos profesionalizar nuestra gestion estrategica para ser mas sostenibles financieramente y ampliar nuestro impacto social sin depender unicamente de donaciones.',
  description:
    'Organizacion sin animo de lucro en Cali dedicada a la educacion y el bienestar de ninos en situacion de vulnerabilidad. Ofrece programas de refuerzo escolar, alimentacion y apoyo psicosocial en tres comunas de la ciudad.',
  createdAt: '2025-05-20T08:00:00.000Z',
  updatedAt: '2025-12-01T10:00:00.000Z',
  ownerId: 'case-study',
  isDemo: true,
  currentStage: 5,
  stages: {
    stage1: {
      businessProfile: {
        porQueSeFundo:
          'Nacio de la iniciativa de un grupo de profesores y trabajadores sociales preocupados por la desercion escolar y la malnutricion infantil en tres comunas vulnerables de Cali.',
        cuandoYDonde: '2012, Cali, Colombia - Comunas 13, 14 y 15',
        empleados: '12 empleados fijos (docentes, trabajadores sociales, coordinadores) y 25 voluntarios regulares',
        productosServicios:
          'Programas de refuerzo escolar, alimentacion diaria (almuerzo y merienda), apoyo psicosocial, talleres artisticos y deportivos para ninos de 6 a 14 anos.',
        rangoIngresos: '20m_50m',
        contabilidadFormal: true,
      },
      trends: [
        {
          id: 'nf-trend-1',
          name: 'Mayor exigencia de transparencia y medicion de impacto por parte de donantes',
          source: 'Fundacion AFE Colombia',
          date: '2025-07-20',
          type: 'oportunidad',
        },
        {
          id: 'nf-trend-2',
          name: 'Reduccion de fondos internacionales de cooperacion para Colombia',
          source: 'DANE / Cancilleria',
          date: '2025-06-15',
          type: 'riesgo',
        },
      ],
      investigatorNotes: {
        detective:
          'Las organizaciones sociales en Colombia que miden y comunican su impacto tienen 3 veces mas probabilidad de recibir financiacion recurrente.',
        periodista:
          'Los padres de familia cuentan que sin la fundacion, muchos ninos estarian en la calle. El programa de alimentacion es lo que mas valoran.',
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
        why: 'Creemos que todo nino merece crecer con oportunidades, sin importar donde nacio. Nos mueve la conviccion de que la educacion y el cuidado transforman comunidades enteras.',
        how: 'Combinamos educacion, alimentacion y acompanamiento psicosocial en un modelo integral que involucra a las familias y la comunidad, con equipos comprometidos y voluntarios apasionados.',
        what: 'Ofrecemos programas de refuerzo escolar, alimentacion diaria, apoyo psicosocial y talleres artisticos para ninos de 6 a 14 anos en tres comunas vulnerables de Cali.',
      },
      vrinResources: [
        {
          id: 'nf-vr-1',
          resource: 'Modelo integral de atencion (educacion + alimentacion + psicosocial)',
          type: 'organizacional',
        },
        {
          id: 'nf-vr-2',
          resource: 'Red de 25 voluntarios comprometidos y alianzas con universidades',
          type: 'intangible',
        },
        {
          id: 'nf-vr-3',
          resource: 'Confianza de la comunidad construida en 13 anos de presencia continua',
          type: 'intangible',
        },
      ],
      vrinPrincipalResource: 'Modelo integral de atencion (educacion + alimentacion + psicosocial)',
      vrinAnalysis: null,
      radar: [
        { category: 'Conocimiento del cliente', value: 4 },
        { category: 'Conocimiento del negocio', value: 3 },
        { category: 'Coherencia del modelo', value: 4 },
        { category: 'Alineacion interna', value: 3 },
        { category: 'Salud financiera', value: 2 },
      ],
      strategicChallenge:
        'Diversificar las fuentes de financiacion mas alla de donaciones (servicios de consultoria social, convenios con el sector publico, crowdfunding) y profesionalizar la medicion de impacto para demostrar resultados a donantes y aliados potenciales.',
      conclusions: [
        {
          id: 'nf-conc-1',
          source: 'tendencias',
          riesgo: 'Reduccion de fondos internacionales de cooperacion para Colombia',
          oportunidad: 'Los donantes valoran cada vez mas la medicion de impacto, area en la que podemos diferenciarnos',
        },
        {
          id: 'nf-conc-2',
          source: 'recursos',
          riesgo: 'Alta dependencia de donaciones y fondos no recurrentes',
          oportunidad: 'El modelo integral y la confianza comunitaria permiten explorar convenios con el sector publico',
        },
      ],
    },
    stage5: {
      valuePropCanvas: [],
      adLib: {
        productosServicios: 'programas integrales de educacion, alimentacion y acompanamiento psicosocial',
        segmento: 'ninos de 6-14 anos en situacion de vulnerabilidad y sus familias en Cali',
        tarea: 'acceder a educacion de calidad, alimentacion adecuada y apoyo emocional para sus hijos',
        frustracion: 'la falta de recursos, la inseguridad del entorno y la ausencia de programas accesibles cerca de casa',
        alegria: 'ver a sus hijos motivados, bien alimentados y con mejores resultados academicos',
        competidor: 'programas gubernamentales puntuales que no ofrecen continuidad ni enfoque integral',
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
