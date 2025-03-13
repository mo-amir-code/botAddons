// Toast.tsx
import { useToast } from "@/contexts/toastContext"; // Adjust path as per your project structure
import React, { useEffect } from "react";

interface ToastProps {
  id: number;
  message: string;
  type: "success" | "failed";
  duration?: number; // Duration in milliseconds (default: 3000ms)
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 3000,
}) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [id, duration, removeToast]);

  // Modern Tailwind styles based on toast type
  const toastStyles = {
    success: "bg-gradient-to-r from-green-500 to-emerald-600 border-emerald-700",
    failed: "bg-gradient-to-r from-red-500 to-rose-600 border-rose-700",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full rounded-xl border p-4 text-white shadow-xl transition-all duration-500 ease-in-out transform ${
        toastStyles[type]
      } animate-slide-in hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Icon based on type */}
        <span className="text-lg">
          {type === "success" ? "✅" : "❌"}
        </span>
        {/* Message */}
        <span className="flex-1 text-base font-semibold tracking-tight">
          {message}
        </span>
        {/* Close button */}
        <button
          onClick={() => removeToast(id)}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${type === "success" ? "bg-emerald-300" : "bg-rose-300"} animate-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default Toast;