import type { Stage5Data } from '@/types/stages'

export const mabekaStage5: Stage5Data = {
  valuePropCanvas: [
    {
      id: 'vpc-1',
      content: 'Tener muebles que se ajusten perfectamente a sus espacios y reflejen su estilo personal.',
      zone: 'jobs',
      color: '#FEF3C7',
      subtype: 'Funcionales',
    },
    {
      id: 'vpc-1b',
      content: 'Sentirse orgullosos de apoyar lo local y sostenible al elegir sus muebles.',
      zone: 'jobs',
      color: '#DBEAFE',
      subtype: 'Emocionales',
    },
    {
      id: 'vpc-2',
      content: 'Incertidumbre sobre el resultado final sin poder ver el mueble antes.',
      zone: 'pains',
      color: '#FEE2E2',
      subtype: 'Alta',
    },
    {
      id: 'vpc-2b',
      content: 'Tiempos de entrega largos e impredecibles.',
      zone: 'pains',
      color: '#FED7AA',
      subtype: 'Media',
    },
    {
      id: 'vpc-3',
      content: 'Satisfacción de tener una pieza única, durabilidad generacional, orgullo de apoyar lo local y sostenible.',
      zone: 'gains',
      color: '#D1FAE5',
      subtype: 'Deseadas',
    },
    {
      id: 'vpc-3b',
      content: 'Muebles que encajan perfectamente en el espacio disponible.',
      zone: 'gains',
      color: '#E0E7FF',
      subtype: 'Necesarias',
    },
    {
      id: 'vpc-4',
      content: 'Visita de diseño en sitio con muestras de madera. Renders básicos del mueble antes de fabricación.',
      zone: 'pain-relievers',
      color: '#DBEAFE',
    },
    {
      id: 'vpc-5',
      content: 'Garantía de 2 años, certificación de madera sostenible, acabados ecológicos y diseño a medida.',
      zone: 'gain-creators',
      color: '#E9D5FF',
    },
    {
      id: 'vpc-6',
      content: 'Muebles a medida en madera (cocinas, bibliotecas, closets, mesas). Servicio de restauración de muebles.',
      zone: 'products',
      color: '#FCE7F3',
    },
  ],
  adLib: {
    productosServicios: 'servicios de carpintería artesanal a medida',
    segmento: 'familias de estrato medio-alto en Medellín y pequeñas empresas',
    tarea: 'tener mobiliario único que se adapte a sus espacios y refleje su identidad',
    frustracion: 'la incertidumbre sobre el resultado final y los largos tiempos de entrega',
    alegria: 'la satisfacción de tener piezas únicas, duraderas y ambientalmente responsables',
    competidor: 'las grandes superficies que ofrecen muebles genéricos e industrializados',
  },
  businessModelCanvas: [
    {
      id: 'bmc-1',
      content: 'Proveedores de madera certificada del Urabá, diseñadores de interiores aliados, transportista local.',
      zone: 'key-partners',
      color: '#FEF3C7',
    },
    {
      id: 'bmc-2',
      content: 'Diseño personalizado, fabricación artesanal, instalación en sitio, servicio postventa y restauración.',
      zone: 'key-activities',
      color: '#DBEAFE',
    },
    {
      id: 'bmc-3',
      content: 'Taller equipado, maestro carpintero experto, red de proveedores de madera, portafolio de proyectos.',
      zone: 'key-resources',
      color: '#D1FAE5',
    },
    {
      id: 'bmc-4',
      content: 'Muebles artesanales a medida con maderas sostenibles, diseño personalizado y calidad generacional.',
      zone: 'value-propositions',
      color: '#E9D5FF',
    },
    {
      id: 'bmc-5',
      content: 'Acompañamiento cercano, visitas en sitio, comunicación por WhatsApp, seguimiento postventa.',
      zone: 'customer-relationships',
      color: '#FCE7F3',
    },
    {
      id: 'bmc-6',
      content: 'Voz a voz, Instagram, referidos de diseñadores, ferias de diseño locales, Google Maps.',
      zone: 'channels',
      color: '#FEF3C7',
    },
    {
      id: 'bmc-7',
      content: 'Familias estrato medio-alto (Poblado, Laureles, Envigado), pequeñas empresas y cafés, diseñadores de interiores.',
      zone: 'customer-segments',
      color: '#DBEAFE',
    },
    {
      id: 'bmc-8',
      content: 'Materias primas (madera, herrajes, acabados), mano de obra, arriendo del taller, herramientas, transporte.',
      zone: 'cost-structure',
      color: '#D1FAE5',
    },
    {
      id: 'bmc-9',
      content: 'Venta de muebles a medida (70%), proyectos de amoblamiento completo (20%), restauración (10%).',
      zone: 'revenue-streams',
      color: '#E9D5FF',
    },
  ],
  coherenceNotes:
    'El modelo de negocio es coherente: la propuesta de valor artesanal se sostiene en los recursos clave (maestro carpintero y proveedores certificados). El canal principal es el voz a voz, lo cual es consistente con la relación cercana pero limita el crecimiento. Se recomienda fortalecer el canal digital sin perder la esencia personalizada. La estructura de costos es viable mientras se mantengan los márgenes de diferenciación.',
  coherenceScore: 'verde',
  workshop: {
    date: '2025-11-15',
    agenda: [
      'Apertura y contexto (10 min)',
      'Revisión de hallazgos (20 min)',
      'Construcción de propuesta de valor (30 min)',
      'Validación y coherencia (20 min)',
      'Acuerdos y compromisos (10 min)',
    ],
    participants: [
      'Jorge Betancur (Fundador y Maestro Carpintero)',
      'María Elena Cano (Administración y Ventas)',
      'Santiago Restrepo (Oficial de Carpintería)',
      'Valentina Gómez (Diseñadora aliada)',
    ],
    roles: {
      'Jorge Betancur (Fundador y Maestro Carpintero)': 'Facilitador',
      'María Elena Cano (Administración y Ventas)': 'Relator',
      'Santiago Restrepo (Oficial de Carpintería)': 'Cronometrista',
    },
    checklist: {
      'Resultados del cuestionario impresos': true,
      'Canvas de propuesta de valor en blanco': true,
      'Post-its y marcadores': true,
      'Refrigerios para participantes': false,
      'Proyector o pantalla': true,
    },
    agreements:
      'Se acuerda priorizar: (1) Crear un portafolio digital profesional con fotos y renders. (2) Establecer alianza formal con 2 diseñadoras de interiores para referidos mutuos. (3) Implementar un sistema básico de cotización digital con tiempos estimados. Próxima revisión en 3 meses.',
    strategicAgreement:
      'El equipo se compromete a lanzar el portafolio digital en un plazo de 2 meses y a establecer al menos 2 alianzas con diseñadoras de interiores antes de fin de año, manteniendo la calidad artesanal como eje diferenciador.',
  },
}
