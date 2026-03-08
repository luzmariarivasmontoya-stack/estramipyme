import { Cloud, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAutosave } from '@/hooks/useAutosave'

export function AutosaveIndicator() {
  const { saveStatus } = useAutosave()

  return (
    <AnimatePresence mode="wait">
      {saveStatus === 'saving' && (
        <motion.div
          key="saving"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-neutral"
        >
          <Cloud size={14} className="animate-spin" />
          <span className="text-xs font-body">Guardando...</span>
        </motion.div>
      )}

      {saveStatus === 'saved' && (
        <motion.div
          key="saved"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-secondary"
        >
          <Check size={14} />
          <span className="text-xs font-body">Guardado</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
