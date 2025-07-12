"use client";

import { ToastProvider } from '@/components/ui/use-toast';
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}