"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  // Auto remove after 3s
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#06202B] animate-in slide-in-from-right-8 fade-in duration-300 ${
              toast.type === "success" ? "bg-[#10b981] text-white" :
              toast.type === "error" ? "bg-[#ef4444] text-white" :
              "bg-white text-black"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-6 h-6" />}
            {toast.type === "error" && <AlertCircle className="w-6 h-6" />}
            <span className="font-bold uppercase tracking-widest text-sm">{toast.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-4 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
