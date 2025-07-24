"use client";

import * as React from "react";
import { createContext, useContext } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    console.log("Toast notification:", props.title, props.description);
    
    // For this simple implementation, we'll just log to console
    // In a real app, you would add the toast to state and render it
    // setTimeout(() => {
    //   setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    // }, props.duration || 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext);
};

// Simple export for direct importing
export const toast = (props: ToastProps) => {
  console.log("Toast notification:", props.title, props.description);
}; 