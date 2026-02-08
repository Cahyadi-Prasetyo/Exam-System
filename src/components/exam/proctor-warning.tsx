"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, Maximize, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProctorViolation } from "@/hooks/use-proctoring";

interface ProctorWarningProps {
    violations: ProctorViolation[];
    tabSwitchCount: number;
    maxTabSwitches: number;
    isFullscreen: boolean;
    onRequestFullscreen: () => void;
    onDismiss?: () => void;
}

export function ProctorWarning({
    violations,
    tabSwitchCount,
    maxTabSwitches,
    isFullscreen,
    onRequestFullscreen,
    onDismiss
}: ProctorWarningProps) {
    const [showLatestViolation, setShowLatestViolation] = useState(false);
    const latestViolation = violations[violations.length - 1];

    // Show toast when new violation occurs
    useEffect(() => {
        if (violations.length > 0) {
            setShowLatestViolation(true);
            const timer = setTimeout(() => {
                setShowLatestViolation(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [violations.length]);

    const remainingWarnings = maxTabSwitches - tabSwitchCount;
    const isNearLimit = remainingWarnings <= 1 && remainingWarnings > 0;
    const isAtLimit = remainingWarnings <= 0;

    return (
        <>
            {/* Floating Violation Toast */}
            {showLatestViolation && latestViolation && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
                    <div className={`
                        max-w-sm p-4 rounded-xl shadow-xl border
                        ${isAtLimit
                            ? "bg-red-500 text-white border-red-600"
                            : isNearLimit
                                ? "bg-orange-500 text-white border-orange-600"
                                : "bg-yellow-500 text-black border-yellow-600"
                        }
                    `}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-bold text-sm">
                                    {isAtLimit ? "Peringatan Terakhir!" : "Pelanggaran Terdeteksi"}
                                </p>
                                <p className="text-sm opacity-90 mt-1">
                                    {latestViolation.message}
                                </p>
                                {latestViolation.type === "tab_switch" && (
                                    <p className="text-xs mt-2 opacity-75">
                                        Sisa kesempatan: {Math.max(0, remainingWarnings)}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowLatestViolation(false)}
                                className="p-1 hover:opacity-70"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Prompt */}
            {!isFullscreen && (
                <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl p-8 max-w-md text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Maximize className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Mode Layar Penuh Diperlukan</h2>
                        <p className="text-muted-foreground mb-6">
                            Ujian ini memerlukan mode layar penuh untuk mencegah kecurangan.
                            Klik tombol di bawah untuk melanjutkan.
                        </p>
                        <Button size="lg" onClick={onRequestFullscreen} className="w-full">
                            <Maximize className="w-5 h-5 mr-2" />
                            Aktifkan Layar Penuh
                        </Button>
                    </div>
                </div>
            )}

            {/* Violation Counter Badge */}
            {violations.length > 0 && (
                <div className="fixed bottom-4 left-4 z-50">
                    <div className={`
                        px-4 py-2 rounded-full shadow-lg flex items-center gap-2
                        ${isAtLimit
                            ? "bg-red-500 text-white"
                            : isNearLimit
                                ? "bg-orange-500 text-white"
                                : "bg-yellow-500 text-black"
                        }
                    `}>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                            Pelanggaran: {tabSwitchCount}/{maxTabSwitches}
                        </span>
                    </div>
                </div>
            )}

            {/* Proctoring Status Indicator */}
            <div className="fixed bottom-4 right-4 z-50">
                <div className="px-4 py-2 rounded-full bg-card border shadow-lg flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        Proctoring Aktif
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isFullscreen ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
                </div>
            </div>
        </>
    );
}
