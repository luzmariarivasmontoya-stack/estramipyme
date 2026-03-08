import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { useCompany } from '@/hooks/useCompany'
import { createEmptyCompany } from '@/reducers/companyReducer'
import { pageTransition } from '@/utils/animations'

interface FormData {
  name: string
  sector: string
  size: 'micro' | 'pequena' | 'mediana'
  city: string
  description: string
  fundadoEn: string
  empleados: '1' | '2-3' | '4-9' | '10-49' | '50+'
  tipoRelacion: 'B2B' | 'B2C' | 'B2B2C'
  motivacion: string
}

export default function NewCompany() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { dispatchCompany, setCurrentCompanyId } = useCompany()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    sector: '',
    size: 'micro',
    city: '',
    description: '',
    fundadoEn: '',
    empleados: '1',
    tipoRelacion: 'B2C',
    motivacion: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la empresa es obligatorio'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || !user) return

    const company = createEmptyCompany(user.id, {
      name: formData.name.trim(),
      sector: formData.sector.trim(),
      size: formData.size,
      city: formData.city.trim(),
      description: formData.description.trim(),
      fundadoEn: formData.fundadoEn.trim(),
      empleados: formData.empleados,
      tipoRelacion: formData.tipoRelacion,
      motivacion: formData.motivacion.trim(),
    })

    dispatchCompany({ type: 'ADD_COMPANY', payload: company })
    setCurrentCompanyId(company.id)
    navigate('/app/etapa/1')
  }

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-neutral-light bg-white px-4 py-2.5 text-foreground font-body text-sm placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors'
  const labelClasses = 'block text-sm font-medium text-foreground mb-1.5'

  return (
    <motion.div className="max-w-2xl mx-auto px-4 py-8" {...pageTransition}>
      <button
        type="button"
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-neutral hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al panel</span>
      </button>

      <h1 className="font-heading text-3xl text-foreground mb-2">Nueva Empresa</h1>
      <p className="text-neutral mb-8">
        Completa la informacion basica para comenzar el proceso estrategico.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="company-name" className={labelClasses}>
            Nombre de la empresa <span className="text-error">*</span>
          </label>
          <input
            id="company-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Mi Empresa S.A.S."
            className={`${inputClasses} ${errors.name ? 'border-error focus:ring-error/40' : ''}`}
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Sector */}
        <div>
          <label htmlFor="company-sector" className={labelClasses}>
            Sector
          </label>
          <input
            id="company-sector"
            type="text"
            value={formData.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            placeholder="Ej: Tecnologia, Alimentos, Educacion"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Año de fundación */}
          <div>
            <label htmlFor="company-fundado" className={labelClasses}>
              Ano de fundacion
            </label>
            <input
              id="company-fundado"
              type="text"
              value={formData.fundadoEn}
              onChange={(e) => handleChange('fundadoEn', e.target.value)}
              placeholder="Ej: 2018"
              className={inputClasses}
            />
          </div>

          {/* Ciudad */}
          <div>
            <label htmlFor="company-city" className={labelClasses}>
              Ciudad
            </label>
            <input
              id="company-city"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ej: Medellin"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Empleados */}
          <div>
            <label htmlFor="company-empleados" className={labelClasses}>
              Numero de empleados
            </label>
            <select
              id="company-empleados"
              value={formData.empleados}
              onChange={(e) => handleChange('empleados', e.target.value)}
              className={inputClasses}
            >
              <option value="1">1 (solo yo)</option>
              <option value="2-3">2-3</option>
              <option value="4-9">4-9</option>
              <option value="10-49">10-49</option>
              <option value="50+">50+</option>
            </select>
          </div>

          {/* Tipo de relación */}
          <div>
            <label htmlFor="company-relacion" className={labelClasses}>
              Tipo de relacion comercial
            </label>
            <select
              id="company-relacion"
              value={formData.tipoRelacion}
              onChange={(e) => handleChange('tipoRelacion', e.target.value)}
              className={inputClasses}
            >
              <option value="B2C">B2C (Venta a consumidor final)</option>
              <option value="B2B">B2B (Venta a otras empresas)</option>
              <option value="B2B2C">B2B2C (Ambos)</option>
            </select>
          </div>
        </div>

        {/* Tamaño */}
        <div>
          <label htmlFor="company-size" className={labelClasses}>
            Tamano
          </label>
          <select
            id="company-size"
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className={inputClasses}
          >
            <option value="micro">Micro (1-10 empleados)</option>
            <option value="pequena">Pequena (11-50 empleados)</option>
            <option value="mediana">Mediana (51-200 empleados)</option>
          </select>
        </div>

        {/* Motivación */}
        <div>
          <label htmlFor="company-motivacion" className={labelClasses}>
            Motivacion para hacer este proceso estrategico
          </label>
          <textarea
            id="company-motivacion"
            value={formData.motivacion}
            onChange={(e) => handleChange('motivacion', e.target.value)}
            placeholder="¿Por que quieres hacer este proceso? ¿Que esperas lograr?"
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="company-description" className={labelClasses}>
            Descripcion
          </label>
          <textarea
            id="company-description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Breve descripcion de la empresa y su actividad principal..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" size="lg">
            Crear empresa
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate('/app')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
