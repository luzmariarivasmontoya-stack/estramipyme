import { Card } from '@/components/common/Card'
import { StickyNotesBoard } from '@/components/sticky-notes/StickyNotesBoard'
import type { StickyNote } from '@/types/stages'

interface TestimonialMuralProps {
  testimonials: StickyNote[]
  onChange: (updated: StickyNote[]) => void
}

export function TestimonialMural({ testimonials, onChange }: TestimonialMuralProps) {
  return (
    <Card>
      <div className="mb-5">
        <h4 className="font-heading text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
          Mural de Testimonios
        </h4>
        <p className="text-sm text-neutral font-body leading-relaxed">
          Captura las voces reales de tus actores clave. Usa las notas adhesivas para registrar
          citas textuales, testimonios o frases significativas que hayas recogido en tus
          conversaciones. Arrastra las notas para organizarlas visualmente y descubrir patrones.
        </p>
      </div>

      <StickyNotesBoard
        notes={testimonials}
        onChange={onChange}
      />
    </Card>
  )
}
