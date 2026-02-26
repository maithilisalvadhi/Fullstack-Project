import { createContext, useContext, useMemo, useState } from "react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const toast = { id, message, type }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3000)
  }

  const value = useMemo(() => ({ toasts, addToast }), [toasts])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => useContext(ToastContext)
