export interface InvestigatorRole {
  id: string
  name: string
  description: string
  icon: string
  questions: string[]
}

export const investigatorRoles: InvestigatorRole[] = [
  {
    id: 'detective',
    name: 'Detective de datos',
    description:
      'Busca datos duros, estadísticas y cifras que revelen patrones del mercado.',
    icon: 'Search',
    questions: [
      '¿Qué datos cuantitativos tienes sobre tu mercado actual?',
      '¿Qué estadísticas o cifras clave definen el comportamiento de tu industria?',
      '¿Qué patrones numéricos has identificado en las ventas o demanda de tu sector?',
    ],
  },
  {
    id: 'periodista',
    name: 'Periodista',
    description:
      'Hace preguntas incómodas y busca la historia detrás de los hechos.',
    icon: 'Newspaper',
    questions: [
      '¿Qué preguntas difíciles sobre tu negocio has evitado responder?',
      '¿Cuál es la historia real detrás del desempeño de tu empresa?',
      '¿Qué verdades incómodas sobre tu mercado necesitas enfrentar?',
    ],
  },
  {
    id: 'antropologo',
    name: 'Antropólogo',
    description:
      'Observa comportamientos y cultura del consumidor en su entorno natural.',
    icon: 'Users',
    questions: [
      '¿Qué comportamientos y hábitos observas en tus clientes en su entorno natural?',
      '¿Cómo influye la cultura local en las decisiones de compra de tu público?',
      '¿Qué rituales o costumbres rodean el uso de tu producto o servicio?',
    ],
  },
  {
    id: 'personificador',
    name: 'Personificador',
    description:
      'Se pone en los zapatos del cliente para entender su experiencia completa.',
    icon: 'UserCheck',
    questions: [
      '¿Has recorrido personalmente el proceso completo que vive tu cliente?',
      '¿Qué frustraciones experimenta tu cliente desde que conoce tu marca hasta que usa tu producto?',
      '¿Qué emociones siente tu cliente en cada punto de contacto con tu negocio?',
    ],
  },
  {
    id: 'cocreador',
    name: 'Cocreador',
    description:
      'Involucra al cliente en el diseño de soluciones y nuevas ideas.',
    icon: 'Handshake',
    questions: [
      '¿Cómo involucras actualmente a tus clientes en el desarrollo de nuevos productos o servicios?',
      '¿Qué mecanismos tienes para recoger ideas y sugerencias de tus clientes?',
      '¿Qué pasaría si diseñaras tu próxima solución junto con tus clientes?',
    ],
  },
  {
    id: 'cientifico',
    name: 'Científico',
    description:
      'Diseña experimentos y pruebas para validar hipótesis del negocio.',
    icon: 'FlaskConical',
    questions: [
      '¿Qué hipótesis sobre tu negocio podrías poner a prueba con un experimento rápido?',
      '¿Qué supuestos sobre tu mercado aún no has validado con evidencia?',
      '¿Qué experimento de bajo costo podrías diseñar para probar una nueva idea?',
    ],
  },
]
