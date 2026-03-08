import { Card } from '@/components/common/Card'
import type { AdLibData } from '@/types/stages'

interface AdLibTemplateProps {
  data: AdLibData
  onChange: (data: AdLibData) => void
}

interface InlineFieldProps {
  value: string
  field: keyof AdLibData
  placeholder: string
  label: string
  onChange: (field: keyof AdLibData, value: string) => void
}

function InlineField({ value, field, placeholder, label, onChange }: InlineFieldProps) {
  return (
    <span className="inline-flex flex-col gap-[6px] align-bottom mx-0.5">
      <label className="text-sm font-semibold text-[#4A4A4A] font-body">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="inline-block px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none min-w-[120px] max-w-[220px]"
        style={{ width: `${Math.max(120, (value.length + placeholder.length / 2) * 8)}px` }}
      />
    </span>
  )
}

export function AdLibTemplate({ data, onChange }: AdLibTemplateProps) {
  const handleFieldChange = (field: keyof AdLibData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <h4 className="font-heading font-semibold text-foreground mb-2">
        Plantilla Ad-Lib
      </h4>
      <p className="text-sm text-neutral font-body mb-6">
        Complete los espacios en blanco para articular su propuesta de valor de forma clara
        y concisa. Esta fórmula le ayuda a comunicar su diferenciación.
      </p>

      <div className="bg-neutral-lighter/50 rounded-xl p-6 md:p-8 leading-loose text-base font-body text-foreground flex flex-wrap items-end gap-y-[20px]">
        <span className="self-end pb-[10px]">Nuestros </span>
        <InlineField
          value={data.productosServicios}
          field="productosServicios"
          placeholder="productos/servicios"
          label="Productos / Servicios"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]"> ayudan a </span>
        <InlineField
          value={data.segmento}
          field="segmento"
          placeholder="segmento"
          label="Segmento"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]"> que quieren </span>
        <InlineField
          value={data.tarea}
          field="tarea"
          placeholder="tarea del cliente"
          label="Tarea del cliente"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]"> al reducir/evitar </span>
        <InlineField
          value={data.frustracion}
          field="frustracion"
          placeholder="frustración"
          label="Frustración"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]"> y al mejorar/lograr </span>
        <InlineField
          value={data.alegria}
          field="alegria"
          placeholder="alegría"
          label="Alegría"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]">, a diferencia de </span>
        <InlineField
          value={data.competidor}
          field="competidor"
          placeholder="competidor"
          label="Competidor"
          onChange={handleFieldChange}
        />
        <span className="self-end pb-[10px]">.</span>
      </div>
    </Card>
  )
}
