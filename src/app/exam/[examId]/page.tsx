"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";

// Mock data - nanti dari API
const mockExamData = {
    id: "MTK-2024-A1",
    title: "Matematika Wajib - Semester 1",
    duration: 90, // minutes
    questions: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Soal nomor ${i + 1}: Tentukan hasil dari 2x + 3y = 12 dan x - y = 2`,
        options: [
            { id: "A", text: "x = 3, y = 1" },
            { id: "B", text: "x = 4, y = 2" },
            { id: "C", text: "x = 5, y = 3" },
            { id: "D", text: "x = 6, y = 4" },
        ],
    })),
};

export default function ExamPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.examId as string;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(mockExamData.duration * 60); // in seconds
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [violations, setViolations] = useState(0);

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
    }, []);

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
    }, [violations]);

    // Auto-save answers
    useEffect(() => {
        const autoSave = setInterval(() => {
            // Auto-save logic here
            console.log("Auto-saving answers...", answers);
        }, 30000); // Every 30 seconds

        return () => clearInterval(autoSave);
    }, [answers]);

    const handleAutoSubmit = useCallback(() => {
        console.log("Auto-submitting exam...");
        router.push(`/exam/result/${examId}`);
    }, [examId, router]);

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

    const handleAnswerSelect = (optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: optionId,
        }));
    };

    const toggleFlag = () => {
        setFlagged((prev) => {
            const newFlagged = new Set(prev);
            if (newFlagged.has(currentQuestion)) {
                newFlagged.delete(currentQuestion);
            } else {
                newFlagged.add(currentQuestion);
            }
            return newFlagged;
        });
    };

    const handleNext = () => {
        if (currentQuestion < mockExamData.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmitClick = () => {
        const answeredCount = Object.keys(answers).length;
        const unansweredCount = mockExamData.questions.length - answeredCount;

        if (unansweredCount > 0) {
            // Show warning modal
            setShowSubmitModal(true);
        } else {
            // Submit directly
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        console.log("Submitting exam...", { answers, violations });
        router.push(`/exam/result/${examId}`);
    };

    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / mockExamData.questions.length) * 100;
    const question = mockExamData.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Top Bar */}
            <div className="bg-background border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg">{mockExamData.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Soal {currentQuestion + 1} dari {mockExamData.questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Waktu Tersisa</p>
                                <p className={`font-mono text-xl font-bold ${getTimerColor()}`}>
                                    {formatTime(timeRemaining)}
                                </p>
                            </div>
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
                                        Pertanyaan {question.id}
                                    </h2>
                                    <Button
                                        variant={flagged.has(currentQuestion) ? "destructive" : "ghost"}
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
                                            {flagged.has(currentQuestion) ? "Ditandai" : "Tandai"}
                                        </span>
                                    </Button>
                                </div>
                                <p className="text-base leading-relaxed">{question.question}</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {question.options.map((option) => {
                                    const isSelected = answers[currentQuestion] === option.id;
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
                                                    <span className="text-sm font-semibold">{option.id}</span>
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
                                disabled={currentQuestion === 0}
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
                                disabled={currentQuestion === mockExamData.questions.length - 1}
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

                    {/* Navigation Sidebar (40%) */}
                    <div className="space-y-4">
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
                                        {mockExamData.questions.length - answeredCount}
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
                                {mockExamData.questions.map((_, index) => {
                                    const isAnswered = answers[index] !== undefined;
                                    const isFlagged = flagged.has(index);
                                    const isCurrent = currentQuestion === index;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentQuestion(index)}
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
                        >
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
                        </Button>
                    </div>
                </div>
            </div>

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
                            {mockExamData.questions.length - answeredCount}
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
                        <Button onClick={handleSubmit} variant="destructive" className="flex-1">
                            Ya, Kumpulkan
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
