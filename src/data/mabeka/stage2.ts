import type { Stage2Data } from '@/types/stages'

export const mabekaStage2: Stage2Data = {
  conversations: [
    {
      id: 'conv-1',
      actor: 'Fundador/dueño',
      pregunta1:
        'La atención personalizada. Cada cliente siente que su mueble es único porque lo diseñamos juntos.',
      pregunta2:
        'Usamos madera certificada y ofrecemos diseño a medida. Los competidores grandes venden muebles genéricos.',
      pregunta3:
        'Invertiría en un showroom más grande y en herramientas de visualización 3D para los clientes.',
      pregunta4:
        'Que el aumento en costos de materia prima nos obligue a subir precios y perder competitividad.',
    },
    {
      id: 'conv-2',
      actor: 'Empleado',
      pregunta1:
        'El orgullo de ver un mueble terminado y saber que va a durar generaciones. Eso valoran los clientes.',
      pregunta2:
        'La calidad del acabado. Ningún competidor cercano trabaja con madera certificada como nosotros.',
      pregunta3:
        'Más espacio de almacenamiento y mejores herramientas de extracción de polvo, por salud.',
      pregunta4:
        'Que la carga de trabajo alta en temporadas pico afecte la calidad o el bienestar del equipo.',
    },
    {
      id: 'conv-3',
      actor: 'Cliente 1',
      pregunta1:
        'La posibilidad de elegir exactamente el diseño y los materiales, que se adapte perfecto al espacio.',
      pregunta2:
        'El trato cercano. Don Jorge viene a la casa, mide todo con calma y muestra opciones. No es como un almacén.',
      pregunta3:
        'Me gustaría poder ver un modelo 3D del mueble antes de aprobarlo, para estar más seguro del resultado.',
      pregunta4:
        'Que los tiempos de entrega se alarguen mucho cuando hay muchos pedidos al tiempo.',
    },
    {
      id: 'conv-4',
      actor: 'Proveedor',
      pregunta1:
        'La seriedad y el cumplimiento. Mabeka es un cliente confiable que paga a tiempo y valora la calidad.',
      pregunta2:
        'Que trabajan con madera certificada. Pocos talleres en Medellín exigen trazabilidad de origen.',
      pregunta3:
        'Haría acuerdos de volumen a mediano plazo para obtener mejores precios y prioridad en entregas.',
      pregunta4:
        'La fluctuación en precios de madera importada y la incertidumbre en la cadena de suministro.',
    },
  ],
  testimonials: [
    {
      id: 'sticky-1',
      content:
        '"Mandamos hacer la cocina integral con Mabeka y quedó espectacular. La madera tiene un aroma increíble y cada detalle está cuidado. Ya llevamos 3 años y sigue como nueva." — Carolina M., El Poblado',
      color: '#FEF3C7',
      x: 80,
      y: 60,
      category: 'cliente',
    },
    {
      id: 'sticky-2',
      content:
        '"Lo que más me gustó fue que don Jorge vino a la casa, midió todo con calma y me mostró las opciones de madera. No es como comprar en un almacén, acá uno siente que el mueble es de verdad suyo." — Andrés R., Laureles',
      color: '#DBEAFE',
      x: 420,
      y: 80,
      category: 'cliente',
    },
    {
      id: 'sticky-3',
      content:
        '"Trabajo con varios carpinteros en Medellín y Mabeka es de los más serios. Cumplen tiempos, la madera es de calidad y están abiertos a ajustar diseños sobre la marcha." — Valentina G., Diseñadora de interiores',
      color: '#D1FAE5',
      x: 200,
      y: 320,
      category: 'aliado',
    },
    {
      id: 'sticky-4',
      content:
        '"Les pedí una biblioteca a medida para un espacio difícil debajo de la escalera. Pensé que nadie podría, pero el resultado fue perfecto. Hasta los vecinos preguntan dónde la mandé hacer." — Juliana P., Envigado',
      color: '#FCE7F3',
      x: 520,
      y: 340,
      category: 'cliente',
    },
  ],
}
