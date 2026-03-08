import { useReducer, useEffect, type Reducer } from 'react'

export function usePersistedReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string
): [S, React.Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // Storage full or unavailable
    }
  }, [storageKey, state])

  return [state, dispatch]
}
