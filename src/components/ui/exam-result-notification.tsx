"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";

interface ExamResultNotification {
    id: string;
    examTitle: string;
    examId: string;
    submittedAt: Date;
    expiresAt: Date;
}

interface ExamResultNotificationProps {
    notification: ExamResultNotification;
    onDismiss: (id: string) => void;
}

export function ExamResultNotificationCard({ notification, onDismiss }: ExamResultNotificationProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        // Calculate time left
        const updateTimeLeft = () => {
            const now = new Date().getTime();
            const expires = new Date(notification.expiresAt).getTime();
            const remaining = Math.max(0, expires - now);

            setTimeLeft(remaining);

            // Auto-dismiss when expired
            if (remaining === 0) {
                onDismiss(notification.id);
            }
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [notification.expiresAt, notification.id, onDismiss]);

    const formatTimeLeft = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours} jam ${minutes} menit`;
        }
        return `${minutes} menit`;
    };

    const handleViewResult = () => {
        router.push(`/exam/result/${notification.examId}`);
    };

    if (timeLeft === 0) {
        return null;
    }

    return (
        <Card className="p-4 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                                Hasil Ujian Tersedia
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
                                {notification.examTitle}
                            </p>
                        </div>
                        <button
                            onClick={() => onDismiss(notification.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Tersedia untuk {formatTimeLeft(timeLeft)} lagi</span>
                    </div>

                    <Button
                        onClick={handleViewResult}
                        size="sm"
                        className="mt-3 w-full sm:w-auto"
                    >
                        Lihat Hasil Ujian
                    </Button>
                </div>
            </div>
        </Card>
    );
}
