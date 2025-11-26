"use client";

import * as React from "react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange(false)}
            />
            {/* Content */}
            <div className="relative z-50">{children}</div>
        </div>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
    return (
        <div
            className={`bg-background p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}

interface DialogHeaderProps {
    children: React.ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
    return <div className="mb-4">{children}</div>;
}

interface DialogTitleProps {
    children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
    return <h2 className="text-xl font-semibold">{children}</h2>;
}

interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogFooter({ children, className = "" }: DialogFooterProps) {
    return <div className={`mt-6 flex gap-2 ${className}`}>{children}</div>;
}
