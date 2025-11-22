"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExamPage() {
    const params = useParams();
    const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    // Mock questions
    const questions = [
        {
            id: 1,
            text: "Jika f(x) = 2x + 5, maka nilai f(3) adalah...",
            options: ["8", "9", "10", "11", "12"],
        },
        {
            id: 2,
            text: "Ibukota negara Indonesia yang baru terletak di provinsi...",
            options: ["Kalimantan Timur", "Kalimantan Barat", "Jawa Barat", "DKI Jakarta", "Sulawesi Selatan"],
        },
        {
            id: 3,
            text: "Siapakah penemu bola lampu pijar?",
            options: ["Nikola Tesla", "Thomas Alva Edison", "Alexander Graham Bell", "Isaac Newton", "Albert Einstein"],
        },
        // Add more mock questions if needed
    ];

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleAnswer = (questionId: number, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Exam Header */}
            <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm z-10">
                <div>
                    <h1 className="text-lg font-bold">Matematika Wajib - Semester 1</h1>
                    <p className="text-xs text-muted-foreground">Budi Santoso - XII IPA 1</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary font-mono font-bold text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {formatTime(timeLeft)}
                    </div>
                    <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                        Selesai Ujian
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Question Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="mx-auto max-w-3xl">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Soal No. {currentQuestion}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Bobot: 10 Poin
                            </span>
                        </div>

                        <div className="mb-8 text-xl font-medium leading-relaxed">
                            {questions[currentQuestion - 1]?.text || "Soal tidak ditemukan."}
                        </div>

                        <div className="space-y-3">
                            {questions[currentQuestion - 1]?.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover:bg-accent ${answers[currentQuestion] === option
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-border bg-card"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        value={option}
                                        checked={answers[currentQuestion] === option}
                                        onChange={() => handleAnswer(currentQuestion, option)}
                                        className="h-5 w-5 border-input text-primary focus:ring-primary"
                                    />
                                    <span className="text-base">{option}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion((prev) => Math.max(1, prev - 1))}
                                disabled={currentQuestion === 1}
                                className="rounded-md border border-input bg-background px-6 py-2 text-sm font-medium shadow-sm hover:bg-accent disabled:opacity-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length, prev + 1))}
                                disabled={currentQuestion === questions.length}
                                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar Navigation */}
                <aside className="w-72 border-l border-border bg-muted/10 p-6 hidden md:block overflow-y-auto">
                    <h3 className="mb-4 font-semibold">Navigasi Soal</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 20 }).map((_, i) => { // Mocking 20 questions slots
                            const qNum = i + 1;
                            const isAnswered = answers[qNum];
                            const isCurrent = currentQuestion === qNum;

                            return (
                                <button
                                    key={qNum}
                                    onClick={() => setCurrentQuestion(qNum)}
                                    className={`aspect-square rounded-md text-sm font-medium transition-all ${isCurrent
                                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                            : isAnswered
                                                ? "bg-primary/60 text-primary-foreground"
                                                : "bg-card border border-border hover:bg-accent"
                                        }`}
                                >
                                    {qNum}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span>Sedang dikerjakan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/60"></div>
                            <span>Sudah dijawab</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full border border-border bg-card"></div>
                            <span>Belum dijawab</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
