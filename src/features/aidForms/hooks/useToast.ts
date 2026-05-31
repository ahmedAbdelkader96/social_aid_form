import { useCallback, useEffect, useState } from 'react'

type ToastType = 'success' | 'error'

export type ToastPayload = {
  message: string
  type: ToastType
}

export function useToast(timeout = 4000) {
  const [toast, setToast] = useState<ToastPayload | null>(null)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timerId = window.setTimeout(() => setToast(null), timeout)
    return () => window.clearTimeout(timerId)
  }, [toast, timeout])

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  return {
    toast,
    showToast,
    dismissToast,
  }
}
