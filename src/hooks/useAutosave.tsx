import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved'

interface AutosaveContextValue {
  saveStatus: SaveStatus
  triggerSave: () => void
}

const AutosaveContext = createContext<AutosaveContextValue | null>(null)

export function AutosaveProvider({ children }: { children: ReactNode }) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSave = useCallback(() => {
    // Clear any existing timeouts to avoid overlapping transitions
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setSaveStatus('saving')

    timeoutRef.current = setTimeout(() => {
      setSaveStatus('saved')

      timeoutRef.current = setTimeout(() => {
        setSaveStatus('idle')
        timeoutRef.current = null
      }, 1500)
    }, 300)
  }, [])

  return (
    <AutosaveContext.Provider value={{ saveStatus, triggerSave }}>
      {children}
    </AutosaveContext.Provider>
  )
}

export function useAutosave(): AutosaveContextValue {
  const context = useContext(AutosaveContext)
  if (!context) {
    throw new Error('useAutosave must be used within an AutosaveProvider')
  }
  return context
}
