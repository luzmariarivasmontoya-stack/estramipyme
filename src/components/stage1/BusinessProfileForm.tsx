import type { BusinessProfile } from '@/types/stages'

interface BusinessProfileFormProps {
  data: BusinessProfile
  onChange: (updated: BusinessProfile) => void
}

const ingresoOptions = [
  { value: '', label: 'Seleccione un rango...' },
  { value: 'menos_1m', label: 'Menos de $1M' },
  { value: '1m_5m', label: '$1M - $5M' },
  { value: '5m_20m', label: '$5M - $20M' },
  { value: '20m_50m', label: '$20M - $50M' },
  { value: 'mas_50m', label: 'Más de $50M' },
]

export function BusinessProfileForm({ data, onChange }: BusinessProfileFormProps) {
  const handleChange = (key: keyof BusinessProfile, value: string | boolean | null) => {
    onChange({ ...data, [key]: value })
  }

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-neutral-lighter bg-white text-foreground font-body text-sm placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Por qué se fundó */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿Por qué se fundó la empresa?
        </label>
        <textarea
          value={data.porQueSeFundo}
          onChange={(e) => handleChange('porQueSeFundo', e.target.value)}
          placeholder="Describe la razón o motivación detrás de la fundación de la empresa..."
          rows={3}
          className={`${inputClasses} resize-y`}
        />
      </div>

      {/* 2. Cuándo y dónde */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿Cuándo y dónde se fundó?
        </label>
        <input
          type="text"
          value={data.cuandoYDonde}
          onChange={(e) => handleChange('cuandoYDonde', e.target.value)}
          placeholder="Ej: 2015, Bogotá, Colombia"
          className={inputClasses}
        />
      </div>

      {/* 3. Empleados */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿Cuántos empleados tiene?
        </label>
        <input
          type="text"
          value={data.empleados}
          onChange={(e) => handleChange('empleados', e.target.value)}
          placeholder="Ej: 12 empleados"
          className={inputClasses}
        />
      </div>

      {/* 4. Productos o servicios */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿Qué productos o servicios ofrece?
        </label>
        <textarea
          value={data.productosServicios}
          onChange={(e) => handleChange('productosServicios', e.target.value)}
          placeholder="Describe los principales productos o servicios que ofrece la empresa..."
          rows={3}
          className={`${inputClasses} resize-y`}
        />
      </div>

      {/* 5. Rango de ingresos */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿En qué rango están sus ingresos mensuales?
        </label>
        <select
          value={data.rangoIngresos}
          onChange={(e) => handleChange('rangoIngresos', e.target.value)}
          className={inputClasses}
        >
          {ingresoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Contabilidad formal */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground font-heading">
          ¿Lleva contabilidad formal?
        </label>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contabilidadFormal"
              checked={data.contabilidadFormal === true}
              onChange={() => handleChange('contabilidadFormal', true)}
              className="w-4 h-4 text-accent focus:ring-accent/30"
            />
            <span className="text-sm font-body text-foreground">Sí</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contabilidadFormal"
              checked={data.contabilidadFormal === false}
              onChange={() => handleChange('contabilidadFormal', false)}
              className="w-4 h-4 text-accent focus:ring-accent/30"
            />
            <span className="text-sm font-body text-foreground">No</span>
          </label>
        </div>
      </div>
    </div>
  )
}
