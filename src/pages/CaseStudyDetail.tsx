import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ArrowLeft,
  Building2,
  Target,
  CircleDot,
  Radar,
  MessageSquareQuote,
  Map,
  Copy,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { FreemiumGate } from '@/components/common/FreemiumGate'
import { AppContext } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'
import { getCaseBySlug } from '@/data/cases'
import { pageTransition, staggerContainer, staggerItem } from '@/utils/animations'

const CLOCK_LABELS: Record<number, string> = {
  1: 'Sin extras (precio bajo, valor bajo)',
  2: 'Precio bajo',
  3: 'Hibrido (buen valor, buen precio)',
  4: 'Diferenciacion',
  5: 'Diferenciacion focalizada',
  6: 'Mayor precio / valor estandar',
  7: 'Mayor precio / valor bajo',
  8: 'Precio bajo / valor bajo',
}

export default function CaseStudyDetail() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const appContext = useContext(AppContext)
  const { user } = useAuth()

  const caseMeta = caseId ? getCaseBySlug(caseId) : undefined
  if (!caseMeta) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen size={48} className="text-neutral mb-4" />
        <h2 className="font-heading text-xl font-bold mb-2">Caso no encontrado</h2>
        <p className="text-neutral text-sm mb-6">El caso de estudio solicitado no existe.</p>
        <Button variant="outline" onClick={() => navigate('/app/casos')}>
          Volver a casos
        </Button>
      </div>
    )
  }

  const company = caseMeta.company
  const { stage1, stage4, stage5, stage6 } = company.stages

  const handleUseAsTemplate = () => {
    if (!appContext || !user) return
    const now = new Date().toISOString()
    const newCompany = {
      ...company,
      id: crypto.randomUUID(),
      name: `${company.name} (copia)`,
      isDemo: false,
      ownerId: user.id,
      createdAt: now,
      updatedAt: now,
    }
    appContext.dispatchCompany({ type: 'ADD_COMPANY', payload: newCompany })
    appContext.setCurrentCompanyId(newCompany.id)
    navigate('/app')
  }

  return (
    <FreemiumGate feature="los casos de estudio">
      <motion.div className="max-w-4xl mx-auto" {...pageTransition}>
        {/* Back link */}
        <button
          onClick={() => navigate('/app/casos')}
          className="flex items-center gap-1.5 text-sm text-neutral hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Volver a casos
        </button>

        {/* Read-only banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Lock className="text-amber-600 shrink-0" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Caso de ejemplo &mdash; solo lectura
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Puedes explorar el caso pero no modificar los datos. Usa el boton &ldquo;Usar como plantilla&rdquo; para crear una copia editable.
            </p>
          </div>
        </div>

        <motion.div className="space-y-8" {...staggerContainer}>
          {/* ─── 1. Ficha del negocio ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={Building2} title="Ficha del negocio">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DLItem label="Nombre" value={company.name} />
                <DLItem label="Sector" value={company.sector} />
                <DLItem label="Ciudad" value={company.city} />
                <DLItem label="Fundado en" value={company.fundadoEn} />
                <DLItem label="Empleados" value={stage1.businessProfile.empleados} />
                <DLItem label="Tipo de relacion" value={company.tipoRelacion} />
                <DLItem
                  label="Productos / Servicios"
                  value={stage1.businessProfile.productosServicios}
                  full
                />
                <DLItem
                  label="Por que se fundo"
                  value={stage1.businessProfile.porQueSeFundo}
                  full
                />
              </dl>
            </SectionCard>
          </motion.div>

          {/* ─── 2. Reto estratégico ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={Target} title="Reto estrategico">
              <p className="text-foreground/80 leading-relaxed">
                {stage4.strategicChallenge || 'No definido en este caso.'}
              </p>
            </SectionCard>
          </motion.div>

          {/* ─── 3. Círculo Dorado ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={CircleDot} title="Circulo Dorado">
              <div className="space-y-4">
                <GoldenCircleRow
                  ring="WHY"
                  text={stage4.goldenCircle.why}
                  color="bg-accent/10 text-accent"
                />
                <GoldenCircleRow
                  ring="HOW"
                  text={stage4.goldenCircle.how}
                  color="bg-secondary/10 text-secondary"
                />
                <GoldenCircleRow
                  ring="WHAT"
                  text={stage4.goldenCircle.what}
                  color="bg-neutral/10 text-neutral"
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* ─── 4. Posición en el Reloj Estratégico ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={Radar} title="Posicion en el Reloj Estrategico">
              {company.stages.stage3.strategicClock.segment > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-lg">
                      {company.stages.stage3.strategicClock.segment}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {CLOCK_LABELS[company.stages.stage3.strategicClock.segment] ?? 'Posicion desconocida'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {company.stages.stage3.strategicClock.justification}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral italic">
                  Posicion en el reloj estrategico no definida para este caso.
                </p>
              )}
            </SectionCard>
          </motion.div>

          {/* ─── 5. Radar Organizacional ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={Radar} title="Radar Organizacional">
              {stage4.radar.length > 0 ? (
                <div className="space-y-2">
                  {stage4.radar.map((r) => (
                    <div key={r.category} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-52 shrink-0">
                        {r.category}
                      </span>
                      <div className="flex-1 bg-neutral-lighter rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-accent rounded-full h-2.5 transition-all"
                          style={{ width: `${(r.value / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-6 text-right">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral italic">
                  Datos del radar no disponibles para este caso.
                </p>
              )}
            </SectionCard>
          </motion.div>

          {/* ─── 6. Propuesta de valor (Ad-Lib) ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={MessageSquareQuote} title="Propuesta de valor (Ad-Lib)">
              {stage5.adLib.productosServicios ? (
                <p className="text-foreground/80 leading-relaxed">
                  Nuestros <strong>{stage5.adLib.productosServicios}</strong> ayudan a{' '}
                  <strong>{stage5.adLib.segmento}</strong> que quieren{' '}
                  <strong>{stage5.adLib.tarea}</strong> reduciendo{' '}
                  <strong>{stage5.adLib.frustracion}</strong> y generando{' '}
                  <strong>{stage5.adLib.alegria}</strong>, a diferencia de{' '}
                  <strong>{stage5.adLib.competidor}</strong>.
                </p>
              ) : (
                <p className="text-sm text-neutral italic">
                  Propuesta de valor no definida para este caso.
                </p>
              )}
            </SectionCard>
          </motion.div>

          {/* ─── 7. Hoja de ruta ─── */}
          <motion.div {...staggerItem}>
            <SectionCard icon={Map} title="Hoja de ruta">
              {stage6.roadmap.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-lighter text-left">
                        <th className="pb-2 pr-4 font-medium text-neutral">Accion</th>
                        <th className="pb-2 pr-4 font-medium text-neutral">Responsable</th>
                        <th className="pb-2 pr-4 font-medium text-neutral">Plazo</th>
                        <th className="pb-2 font-medium text-neutral">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage6.roadmap.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-lighter/50">
                          <td className="py-2.5 pr-4 text-foreground">{item.action}</td>
                          <td className="py-2.5 pr-4 text-foreground/70">{item.responsible}</td>
                          <td className="py-2.5 pr-4">
                            <TimelineBadge timeline={item.timeline} />
                          </td>
                          <td className="py-2.5">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-neutral italic">
                  Hoja de ruta no definida para este caso.
                </p>
              )}
            </SectionCard>
          </motion.div>

          {/* ─── Use as template button ─── */}
          <motion.div {...staggerItem} className="flex justify-center pt-4 pb-8">
            <Button onClick={handleUseAsTemplate} size="lg">
              <Copy size={18} />
              Usar como plantilla
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </FreemiumGate>
  )
}

/* ─── Helper components ─── */

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon size={20} className="text-accent shrink-0" />
        <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

function DLItem({
  label,
  value,
  full = false,
}: {
  label: string
  value: string
  full?: boolean
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-xs text-neutral mb-0.5">{label}</dt>
      <dd className="text-sm text-foreground">{value || '---'}</dd>
    </div>
  )
}

function GoldenCircleRow({
  ring,
  text,
  color,
}: {
  ring: string
  text: string
  color: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`shrink-0 inline-flex items-center justify-center w-14 h-7 rounded-full text-xs font-bold ${color}`}
      >
        {ring}
      </span>
      <p className="text-sm text-foreground/80 leading-relaxed">{text || '---'}</p>
    </div>
  )
}

function TimelineBadge({ timeline }: { timeline: string }) {
  const styles: Record<string, string> = {
    corto: 'bg-green-100 text-green-700',
    mediano: 'bg-amber-100 text-amber-700',
    largo: 'bg-blue-100 text-blue-700',
  }
  const labels: Record<string, string> = {
    corto: 'Corto',
    mediano: 'Mediano',
    largo: 'Largo',
  }
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[timeline] ?? 'bg-neutral-lighter text-neutral'}`}
    >
      {labels[timeline] ?? timeline}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completado: 'bg-green-100 text-green-700',
    en_progreso: 'bg-amber-100 text-amber-700',
    pendiente: 'bg-neutral-lighter text-neutral',
  }
  const labels: Record<string, string> = {
    completado: 'Completado',
    en_progreso: 'En progreso',
    pendiente: 'Pendiente',
  }
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-neutral-lighter text-neutral'}`}
    >
      {labels[status] ?? status}
    </span>
  )
}
