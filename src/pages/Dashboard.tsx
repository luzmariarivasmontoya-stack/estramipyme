import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Building2, MapPin, Sparkles, ArrowRight, FolderOpen, Clock, CheckCircle2, Circle, Compass, Users, BarChart3, Puzzle, Lightbulb, Flag } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { useAuth } from '@/hooks/useAuth'
import { useCompany } from '@/hooks/useCompany'
import { useFreemium } from '@/hooks/useFreemium'
import { AppContext } from '@/context/AppContext'
import { STAGES } from '@/utils/constants'
import { staggerContainer, staggerItem } from '@/utils/animations'

const stageIcons: Record<number, React.ElementType> = {
  1: Compass,
  2: Users,
  3: BarChart3,
  4: Puzzle,
  5: Lightbulb,
  6: Flag,
}

const sizeLabels: Record<string, string> = {
  micro: 'Micro',
  pequena: 'Pequeña',
  mediana: 'Mediana',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface StageActivity {
  stageNumber: number
  stageName: string
  hasData: boolean
}

function getStageActivities(company: { currentStage: number; stages: Record<string, unknown>; updatedAt: string }): StageActivity[] {
  const stageNames = ['Explorar', 'Conocer', 'Analizar', 'Integrar', 'Facilitar', 'Consolidar']

  return stageNames.map((name, index) => {
    const stageKey = `stage${index + 1}` as string
    const stageData = company.stages[stageKey]
    let hasData = false

    if (stageData && typeof stageData === 'object') {
      hasData = Object.values(stageData as Record<string, unknown>).some((value) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'string') return value.trim().length > 0
        if (typeof value === 'object' && value !== null) {
          return Object.values(value as Record<string, unknown>).some(
            (v) => v !== '' && v !== null && v !== 0
          )
        }
        return false
      })
    }

    return {
      stageNumber: index + 1,
      stageName: name,
      hasData,
    }
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { companies, setCurrentCompanyId } = useCompany()
  const { isPro, canCreateCompany } = useFreemium()
  const appContext = useContext(AppContext)

  const userCompanies = companies.filter((c) => c.ownerId === user?.id)

  const handleCompanyClick = (companyId: string) => {
    setCurrentCompanyId(companyId)
    navigate('/app/etapa/1')
  }

  const handleCreateClick = () => {
    if (canCreateCompany) {
      navigate('/app/nueva-empresa')
    } else {
      appContext?.setUpgradeModalOpen(true)
    }
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pro upgrade banner */}
      {!isPro && (
        <motion.div
          className="mb-6 bg-accent/5 border border-accent/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-accent shrink-0" />
            <p className="text-sm text-foreground">
              Desbloquea las 6 etapas con <span className="font-semibold">Plan Pro</span>
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => appContext?.setUpgradeModalOpen(true)}
          >
            Actualizar
          </Button>
        </motion.div>
      )}

      {/* Page heading */}
      <h1 className="font-heading text-3xl text-foreground mb-8">Panel de Control</h1>

      {/* Empty state */}
      {userCompanies.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center py-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-neutral-lighter flex items-center justify-center mb-6">
            <FolderOpen size={36} className="text-neutral" />
          </div>
          <h2 className="font-heading text-xl text-foreground mb-2">
            No tienes empresas todavia
          </h2>
          <p className="text-neutral max-w-md mb-8">
            Crea tu primera empresa para comenzar el proceso de estrategia digital con la
            metodologia Estramipyme.
          </p>
          <Button size="lg" onClick={() => navigate('/app/nueva-empresa')}>
            <Plus size={20} />
            Crear empresa
          </Button>
        </motion.div>
      ) : (
        /* Company grid */
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {userCompanies.map((company) => {
            const currentStage = STAGES[company.currentStage - 1]
            const progressPercent = Math.round((company.currentStage / 6) * 100)

            return (
              <motion.div key={company.id} variants={staggerItem}>
                <Card hover onClick={() => handleCompanyClick(company.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Building2 size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-foreground leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-neutral text-sm">{company.sector}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-neutral-lighter text-neutral px-2 py-1 rounded-full whitespace-nowrap">
                      {sizeLabels[company.size] || company.size}
                    </span>
                  </div>

                  {company.city && (
                    <div className="flex items-center gap-1.5 text-sm text-neutral mb-4">
                      <MapPin size={14} />
                      <span>{company.city}</span>
                    </div>
                  )}

                  {/* Stage progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground">
                        Etapa {company.currentStage}: {currentStage?.name}
                      </span>
                      <span className="text-xs text-neutral">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-lighter">
                    <span className="text-xs text-neutral">
                      Actualizado: {formatDate(company.updatedAt)}
                    </span>
                    <ArrowRight size={16} className="text-accent" />
                  </div>
                </Card>
              </motion.div>
            )
          })}

          {/* Create new company card */}
          <motion.div variants={staggerItem}>
            <Card
              hover
              onClick={handleCreateClick}
              className="border-2 border-dashed border-neutral-light flex flex-col items-center justify-center min-h-[220px] bg-transparent"
            >
              {canCreateCompany ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Plus size={24} className="text-accent" />
                  </div>
                  <span className="font-medium text-foreground">Crear nueva empresa</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-neutral-lighter flex items-center justify-center mb-3">
                    <Sparkles size={24} className="text-neutral" />
                  </div>
                  <span className="font-medium text-foreground mb-1">
                    Limite alcanzado
                  </span>
                  <span className="text-xs text-neutral text-center">
                    Actualiza a Pro para crear mas empresas
                  </span>
                </>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Últimas actividades */}
      {userCompanies.length > 0 && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="font-heading text-xl text-foreground mb-4">Últimas actividades</h2>
          <Card>
            <div className="space-y-6">
              {userCompanies.map((company) => {
                const activities = getStageActivities(company)
                const stagesWithData = activities.filter((a) => a.hasData)

                return (
                  <div key={company.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 size={16} className="text-accent" />
                      <h3 className="font-heading text-base text-foreground">{company.name}</h3>
                      <span className="text-xs text-neutral ml-auto flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(company.updatedAt)}
                      </span>
                    </div>

                    {stagesWithData.length === 0 ? (
                      <p className="text-sm text-neutral pl-6">Sin actividad registrada aún.</p>
                    ) : (
                      <ul className="space-y-2 pl-1">
                        {activities.map((activity) => {
                          const Icon = stageIcons[activity.stageNumber]
                          return (
                            <li key={activity.stageNumber} className="flex items-center gap-3 text-sm">
                              {activity.hasData ? (
                                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                              ) : (
                                <Circle size={16} className="text-neutral-light shrink-0" />
                              )}
                              <div className="flex items-center gap-2">
                                {Icon && <Icon size={14} className={activity.hasData ? 'text-foreground' : 'text-neutral'} />}
                                <span className={activity.hasData ? 'text-foreground font-medium' : 'text-neutral'}>
                                  Etapa {activity.stageNumber}: {activity.stageName}
                                </span>
                              </div>
                              {activity.hasData && activity.stageNumber <= company.currentStage && (
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full ml-auto">
                                  Con datos
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    {userCompanies.length > 1 && (
                      <div className="border-b border-neutral-lighter mt-4" />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
