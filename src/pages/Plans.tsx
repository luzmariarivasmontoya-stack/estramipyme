import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { pageTransition } from '@/utils/animations'

const freeBenefits = [
  '1 empresa',
  'Etapas 1-3 (Explorar, Conocer, Analizar)',
  '10 preguntas del cuestionario',
  'Canvas en modo lectura',
  'PDF con marca de agua',
]

const proBenefits = [
  'Empresas ilimitadas',
  'Las 6 etapas completas',
  'Cuestionario completo (~30 preguntas)',
  'Canvas editables con notas',
  'PDF limpio sin marca de agua',
  'Radar organizacional',
  'Hoja de ruta estratégica',
]

export default function Plans() {
  return (
    <div className="min-h-screen bg-background font-body">
      <motion.div
        {...pageTransition}
        className="max-w-4xl mx-auto px-6 md:px-12 py-12"
      >
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-14">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            Planes
          </h1>
          <p className="text-neutral text-lg max-w-xl mx-auto">
            Comienza gratis y actualiza cuando necesites acceder a todas las herramientas estratégicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="border border-neutral-light rounded-xl p-8 bg-white flex flex-col"
          >
            <div className="mb-6">
              <h2 className="font-heading text-2xl text-foreground mb-1">Plan Gratuito</h2>
              <p className="text-neutral text-sm">Para explorar la metodología</p>
            </div>

            <p className="font-heading text-4xl text-foreground mb-6">
              $0
              <span className="text-base text-neutral font-body font-normal ml-1">/siempre</span>
            </p>

            <ul className="space-y-3 mb-8 flex-1" role="list">
              {freeBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm">
                  <Check size={16} className="text-neutral mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link to="/register">
              <Button variant="outline" className="w-full">
                Comenzar gratis
              </Button>
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border-2 border-accent rounded-xl p-8 bg-white relative flex flex-col"
          >
            <div className="absolute -top-3 right-4 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles size={12} aria-hidden="true" />
              Recomendado
            </div>

            <div className="mb-6">
              <h2 className="font-heading text-2xl text-foreground mb-1">Plan Pro</h2>
              <p className="text-neutral text-sm">Experiencia estratégica completa</p>
            </div>

            <p className="font-heading text-4xl text-accent mb-6">
              Pro
              <span className="text-base text-neutral font-body font-normal ml-1">/acceso completo</span>
            </p>

            <ul className="space-y-3 mb-8 flex-1" role="list">
              {proBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm">
                  <Check size={16} className="text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link to="/register">
              <Button variant="primary" className="w-full">
                Comenzar con Pro
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-neutral text-sm mt-12">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Inicia sesión
          </Link>{' '}
          y actualiza tu plan desde la aplicación.
        </p>
      </motion.div>
    </div>
  )
}
