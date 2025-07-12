// src/components/ui/use-toast.ts
import * as React from 'react';

type ToastType = 'default' | 'destructive' | 'success';

interface Toast {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove toast after duration
        setTimeout(() => {
            setToasts((prev) => prev.filter(t => t.id !== id));
        }, toast.duration || 3000);
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter(toast => toast.id !== id));
    }, []);

    const value = React.useMemo(() => ({
        toasts,
        addToast,
        removeToast
    }), [toasts, addToast, removeToast]);

    return (
        <ToastContext.Provider value= { value } >
        { children }
        < div className = "fixed top-4 right-4 z-50 flex flex-col gap-2" >
        {
            toasts.map((toast) => (
                <ToastComponent key= { toast.id } toast = { toast } />
        ))
        }
            </div>
            </ToastContext.Provider>
  );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function ToastComponent({ toast }: { toast: Toast }) {
    const bgColor = {
        default: 'bg-background',
        destructive: 'bg-destructive',
        success: 'bg-success'
    }[toast.type];

    const textColor = {
        default: 'text-foreground',
        destructive: 'text-destructive-foreground',
        success: 'text-success-foreground'
    }[toast.type];

    return (
        <div 
      className= {`${bgColor} ${textColor} rounded-md shadow-lg p-4 min-w-[300px] transition-all duration-300 animate-in slide-in-from-right`
}
    >
    <div className="flex justify-between items-start" >
        <div>
        <h4 className="font-medium" > { toast.title } </h4>
{
    toast.description && (
        <p className="text-sm mt-1" > { toast.description } </p>
          )
}
</div>
    < button
className = "text-xl"
onClick = {() => useToast().removeToast(toast.id)}
        >
          & times;
</button>
    </div>
    </div>
  );
}