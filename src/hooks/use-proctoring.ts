"use client";

import { useState, useEffect, useCallback } from "react";

export interface ProctorViolation {
    type: "tab_switch" | "fullscreen_exit" | "copy" | "paste" | "right_click";
    timestamp: Date;
    message: string;
}

interface UseProctoringOptions {
    enableFullscreen?: boolean;
    enableTabTracking?: boolean;
    enableCopyPasteBlocking?: boolean;
    enableRightClickBlocking?: boolean;
    maxTabSwitches?: number;
    onViolation?: (violation: ProctorViolation) => void;
    onMaxViolationsReached?: () => void;
}

interface UseProctoringReturn {
    violations: ProctorViolation[];
    tabSwitchCount: number;
    isFullscreen: boolean;
    requestFullscreen: () => Promise<void>;
    exitFullscreen: () => Promise<void>;
    clearViolations: () => void;
}

export function useProctoring(options: UseProctoringOptions = {}): UseProctoringReturn {
    const {
        enableFullscreen = true,
        enableTabTracking = true,
        enableCopyPasteBlocking = true,
        enableRightClickBlocking = true,
        maxTabSwitches = 3,
        onViolation,
        onMaxViolationsReached,
    } = options;

    const [violations, setViolations] = useState<ProctorViolation[]>([]);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const addViolation = useCallback((violation: ProctorViolation) => {
        setViolations(prev => [...prev, violation]);
        onViolation?.(violation);
    }, [onViolation]);

    // Request fullscreen
    const requestFullscreen = useCallback(async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) {
                await (document.documentElement as any).webkitRequestFullscreen();
            } else if ((document.documentElement as any).msRequestFullscreen) {
                await (document.documentElement as any).msRequestFullscreen();
            }
            setIsFullscreen(true);
        } catch (error) {
            console.error("Fullscreen request failed:", error);
        }
    }, []);

    // Exit fullscreen
    const exitFullscreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                await (document as any).msExitFullscreen();
            }
            setIsFullscreen(false);
        } catch (error) {
            console.error("Exit fullscreen failed:", error);
        }
    }, []);

    const clearViolations = useCallback(() => {
        setViolations([]);
        setTabSwitchCount(0);
    }, []);

    // Tab/window visibility tracking
    useEffect(() => {
        if (!enableTabTracking) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);

                addViolation({
                    type: "tab_switch",
                    timestamp: new Date(),
                    message: `Perpindahan tab terdeteksi (${newCount}x)`,
                });

                if (newCount >= maxTabSwitches) {
                    onMaxViolationsReached?.();
                }
            }
        };

        const handleBlur = () => {
            // Additional tracking when window loses focus
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [enableTabTracking, tabSwitchCount, maxTabSwitches, addViolation, onMaxViolationsReached]);

    // Fullscreen change detection
    useEffect(() => {
        if (!enableFullscreen) return;

        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isNowFullscreen);

            if (!isNowFullscreen && isFullscreen) {
                addViolation({
                    type: "fullscreen_exit",
                    timestamp: new Date(),
                    message: "Keluar dari mode layar penuh",
                });
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        };
    }, [enableFullscreen, isFullscreen, addViolation]);

    // Copy/paste blocking
    useEffect(() => {
        if (!enableCopyPasteBlocking) return;

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            addViolation({
                type: "copy",
                timestamp: new Date(),
                message: "Percobaan copy terdeteksi dan diblokir",
            });
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            addViolation({
                type: "paste",
                timestamp: new Date(),
                message: "Percobaan paste terdeteksi dan diblokir",
            });
        };

        const handleCut = (e: ClipboardEvent) => {
            e.preventDefault();
            addViolation({
                type: "copy",
                timestamp: new Date(),
                message: "Percobaan cut terdeteksi dan diblokir",
            });
        };

        document.addEventListener("copy", handleCopy);
        document.addEventListener("paste", handlePaste);
        document.addEventListener("cut", handleCut);

        return () => {
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("paste", handlePaste);
            document.removeEventListener("cut", handleCut);
        };
    }, [enableCopyPasteBlocking, addViolation]);

    // Right-click blocking
    useEffect(() => {
        if (!enableRightClickBlocking) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            addViolation({
                type: "right_click",
                timestamp: new Date(),
                message: "Klik kanan diblokir",
            });
        };

        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [enableRightClickBlocking, addViolation]);

    // Keyboard shortcut blocking (Ctrl+C, Ctrl+V, etc.)
    useEffect(() => {
        if (!enableCopyPasteBlocking) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Ctrl/Cmd + C, V, X, A, P (print), F12 (dev tools)
            const blockedKeys = ["c", "v", "x", "a", "p"];
            if ((e.ctrlKey || e.metaKey) && blockedKeys.includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            // Block F12 (Developer tools)
            if (e.key === "F12") {
                e.preventDefault();
            }

            // Block Ctrl+Shift+I (Dev tools), Ctrl+Shift+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
                e.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [enableCopyPasteBlocking]);

    return {
        violations,
        tabSwitchCount,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        clearViolations,
    };
}
