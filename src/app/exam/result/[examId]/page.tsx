"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours in seconds

  // Mock result data
  const resultData = {
    examTitle: "Matematika Wajib - Semester 1",
    score: 85,
    correctAnswers: 25,
    totalQuestions: 30,
    violations: 2,
    submittedAt: new Date().toLocaleString("id-ID"),
    maxScore: 100,
  };

  // 12-hour countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} jam ${minutes} menit`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900";
    return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";
  };

  const handleReviewAnswers = () => {
    router.push(`/exam/review/${examId}`);
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl mb-2">Ujian Berhasil Dikumpulkan!</CardTitle>
              <p className="text-sm text-muted-foreground">{resultData.examTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dikumpulkan pada {resultData.submittedAt}
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Score Display */}
            <div className={`p-6 rounded-lg border-2 ${getScoreBackground(resultData.score)}`}>
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Nilai Anda</p>
                <p className={`text-6xl font-bold ${getScoreColor(resultData.score)}`}>
                  {resultData.score}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  dari {resultData.maxScore} poin
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {resultData.correctAnswers}
                    </p>
                    <p className="text-xs text-muted-foreground">Jawaban Benar</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {resultData.totalQuestions - resultData.correctAnswers}
                    </p>
                    <p className="text-xs text-muted-foreground">Jawaban Salah</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
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
                    <p className="text-2xl font-bold">{resultData.totalQuestions}</p>
                    <p className="text-xs text-muted-foreground">Total Soal</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {resultData.violations}
                    </p>
                    <p className="text-xs text-muted-foreground">Pelanggaran</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Violation Warning */}
            {resultData.violations > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                      Pelanggaran Terdeteksi
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sistem mendeteksi {resultData.violations} kali perpindahan tab/window selama ujian.
                      Guru dapat melihat detail pelanggaran ini.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Access Time Remaining */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-500">
                    Akses Hasil Ujian
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Anda dapat melihat detail jawaban selama{" "}
                    <span className="font-semibold text-blue-600">
                      {formatTimeLeft(timeLeft)}
                    </span>{" "}
                    lagi.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleExit}
                className="flex-1"
              >
                Kembali ke Dashboard
              </Button>
              <Button
                onClick={handleReviewAnswers}
                className="flex-1"
                disabled={timeLeft === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Review Jawaban
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
