import { useState, useCallback } from 'react'

const KEY = 'nany-guest-name'

// Guarda o nome do convidado neste navegador para não precisar digitar de novo.
export default function useGuestName() {
  const [name, setNameState] = useState(() => {
    try { return localStorage.getItem(KEY) || '' } catch { return '' }
  })
  const setName = useCallback((value) => {
    setNameState(value)
    try { localStorage.setItem(KEY, value) } catch { /* ignore */ }
  }, [])
  return [name, setName]
}
