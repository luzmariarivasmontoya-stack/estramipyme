import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element to restore later
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'

      // Focus the modal or its first interactive element
      requestAnimationFrame(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (firstFocusable) {
          firstFocusable.focus()
        } else {
          modalRef.current?.focus()
        }
      })
    }
    return () => {
      document.body.style.overflow = ''
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Modal'}
            tabIndex={-1}
            className={`relative bg-white rounded-xl shadow-modal w-full ${sizeClasses[size]} p-6 z-10 max-h-[90vh] overflow-y-auto`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button (always visible) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-lg text-neutral hover:text-foreground hover:bg-neutral-lighter transition-colors cursor-pointer z-10"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            {title && (
              <div className="mb-4 pr-12">
                <h2 className="text-xl font-heading text-foreground">{title}</h2>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
