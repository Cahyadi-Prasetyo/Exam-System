"use client";

import { create } from 'zustand';
import type { Toast, ToastVariant } from '@/components/ui/toast';

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    dismissToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { ...toast, id };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));
    },

    dismissToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
    },
}));

interface ToastOptions {
    title: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function useToast() {
    const { addToast, dismissToast, toasts } = useToastStore();

    const toast = {
        success: (options: ToastOptions) => {
            addToast({ variant: 'success' as ToastVariant, ...options });
        },

        error: (options: ToastOptions) => {
            addToast({ variant: 'error' as ToastVariant, ...options });
        },

        warning: (options: ToastOptions) => {
            addToast({ variant: 'warning' as ToastVariant, ...options });
        },

        info: (options: ToastOptions) => {
            addToast({ variant: 'info' as ToastVariant, ...options });
        },
    };

    return {
        toast,
        toasts,
        dismissToast,
    };
}
