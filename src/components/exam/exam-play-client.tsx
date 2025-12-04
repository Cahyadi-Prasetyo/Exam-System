"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { KeyboardShortcutsModal } from "@/components/ui/keyboard-shortcuts-modal";
import { ConnectionBanner } from "@/components/ui/connection-banner";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { submitAnswer, finishExam } from "@/actions/student-actions";
import { Loader2 } from "lucide-react";

interface ExamPlayClientProps {
    exam: any;
    attempt: any;
}

export function ExamPlayClient({ exam, attempt }: ExamPlayClientProps) {
    const router = useRouter();

    // Initialize answers from attempt
    const initialAnswers = attempt.answers.reduce((acc: any, ans: any) => {
        acc[ans.questionId] = ans.answerText;
        return acc;
    }, {});

    // Calculate initial time remaining
    const startTime = new Date(attempt.startTime).getTime();
    const durationMs = exam.duration * 60 * 1000;
    const endTime = startTime + durationMs;
    const now = new Date().getTime();
    const initialTimeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>(initialAnswers);
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [violations, setViolations] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Phase 4 States
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { isOnline, wasOffline } = useOnlineStatus();

    const currentQuestion = exam.questions[currentQuestionIndex];

    const handleAnswerSelect = async (optionId: string) => {
        // Optimistic update
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: optionId,
        }));

        // Submit to server
        await submitAnswer(attempt.id, currentQuestion.id, optionId);
    };

    const toggleFlag = () => {
        setFlagged((prev) => {
            const newFlagged = new Set(prev);
            if (newFlagged.has(currentQuestion.id)) {
                newFlagged.delete(currentQuestion.id);
            } else {
                newFlagged.add(currentQuestion.id);
            }
            return newFlagged;
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        await finishExam(attempt.id);
        // Redirect handled by server action
    }, [attempt.id]);

    const handleAutoSubmit = useCallback(() => {
        console.log("Auto-submitting exam...");
        handleSubmit();
    }, [handleSubmit]);

    const handleSubmitClick = () => {
        const answeredCount = Object.keys(answers).length;
        const unansweredCount = exam.questions.length - answeredCount;

        if (unansweredCount > 0) {
            setShowSubmitModal(true);
        } else {
            handleSubmit();
        }
    };

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        onAnswerSelect: (optionId) => {
            // Map A, B, C, D to option IDs if possible, or just ignore for now if IDs are UUIDs
            // Assuming options have some order or we map index to option
            const option = currentQuestion.options.find((o: any) => o.text.startsWith(optionId) || o.id === optionId); // Simplified
            if (option) handleAnswerSelect(option.id);
        },
        onNext: handleNext,
        onPrevious: handlePrevious,
        onToggleFlag: toggleFlag,
        onShowHelp: () => setIsShortcutsModalOpen(true),
        currentQuestion: currentQuestionIndex,
        totalQuestions: exam.questions.length,
        optionsCount: currentQuestion.options.length,
    });

    // Swipe Gestures
    const swipeHandlers = useSwipeGesture({
        onSwipeLeft: handleNext,
        onSwipeRight: handlePrevious,
    });

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleAutoSubmit]);

    // Tab switch detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolations((prev) => prev + 1);
                setShowWarningModal(true);

                if (violations + 1 >= 5) {
                    handleAutoSubmit();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [violations, handleAutoSubmit]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getTimerColor = () => {
        if (timeRemaining <= 60) return "text-red-600"; // 1 min
        if (timeRemaining <= 300) return "text-orange-600"; // 5 min
        if (timeRemaining <= 900) return "text-yellow-600"; // 15 min
        return "text-foreground";
    };

    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / exam.questions.length) * 100;

    return (
        <div className="min-h-screen bg-muted/20" {...swipeHandlers}>
            <ConnectionBanner isOnline={isOnline} wasOffline={wasOffline} />

            {/* Top Bar */}
            <div className="bg-background border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg">{exam.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Soal {currentQuestionIndex + 1} dari {exam.questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Waktu Tersisa</p>
                                <p className={`font-mono text-xl font-bold ${getTimerColor()}`}>
                                    {formatTime(timeRemaining)}
                                </p>
                            </div>
                            {/* Mobile Nav Toggle */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setIsMobileNavOpen(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <ProgressBar value={progress} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                    {/* Question Section (60%) */}
                    <div className="space-y-4">
                        <Card className="p-6">
                            {/* Question */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-lg font-semibold">
                                        Pertanyaan {currentQuestionIndex + 1}
                                    </h2>
                                    <Button
                                        variant={flagged.has(currentQuestion.id) ? "destructive" : "ghost"}
                                        size="sm"
                                        onClick={toggleFlag}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                                        </svg>
                                        <span className="ml-2">
                                            {flagged.has(currentQuestion.id) ? "Ditandai" : "Tandai"}
                                        </span>
                                    </Button>
                                </div>
                                <p className="text-base leading-relaxed whitespace-pre-wrap">{currentQuestion.text}</p>
                                {currentQuestion.imageUrl && (
                                    <img src={currentQuestion.imageUrl} alt="Question Image" className="mt-4 max-w-full rounded-lg border border-gray-200" />
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option: any) => {
                                    const isSelected = answers[currentQuestion.id] === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswerSelect(option.id)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50 hover:bg-accent"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border"
                                                        }`}
                                                >
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                                <span>{option.text}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Sebelumnya
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleNext}
                                disabled={currentQuestionIndex === exam.questions.length - 1}
                            >
                                Selanjutnya
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Sidebar (Desktop) */}
                    <div className="hidden lg:block space-y-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3">Navigasi Soal</h3>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                    <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                                    <p className="text-xs text-muted-foreground">Terjawab</p>
                                </div>
                                <div className="p-2 rounded bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-900">
                                    <p className="text-2xl font-bold text-gray-600">
                                        {exam.questions.length - answeredCount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Kosong</p>
                                </div>
                                <div className="p-2 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                    <p className="text-2xl font-bold text-red-600">{flagged.size}</p>
                                    <p className="text-xs text-muted-foreground">Ditandai</p>
                                </div>
                            </div>

                            {/* Question Grid */}
                            <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
                                {exam.questions.map((q: any, index: number) => {
                                    const isAnswered = answers[q.id] !== undefined;
                                    const isFlagged = flagged.has(q.id);
                                    const isCurrent = currentQuestionIndex === index;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`h-12 rounded-lg border-2 font-semibold transition-all relative ${isCurrent
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : isAnswered
                                                    ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                                                    : "border-border bg-background hover:border-primary/50"
                                                }`}
                                        >
                                            {index + 1}
                                            {isFlagged && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 absolute top-1 right-1 text-red-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmitClick}
                            className="w-full"
                            size="lg"
                            variant="destructive"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Mengumpulkan...
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Kumpulkan Ujian
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Bottom Sheet */}
            <BottomSheet
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                title="Navigasi Soal"
            >
                <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                            <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                            <p className="text-xs text-muted-foreground">Terjawab</p>
                        </div>
                        <div className="p-2 rounded bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-900">
                            <p className="text-2xl font-bold text-gray-600">
                                {exam.questions.length - answeredCount}
                            </p>
                            <p className="text-xs text-muted-foreground">Kosong</p>
                        </div>
                        <div className="p-2 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                            <p className="text-2xl font-bold text-red-600">{flagged.size}</p>
                            <p className="text-xs text-muted-foreground">Ditandai</p>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="grid grid-cols-5 gap-2">
                        {exam.questions.map((q: any, index: number) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isFlagged = flagged.has(q.id);
                            const isCurrent = currentQuestionIndex === index;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => {
                                        setCurrentQuestionIndex(index);
                                        setIsMobileNavOpen(false);
                                    }}
                                    className={`h-12 rounded-lg border-2 font-semibold transition-all relative ${isCurrent
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : isAnswered
                                            ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                                            : "border-border bg-background hover:border-primary/50"
                                        }`}
                                >
                                    {index + 1}
                                    {isFlagged && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 absolute top-1 right-1 text-red-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={() => {
                            setIsMobileNavOpen(false);
                            handleSubmitClick();
                        }}
                        className="w-full mt-4"
                        size="lg"
                        variant="destructive"
                        disabled={isSubmitting}
                    >
                        Kumpulkan Ujian
                    </Button>
                </div>
            </BottomSheet>

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcutsModal
                isOpen={isShortcutsModalOpen}
                onClose={() => setIsShortcutsModalOpen(false)}
            />

            {/* Submit Confirmation Modal */}
            <Modal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                title="Konfirmasi Pengumpulan"
            >
                <div className="space-y-4">
                    <p>
                        Anda masih memiliki{" "}
                        <span className="font-bold text-red-600">
                            {exam.questions.length - answeredCount}
                        </span>{" "}
                        soal yang belum dijawab.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin mengumpulkan ujian sekarang? Jawaban yang kosong akan dihitung sebagai salah.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setShowSubmitModal(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} variant="destructive" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Kumpulkan"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Tab Switch Warning Modal */}
            <Modal
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                title="⚠️ Peringatan Pelanggaran"
            >
                <div className="space-y-4">
                    <p className="text-red-600 font-semibold">
                        Terdeteksi perpindahan tab/window! ({violations}/5)
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Sistem telah mencatat pelanggaran ini. Jika mencapai 5 pelanggaran, ujian akan otomatis dikumpulkan.
                    </p>
                    <Button onClick={() => setShowWarningModal(false)} className="w-full">
                        Saya Mengerti
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
