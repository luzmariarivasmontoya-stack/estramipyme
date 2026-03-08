import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Lock, ArrowRight } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { caseStudies } from '@/data/cases'
import { staggerContainer, staggerItem, pageTransition } from '@/utils/animations'

export default function CaseStudies() {
  const navigate = useNavigate()

  return (
    <FreemiumGate feature="los casos de estudio">
      <motion.div className="max-w-5xl mx-auto" {...pageTransition}>
        {/* Banner */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-8 flex items-center gap-3">
          <BookOpen className="text-accent shrink-0" size={22} />
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Casos de Estudio
            </h1>
            <p className="text-sm text-neutral mt-0.5">
              Casos de ejemplo &mdash; basados en Estramipyme (EAFIT, 2023)
            </p>
          </div>
        </div>

        <p className="text-neutral mb-6 text-sm leading-relaxed">
          Explora casos reales aplicados con la metodología Estramipyme.
          Cada caso ilustra cómo micro y pequeñas organizaciones construyen su estrategia
          paso a paso. Puedes usar cualquiera como plantilla para iniciar tu propio proceso.
        </p>

        {/* Case cards */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          {...staggerContainer}
        >
          {caseStudies.map((cs) => (
            <motion.div key={cs.id} {...staggerItem}>
              <Card
                hover
                className="flex flex-col h-full"
                onClick={() => navigate(`/app/caso/${cs.slug}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-heading text-lg font-bold text-foreground leading-tight">
                    {cs.name}
                  </h2>
                  <span className="shrink-0 ml-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    <Lock size={10} />
                    PRO
                  </span>
                </div>

                {/* Sector */}
                <p className="text-xs text-neutral mb-3">{cs.sector}</p>

                {/* Reto estratégico */}
                <p className="text-sm text-foreground/80 line-clamp-2 flex-1">
                  {cs.retoEstrategico}
                </p>

                {/* CTA */}
                <div className="mt-4 pt-3 border-t border-neutral-lighter flex items-center justify-end gap-1 text-accent text-sm font-medium">
                  Ver caso
                  <ArrowRight size={14} />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </FreemiumGate>
  )
}
