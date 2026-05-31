export type ToastType = 'success' | 'error' | 'info'

export interface ToastPayload {
  message: string
  type: ToastType
}

type ToastListener = (toast: ToastPayload | null) => void

const listeners: ToastListener[] = []

export const subscribeToast = (listener: ToastListener) => {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}

export const showToast = (message: string, type: ToastType = 'error') => {
  const payload: ToastPayload = { message, type }
  listeners.slice().forEach((listener) => listener(payload))
}

export const clearToast = () => {
  listeners.slice().forEach((listener) => listener(null))
}
