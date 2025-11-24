"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExamConfirmPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const examCode = searchParams.get("code") || "";

    // Mock exam data (nanti dari API/database)
    const examData = {
        code: examCode,
        title: "Matematika Wajib - Semester 1",
        subject: "Matematika",
        duration: 90, // minutes
        questionCount: 30,
        pointsPerQuestion: 10,
        totalPoints: 300,
        instructions: [
            "Baca setiap soal dengan teliti sebelum menjawab",
            "Pastikan koneksi internet Anda stabil",
            "Tidak diperbolehkan membuka aplikasi/tab lain selama ujian",
        ],
    };

    const handleStartExam = () => {
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }

        // Navigate to exam page
        router.push(`/exam/${examCode}`);
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader className="border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Konfirmasi Ujian</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kode: <span className="font-mono font-semibold">{examData.code}</span>
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Exam Details */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">{examData.title}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-muted-foreground mt-0.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">Mata Pelajaran</p>
                                        <p className="text-sm text-muted-foreground">{examData.subject}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-muted-foreground mt-0.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">Durasi</p>
                                        <p className="text-sm text-muted-foreground">{examData.duration} menit</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-muted-foreground mt-0.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">Jumlah Soal</p>
                                        <p className="text-sm text-muted-foreground">{examData.questionCount} Pilihan Ganda</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-muted-foreground mt-0.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">Total Bobot</p>
                                        <p className="text-sm text-muted-foreground">{examData.totalPoints} poin ({examData.pointsPerQuestion} poin/soal)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Instruksi Penting
                            </h4>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {examData.instructions.map((instruction, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Warnings */}
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Perhatian
                            </h4>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                                    <span>Ujian tidak bisa di-pause setelah dimulai</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                                    <span>Timer akan berjalan otomatis dan hitung mundur</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                                    <span>Sistem akan mendeteksi perpindahan tab/window</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                                    <span>Ujian akan otomatis dikumpulkan saat waktu habis</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={handleCancel}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleStartExam}
                                className="flex-1"
                                size="lg"
                            >
                                Mulai Ujian Sekarang
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
