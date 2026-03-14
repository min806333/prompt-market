"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

function ToastItem({ item, onRemove }: { item: Toast; onRemove: () => void }) {
  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };
  const colors: Record<ToastType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-brand-600",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg min-w-[220px] max-w-sm animate-fade-in ${colors[item.type]}`}
      role="alert"
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
        {icons[item.type]}
      </span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={onRemove}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastItem item={item} onRemove={() => remove(item.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
