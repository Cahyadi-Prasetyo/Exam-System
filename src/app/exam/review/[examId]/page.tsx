"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data
const mockReviewData = {
    examTitle: "Matematika Wajib - Semester 1",
    score: 85,
    questions: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Soal nomor ${i + 1}: Tentukan hasil dari 2x + 3y = 12 dan x - y = 2`,
        options: [
            { id: "A", text: "x = 3, y = 1" },
            { id: "B", text: "x = 4, y = 2" },
            { id: "C", text: "x = 5, y = 3" },
            { id: "D", text: "x = 6, y = 4" },
        ],
        correctAnswer: "B",
        userAnswer: i % 5 === 0 ? null : ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
    })),
};

export default function ExamReviewPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.examId as string;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [filterMode, setFilterMode] = useState<"all" | "wrong" | "unanswered">("all");

    const question = mockReviewData.questions[currentQuestion];

    const getFilteredQuestions = () => {
        if (filterMode === "wrong") {
            return mockReviewData.questions.filter(
                (q) => q.userAnswer !== q.correctAnswer
            );
        }
        if (filterMode === "unanswered") {
            return mockReviewData.questions.filter((q) => q.userAnswer === null);
        }
        return mockReviewData.questions;
    };

    const filteredQuestions = getFilteredQuestions();

    const handleNext = () => {
        if (currentQuestion < filteredQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleExit = () => {
        router.push(`/exam/result/${examId}`);
    };

    const isCorrect = question.userAnswer === question.correctAnswer;
    const isUnanswered = question.userAnswer === null;

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Top Bar */}
            <div className="bg-background border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg">Review Jawaban</h1>
                            <p className="text-sm text-muted-foreground">{mockReviewData.examTitle}</p>
                        </div>
                        <Button variant="ghost" onClick={handleExit}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Kembali
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                    {/* Question Section */}
                    <div className="space-y-4">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filterMode === "all" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    setFilterMode("all");
                                    setCurrentQuestion(0);
                                }}
                            >
                                Semua ({mockReviewData.questions.length})
                            </Button>
                            <Button
                                variant={filterMode === "wrong" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    setFilterMode("wrong");
                                    setCurrentQuestion(0);
                                }}
                            >
                                Salah (
                                {
                                    mockReviewData.questions.filter(
                                        (q) => q.userAnswer !== q.correctAnswer && q.userAnswer !== null
                                    ).length
                                }
                                )
                            </Button>
                            <Button
                                variant={filterMode === "unanswered" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    setFilterMode("unanswered");
                                    setCurrentQuestion(0);
                                }}
                            >
                                Tidak Dijawab (
                                {mockReviewData.questions.filter((q) => q.userAnswer === null).length})
                            </Button>
                        </div>

                        {/* Question Card */}
                        <Card className="p-6">
                            {/* Status Badge */}
                            <div className="mb-4">
                                {isUnanswered ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Tidak Dijawab
                                    </div>
                                ) : isCorrect ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Benar
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Salah
                                    </div>
                                )}
                            </div>

                            {/* Question */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Pertanyaan {question.id}
                                </h2>
                                <p className="text-base leading-relaxed">{question.question}</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {question.options.map((option) => {
                                    const isUserAnswer = question.userAnswer === option.id;
                                    const isCorrectOption = question.correctAnswer === option.id;

                                    let optionStyle = "border-border bg-background";
                                    if (isCorrectOption) {
                                        optionStyle = "border-green-500 bg-green-50 dark:bg-green-950/20";
                                    } else if (isUserAnswer && !isCorrect) {
                                        optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/20";
                                    }

                                    return (
                                        <div
                                            key={option.id}
                                            className={`w-full p-4 rounded-lg border-2 ${optionStyle}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isCorrectOption
                                                        ? "border-green-500 bg-green-500 text-white"
                                                        : isUserAnswer && !isCorrect
                                                            ? "border-red-500 bg-red-500 text-white"
                                                            : "border-border"
                                                        }`}
                                                >
                                                    <span className="text-sm font-semibold">{option.id}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <span>{option.text}</span>
                                                    {isCorrectOption && (
                                                        <span className="ml-2 text-xs font-semibold text-green-600">
                                                            ✓ Jawaban Benar
                                                        </span>
                                                    )}
                                                    {isUserAnswer && !isCorrect && (
                                                        <span className="ml-2 text-xs font-semibold text-red-600">
                                                            ✗ Jawaban Anda
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explanation (if unanswered) */}
                            {isUnanswered && (
                                <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                                        <span className="font-semibold">Catatan:</span> Anda tidak menjawab soal ini.
                                    </p>
                                </div>
                            )}
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
                            <span className="text-sm text-muted-foreground">
                                {currentQuestion + 1} dari {filteredQuestions.length}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={handleNext}
                                disabled={currentQuestion === filteredQuestions.length - 1}
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

                    {/* Summary Sidebar */}
                    <div className="space-y-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3">Ringkasan</h3>

                            {/* Summary Stats */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-950/20">
                                    <span className="text-sm">Benar</span>
                                    <span className="font-bold text-green-600">
                                        {
                                            mockReviewData.questions.filter(
                                                (q) => q.userAnswer === q.correctAnswer
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-950/20">
                                    <span className="text-sm">Salah</span>
                                    <span className="font-bold text-red-600">
                                        {
                                            mockReviewData.questions.filter(
                                                (q) => q.userAnswer !== q.correctAnswer && q.userAnswer !== null
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-950/20">
                                    <span className="text-sm">Tidak Dijawab</span>
                                    <span className="font-bold text-gray-600">
                                        {mockReviewData.questions.filter((q) => q.userAnswer === null).length}
                                    </span>
                                </div>
                            </div>

                            {/* Question Grid */}
                            <h4 className="font-semibold mb-2 text-sm">Navigasi Cepat</h4>
                            <div className="grid grid-cols-5 gap-2 max-h-[500px] overflow-y-auto">
                                {filteredQuestions.map((q, index) => {
                                    const isCorrectQ = q.userAnswer === q.correctAnswer;
                                    const isUnansweredQ = q.userAnswer === null;
                                    const isCurrent = currentQuestion === index;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestion(index)}
                                            className={`h-10 rounded-lg border-2 font-semibold text-sm transition-all ${isCurrent
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : isUnansweredQ
                                                    ? "border-gray-300 bg-gray-50 dark:bg-gray-950/20 text-gray-600"
                                                    : isCorrectQ
                                                        ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700"
                                                        : "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700"
                                                }`}
                                        >
                                            {q.id}
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
