"use client";

import { useEffect, useState } from "react";

interface ConnectionBannerProps {
    isOnline: boolean;
    wasOffline: boolean;
}

export function ConnectionBanner({ isOnline, wasOffline }: ConnectionBannerProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!isOnline || wasOffline) {
            setShow(true);
        }

        // Auto-hide success message after 3 seconds
        if (isOnline && wasOffline) {
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, wasOffline]);

    if (!show) return null;

    if (!isOnline) {
        // Offline - Red banner
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg">
                <div className="container mx-auto flex items-center gap-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">Koneksi Terputus</p>
                        <p className="text-xs opacity-90">
                            Jawaban tersimpan lokal. Timer tetap berjalan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="animate-pulse h-2 w-2 bg-white rounded-full"></div>
                        <span className="text-xs">Menyambung kembali...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (wasOffline) {
        // Just reconnected - Green banner (auto-hides)
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 shadow-lg animate-slideIn">
                <div className="container mx-auto flex items-center gap-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">Koneksi Kembali Normal</p>
                        <p className="text-xs opacity-90">Sinkronisasi jawaban...</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
