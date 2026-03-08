import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Users,
  Calendar,
  Briefcase,
  FileText,
  Handshake,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { useCompany } from '@/hooks/useCompany'
import { createEmptyCompany } from '@/reducers/companyReducer'
import { pageTransition } from '@/utils/animations'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  name: string
  sector: string
  fundadoEn: string
  empleados: '1' | '2-3' | '4-9' | '10-49' | '50+'
  description: string
  size: 'micro' | 'pequena' | 'mediana'
  tipoRelacion: 'B2B' | 'B2C' | 'B2B2C'
  motivacion: 'oportunidad' | 'necesidad' | 'otro'
  motivacionOtro: string
}

type StepErrors = Partial<Record<keyof FormData, string>>

const STEPS = ['Datos basicos', 'Contexto', 'Confirmacion'] as const

const SECTOR_OPTIONS = [
  'Tecnologia',
  'Alimentos',
  'Comercio',
  'Servicios',
  'Manufactura',
  'Educacion',
  'Salud',
  'Construccion',
  'Otro',
]

const EMPLEADOS_OPTIONS: { value: FormData['empleados']; label: string }[] = [
  { value: '1', label: '1 persona' },
  { value: '2-3', label: '2-3' },
  { value: '4-9', label: '4-9' },
  { value: '10-49', label: '10-49' },
  { value: '50+', label: '50+' },
]

const SIZE_OPTIONS: { value: FormData['size']; label: string }[] = [
  { value: 'micro', label: 'Micronegocio' },
  { value: 'pequena', label: 'Pequena empresa' },
  { value: 'mediana', label: 'Mediana empresa' },
]

const RELACION_OPTIONS: { value: FormData['tipoRelacion']; label: string }[] = [
  { value: 'B2B', label: 'B2B (Venta a otras empresas)' },
  { value: 'B2C', label: 'B2C (Venta a consumidor final)' },
  { value: 'B2B2C', label: 'B2B+B2C (Ambos)' },
]

const MOTIVACION_OPTIONS: { value: FormData['motivacion']; label: string }[] = [
  { value: 'oportunidad', label: 'Identifico una oportunidad' },
  { value: 'necesidad', label: 'No tenia otra alternativa de ingresos' },
  { value: 'otro', label: 'Otro' },
]

/* ------------------------------------------------------------------ */
/*  Shared classes                                                     */
/* ------------------------------------------------------------------ */

const inputClasses =
  'w-full rounded-lg border border-neutral-light bg-white px-4 py-2.5 text-foreground font-body text-sm placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors'

const labelClasses = 'block text-sm font-medium text-foreground mb-1.5'

const errorClasses = 'text-error text-xs mt-1'

/* ------------------------------------------------------------------ */
/*  Slide animation variants                                           */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = currentStep > stepNum
          const isCurrent = currentStep === stepNum

          return (
            <div key={label} className="flex flex-1 items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-300
                    ${isCompleted ? 'bg-secondary text-white' : ''}
                    ${isCurrent ? 'bg-accent text-white shadow-md' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-neutral-lighter text-neutral' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-accent' : isCompleted ? 'text-secondary' : 'text-neutral'
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="mx-3 mt-[-1.25rem] h-0.5 flex-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentStep > stepNum ? 'bg-secondary' : 'bg-neutral-lighter'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Radio Group component                                              */
/* ------------------------------------------------------------------ */

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`
            flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-body transition-all
            ${
              value === opt.value
                ? 'border-accent bg-accent/5 text-accent ring-1 ring-accent/30'
                : 'border-neutral-light bg-white text-foreground hover:border-accent/40'
            }
          `}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
              value === opt.value ? 'border-accent' : 'border-neutral-light'
            }`}
          >
            {value === opt.value && <span className="h-2 w-2 rounded-full bg-accent" />}
          </span>
          {opt.label}
        </label>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function NewCompany() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { dispatchCompany, setCurrentCompanyId } = useCompany()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState<StepErrors>({})

  const [formData, setFormData] = useState<FormData>({
    name: '',
    sector: '',
    fundadoEn: '',
    empleados: '1',
    description: '',
    size: 'micro',
    tipoRelacion: 'B2C',
    motivacion: 'oportunidad',
    motivacionOtro: '',
  })

  /* ---- helpers ---- */

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  /* ---- validation per step ---- */

  const validateStep = (s: number): boolean => {
    const newErrors: StepErrors = {}

    if (s === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre del negocio es obligatorio'
      }
      if (!formData.sector) {
        newErrors.sector = 'Selecciona un sector'
      }
    }

    if (s === 2) {
      if (!formData.description.trim()) {
        newErrors.description = 'La descripcion es obligatoria'
      }
      if (formData.description.length > 200) {
        newErrors.description = 'Maximo 200 caracteres'
      }
      if (formData.motivacion === 'otro' && !formData.motivacionOtro.trim()) {
        newErrors.motivacionOtro = 'Describe tu motivacion'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isStepValid = (s: number): boolean => {
    if (s === 1) {
      return formData.name.trim().length > 0 && formData.sector.length > 0
    }
    if (s === 2) {
      const descOk = formData.description.trim().length > 0 && formData.description.length <= 200
      const motOk = formData.motivacion !== 'otro' || formData.motivacionOtro.trim().length > 0
      return descOk && motOk
    }
    return true
  }

  /* ---- navigation ---- */

  const goNext = () => {
    if (!validateStep(step)) return
    setDirection(1)
    setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    setErrors({})
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  /* ---- submit ---- */

  const handleSubmit = () => {
    if (!user) return

    const motivacionText =
      formData.motivacion === 'oportunidad'
        ? 'Identifico una oportunidad'
        : formData.motivacion === 'necesidad'
          ? 'No tenia otra alternativa de ingresos'
          : formData.motivacionOtro.trim()

    const company = createEmptyCompany(user.id, {
      name: formData.name.trim(),
      sector: formData.sector,
      size: formData.size,
      city: '',
      description: formData.description.trim(),
      fundadoEn: formData.fundadoEn.trim(),
      empleados: formData.empleados,
      tipoRelacion: formData.tipoRelacion,
      motivacion: motivacionText,
    })

    dispatchCompany({ type: 'ADD_COMPANY', payload: company })
    setCurrentCompanyId(company.id)
    navigate('/app/etapa/1')
  }

  /* ---------------------------------------------------------------- */
  /*  Step 1 — Datos basicos                                          */
  /* ---------------------------------------------------------------- */

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Nombre */}
      <div>
        <label htmlFor="company-name" className={labelClasses}>
          <Building2 size={14} className="mr-1.5 inline-block text-accent" />
          Nombre del negocio <span className="text-error">*</span>
        </label>
        <input
          id="company-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ej: Mi Empresa S.A.S."
          className={`${inputClasses} ${errors.name ? 'border-error focus:ring-error/40' : ''}`}
        />
        {errors.name && <p className={errorClasses}>{errors.name}</p>}
      </div>

      {/* Sector */}
      <div>
        <label htmlFor="company-sector" className={labelClasses}>
          <Briefcase size={14} className="mr-1.5 inline-block text-accent" />
          Sector / industria <span className="text-error">*</span>
        </label>
        <select
          id="company-sector"
          value={formData.sector}
          onChange={(e) => handleChange('sector', e.target.value)}
          className={`${inputClasses} ${errors.sector ? 'border-error focus:ring-error/40' : ''}`}
        >
          <option value="">Selecciona un sector...</option>
          {SECTOR_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.sector && <p className={errorClasses}>{errors.sector}</p>}
      </div>

      {/* Año de fundación */}
      <div>
        <label htmlFor="company-fundado" className={labelClasses}>
          <Calendar size={14} className="mr-1.5 inline-block text-accent" />
          Ano de fundacion
        </label>
        <input
          id="company-fundado"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={formData.fundadoEn}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4)
            handleChange('fundadoEn', v)
          }}
          placeholder="Ej: 2018"
          className={inputClasses}
        />
      </div>

      {/* Número de empleados */}
      <div>
        <span className={labelClasses}>
          <Users size={14} className="mr-1.5 inline-block text-accent" />
          Numero de empleados
        </span>
        <RadioGroup
          name="empleados"
          options={EMPLEADOS_OPTIONS}
          value={formData.empleados}
          onChange={(v) => handleChange('empleados', v)}
        />
      </div>
    </div>
  )

  /* ---------------------------------------------------------------- */
  /*  Step 2 — Contexto del negocio                                   */
  /* ---------------------------------------------------------------- */

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Descripción */}
      <div>
        <label htmlFor="company-description" className={labelClasses}>
          <FileText size={14} className="mr-1.5 inline-block text-accent" />
          Descripcion corta del negocio <span className="text-error">*</span>
        </label>
        <textarea
          id="company-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Breve descripcion de la empresa y su actividad principal..."
          rows={3}
          maxLength={200}
          className={`${inputClasses} resize-none ${errors.description ? 'border-error focus:ring-error/40' : ''}`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description ? (
            <p className={errorClasses}>{errors.description}</p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${
              formData.description.length > 200 ? 'text-error' : 'text-neutral'
            }`}
          >
            {formData.description.length}/200
          </span>
        </div>
      </div>

      {/* Tipo de negocio */}
      <div>
        <span className={labelClasses}>
          <Building2 size={14} className="mr-1.5 inline-block text-accent" />
          Tipo de negocio
        </span>
        <RadioGroup
          name="size"
          options={SIZE_OPTIONS}
          value={formData.size}
          onChange={(v) => handleChange('size', v)}
        />
      </div>

      {/* Tipo de relación */}
      <div>
        <span className={labelClasses}>
          <Handshake size={14} className="mr-1.5 inline-block text-accent" />
          Tipo de relacion con clientes
        </span>
        <RadioGroup
          name="tipoRelacion"
          options={RELACION_OPTIONS}
          value={formData.tipoRelacion}
          onChange={(v) => handleChange('tipoRelacion', v)}
        />
      </div>

      {/* Motivación */}
      <div>
        <span className={labelClasses}>
          <Lightbulb size={14} className="mr-1.5 inline-block text-accent" />
          Motivacion
        </span>
        <RadioGroup
          name="motivacion"
          options={MOTIVACION_OPTIONS}
          value={formData.motivacion}
          onChange={(v) => handleChange('motivacion', v)}
        />
        <AnimatePresence>
          {formData.motivacion === 'otro' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                value={formData.motivacionOtro}
                onChange={(e) => handleChange('motivacionOtro', e.target.value)}
                placeholder="Describe tu motivacion..."
                className={`${inputClasses} mt-3 ${errors.motivacionOtro ? 'border-error focus:ring-error/40' : ''}`}
              />
              {errors.motivacionOtro && (
                <p className={errorClasses}>{errors.motivacionOtro}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  /* ---------------------------------------------------------------- */
  /*  Step 3 — Confirmación                                           */
  /* ---------------------------------------------------------------- */

  const motivacionLabel =
    formData.motivacion === 'oportunidad'
      ? 'Identifico una oportunidad'
      : formData.motivacion === 'necesidad'
        ? 'No tenia otra alternativa de ingresos'
        : formData.motivacionOtro || 'Otro'

  const sizeLabel =
    formData.size === 'micro'
      ? 'Micronegocio'
      : formData.size === 'pequena'
        ? 'Pequena empresa'
        : 'Mediana empresa'

  const relacionLabel =
    formData.tipoRelacion === 'B2B'
      ? 'B2B'
      : formData.tipoRelacion === 'B2C'
        ? 'B2C'
        : 'B2B+B2C'

  const empleadosLabel =
    formData.empleados === '1' ? '1 persona' : formData.empleados

  const summaryItems: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Building2 size={16} className="text-accent" />, label: 'Nombre', value: formData.name },
    { icon: <Briefcase size={16} className="text-accent" />, label: 'Sector', value: formData.sector },
    { icon: <Calendar size={16} className="text-accent" />, label: 'Fundado en', value: formData.fundadoEn || '—' },
    { icon: <Users size={16} className="text-accent" />, label: 'Empleados', value: empleadosLabel },
    { icon: <FileText size={16} className="text-accent" />, label: 'Descripcion', value: formData.description || '—' },
    { icon: <Building2 size={16} className="text-accent" />, label: 'Tipo de negocio', value: sizeLabel },
    { icon: <Handshake size={16} className="text-accent" />, label: 'Relacion con clientes', value: relacionLabel },
    { icon: <Lightbulb size={16} className="text-accent" />, label: 'Motivacion', value: motivacionLabel },
  ]

  const renderStep3 = () => (
    <div className="space-y-4">
      <p className="text-neutral text-sm mb-2">
        Revisa que toda la informacion sea correcta antes de crear tu empresa.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-light bg-white p-4 shadow-card"
          >
            <div className="flex items-center gap-2 mb-1">
              {item.icon}
              <span className="text-xs font-medium text-neutral uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className="text-sm text-foreground font-body leading-relaxed break-words">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const stepRenderers = [renderStep1, renderStep2, renderStep3]

  return (
    <motion.div className="max-w-2xl mx-auto px-4 py-8" {...pageTransition}>
      {/* Back to dashboard */}
      <button
        type="button"
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-neutral hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al panel</span>
      </button>

      {/* Heading */}
      <h1 className="font-heading text-3xl text-foreground mb-2">Nueva Empresa</h1>
      <p className="text-neutral mb-8">
        Completa la informacion en 3 pasos para comenzar el proceso estrategico.
      </p>

      {/* Progress Bar */}
      <ProgressBar currentStep={step} />

      {/* Step Content with animations */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {stepRenderers[step - 1]()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-neutral-lighter">
        <div>
          {step > 1 && (
            <Button variant="ghost" size="lg" onClick={goBack}>
              <ArrowLeft size={18} />
              Atras
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/app')}
          >
            Cancelar
          </Button>

          {step < 3 ? (
            <Button
              size="lg"
              onClick={goNext}
              disabled={!isStepValid(step)}
            >
              Siguiente
              <ArrowRight size={18} />
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit}>
              <Check size={18} />
              Crear empresa y comenzar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
