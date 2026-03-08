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
  onChange: (field: keyof AdLibData, value: string) => void
}

function InlineField({ value, field, placeholder, onChange }: InlineFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className="inline-block border-b-2 border-accent/40 bg-transparent px-1 py-0.5 text-foreground font-body text-base focus:outline-none focus:border-accent transition-colors min-w-[120px] max-w-[200px]"
      style={{ width: `${Math.max(120, (value.length + placeholder.length / 2) * 8)}px` }}
    />
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

      <div className="bg-neutral-lighter/50 rounded-xl p-6 md:p-8 leading-loose text-base font-body text-foreground">
        <span>Nuestros </span>
        <InlineField
          value={data.productosServicios}
          field="productosServicios"
          placeholder="productos/servicios"
          onChange={handleFieldChange}
        />
        <span> ayudan a </span>
        <InlineField
          value={data.segmento}
          field="segmento"
          placeholder="segmento"
          onChange={handleFieldChange}
        />
        <span> que quieren </span>
        <InlineField
          value={data.tarea}
          field="tarea"
          placeholder="tarea del cliente"
          onChange={handleFieldChange}
        />
        <span> al reducir/evitar </span>
        <InlineField
          value={data.frustracion}
          field="frustracion"
          placeholder="frustración"
          onChange={handleFieldChange}
        />
        <span> y al mejorar/lograr </span>
        <InlineField
          value={data.alegria}
          field="alegria"
          placeholder="alegría"
          onChange={handleFieldChange}
        />
        <span>, a diferencia de </span>
        <InlineField
          value={data.competidor}
          field="competidor"
          placeholder="competidor"
          onChange={handleFieldChange}
        />
        <span>.</span>
      </div>
    </Card>
  )
}
