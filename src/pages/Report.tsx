import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useFreemium } from '@/hooks/useFreemium'
import ExportButton from '@/components/export/ExportButton'
import ReportTemplate from '@/components/export/ReportTemplate'

export default function Report() {
  const reportRef = useRef<HTMLDivElement>(null)
  const { currentCompany } = useCompany()
  const { isPro } = useFreemium()

  /* ---------------------------------------------------------------- */
  /*  Fallback when no company is selected                            */
  /* ---------------------------------------------------------------- */
  if (!currentCompany) {
    return (
      <motion.div
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-heading text-3xl text-foreground mb-8">
          Reporte Estrategico
        </h1>

        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 rounded-full bg-neutral-lighter flex items-center justify-center mb-6">
            <FileText size={36} className="text-neutral" />
          </div>
          <h2 className="font-heading text-xl text-foreground mb-2">
            No hay empresa seleccionada
          </h2>
          <p className="text-neutral max-w-md">
            Selecciona una empresa desde el panel de control para generar su
            reporte estrategico.
          </p>
        </div>
      </motion.div>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Main report view                                                */
  /* ---------------------------------------------------------------- */
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-heading text-3xl text-foreground">
          Reporte Estrategico
        </h1>

        <ExportButton
          targetRef={reportRef as React.RefObject<HTMLElement>}
          companyName={currentCompany.name}
        />
      </div>

      {/* Watermark notice for free users */}
      {!isPro && (
        <motion.div
          className="mb-6 bg-accent/5 border border-accent/20 rounded-xl px-5 py-4 flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AlertTriangle size={20} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            El PDF exportado incluira una marca de agua{' '}
            <span className="font-semibold">&quot;VERSION GRATUITA&quot;</span>.
            Actualiza al{' '}
            <span className="font-semibold text-accent">Plan Pro</span> para
            obtener reportes sin marca de agua.
          </p>
        </motion.div>
      )}

      {/* Report preview area */}
      <motion.div
        className="bg-white rounded-xl shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <ReportTemplate ref={reportRef} />
      </motion.div>
    </motion.div>
  )
}
