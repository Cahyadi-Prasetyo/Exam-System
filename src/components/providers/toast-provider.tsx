"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, dismissToast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {children}
            {mounted && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
        </>
    );
}
