// ToastContainer.tsx
import { useToast } from "@/contexts/toastContext"
import React from "react"

import Toast from "./Toast"

const ToastContainer: React.FC = () => {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 space-y-2 p-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}

export default ToastContainer
