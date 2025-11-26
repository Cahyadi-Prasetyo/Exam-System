"use client";

import * as React from "react";

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    side?: "left" | "right";
}

export function Sheet({ open, onOpenChange, children, side = "left" }: SheetProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div
                className={`
                    relative z-50 h-full w-3/4 max-w-sm bg-background shadow-xl transition-transform duration-300 ease-in-out
                    ${side === "left" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right ml-auto"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

interface SheetContentProps {
    children: React.ReactNode;
    className?: string;
}

export function SheetContent({ children, className = "" }: SheetContentProps) {
    return (
        <div className={`h-full overflow-y-auto p-6 ${className}`}>
            {children}
        </div>
    );
}

interface SheetHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function SheetHeader({ children, className = "" }: SheetHeaderProps) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface SheetTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function SheetTitle({ children, className = "" }: SheetTitleProps) {
    return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}
