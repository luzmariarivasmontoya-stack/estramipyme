import { ShieldAlert, Sparkles } from 'lucide-react'

interface RiskOpportunitySynthesisProps {
  principalRiesgo: string
  principalOportunidad: string
  onChange: (field: 'principalRiesgo' | 'principalOportunidad', value: string) => void
}

export function RiskOpportunitySynthesis({
  principalRiesgo,
  principalOportunidad,
  onChange,
}: RiskOpportunitySynthesisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Principal Riesgo */}
      <div className="rounded-xl border-2 border-rose-200 bg-rose-50/60 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100">
            <ShieldAlert size={18} className="text-rose-600" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-rose-800">
              Principal Riesgo
            </h4>
            <p className="text-xs text-rose-600 font-body">
              Resume el riesgo mas importante identificado en las megatendencias
            </p>
          </div>
        </div>
        <textarea
          value={principalRiesgo}
          onChange={(e) => onChange('principalRiesgo', e.target.value)}
          placeholder="Describe el principal riesgo que enfrentas..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white
            text-foreground font-body text-sm placeholder:text-rose-300 resize-y
            focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
        />
      </div>

      {/* Principal Oportunidad */}
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
            <Sparkles size={18} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-emerald-800">
              Principal Oportunidad
            </h4>
            <p className="text-xs text-emerald-600 font-body">
              Resume la oportunidad mas importante identificada en las megatendencias
            </p>
          </div>
        </div>
        <textarea
          value={principalOportunidad}
          onChange={(e) => onChange('principalOportunidad', e.target.value)}
          placeholder="Describe la principal oportunidad que identificas..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white
            text-foreground font-body text-sm placeholder:text-emerald-300 resize-y
            focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
        />
      </div>
    </div>
  )
}
