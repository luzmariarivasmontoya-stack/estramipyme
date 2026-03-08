import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight, Compass, Users, BarChart3, Puzzle, Lightbulb, Flag, Award } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { STAGES } from '@/utils/constants'
import { staggerContainer, staggerItem } from '@/utils/animations'

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Users,
  BarChart3,
  Puzzle,
  Lightbulb,
  Flag,
}

const successCases = [
  {
    name: 'Mabeka',
    initials: 'MB',
    description:
      'Taller de muebles artesanales en Medellín que descubrió su ventaja competitiva sostenible a través del proceso Estramipyme.',
  },
  {
    name: 'Tienda de Don Juan',
    initials: 'DJ',
    description:
      'Tienda de barrio que identificó oportunidades de crecimiento al conocer mejor a sus clientes y su entorno competitivo.',
  },
  {
    name: 'Fundación Niños Felices',
    initials: 'NF',
    description:
      'Organización sin ánimo de lucro que alineó su propósito con una propuesta de valor clara para sus beneficiarios.',
  },
]

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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
        <Link to="/" className="font-heading text-xl text-accent font-bold">
          Estramipyme
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Crear cuenta
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-24 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6">
            Tu estrategia,{' '}
            <span className="text-accent">paso a paso</span>
          </h1>
          <p className="text-neutral text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Aplica la metodología Estramipyme de la Universidad EAFIT para construir
            la estrategia de tu micronegocio o pyme en 6 etapas guiadas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Comenzar gratis
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/planes">
              <Button variant="outline" size="lg">
                Conocer planes
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stages Section */}
      <section className="px-6 md:px-12 py-20 bg-white" aria-labelledby="stages-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 id="stages-heading" className="font-heading text-3xl md:text-4xl text-foreground mb-4">
              6 etapas para tu estrategia
            </h2>
            <p className="text-neutral text-lg max-w-xl mx-auto">
              Desde explorar tu entorno hasta consolidar tu hoja de ruta, cada etapa te acerca a una estrategia clara y accionable.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {STAGES.map((stage) => {
              const Icon = iconMap[stage.icon]
              return (
                <motion.article
                  key={stage.number}
                  variants={staggerItem}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative bg-background rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col"
                >
                  <span
                    className={`absolute -top-3 right-4 text-xs font-medium px-3 py-1 rounded-full ${
                      stage.free
                        ? 'bg-success/10 text-success'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {stage.free ? 'Gratis' : 'Pro'}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      stage.free ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                  </div>

                  <p className="text-xs text-neutral mb-1 font-medium tracking-wide uppercase">
                    Etapa {stage.number}
                  </p>
                  <h3 className="font-heading text-lg text-foreground mb-1">
                    {stage.name}
                  </h3>
                  <p className="text-neutral text-sm leading-relaxed">
                    {stage.description}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Success Cases Section */}
      <section className="px-6 md:px-12 py-20" aria-labelledby="cases-heading">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 id="cases-heading" className="font-heading text-3xl md:text-4xl text-foreground mb-4">
              Casos de éxito
            </h2>
            <p className="text-neutral text-lg max-w-xl mx-auto">
              Empresas reales que transformaron su estrategia con la metodología Estramipyme.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {successCases.map((c) => (
              <motion.article
                key={c.name}
                variants={staggerItem}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="font-heading text-lg text-accent font-bold">{c.initials}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Award size={16} className="text-accent shrink-0" />
                  <h3 className="font-heading text-lg text-foreground">{c.name}</h3>
                </div>
                <p className="text-neutral text-sm leading-relaxed">{c.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="px-6 md:px-12 py-20" aria-labelledby="plans-heading">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 id="plans-heading" className="font-heading text-3xl md:text-4xl text-foreground mb-4">
              Elige tu plan
            </h2>
            <p className="text-neutral text-lg max-w-xl mx-auto">
              Comienza gratis y actualiza cuando necesites acceder a las herramientas avanzadas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border border-neutral-light rounded-xl p-7 bg-white"
            >
              <h3 className="font-heading text-2xl text-foreground mb-1">Plan Gratuito</h3>
              <p className="text-neutral text-sm mb-6">Para explorar la metodología</p>
              <ul className="space-y-3 mb-8" role="list">
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border-2 border-accent rounded-xl p-7 bg-white relative"
            >
              <div className="absolute -top-3 right-4 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={12} aria-hidden="true" />
                Recomendado
              </div>
              <h3 className="font-heading text-2xl text-foreground mb-1">Plan Pro</h3>
              <p className="text-neutral text-sm mb-6">Experiencia estratégica completa</p>
              <ul className="space-y-3 mb-8" role="list">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-10 border-t border-neutral-light">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neutral text-sm leading-relaxed max-w-2xl mx-auto">
            Estramipyme Digital — Metodología desarrollada por Luz María Rivas-Montoya,
            Universidad EAFIT. Herramienta digital para micronegocios y pymes.
          </p>
        </div>
      </footer>
    </div>
  )
}
