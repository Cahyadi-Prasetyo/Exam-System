"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    Download,
    TrendingUp,
    Award,
    Calendar,
    User,
    GraduationCap,
    BarChart3,
    Trophy,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateStudentReportCard, StudentReportData, StudentExamResult } from "@/lib/pdf-generator";

// Dummy data for demonstration
const dummyStudentData: StudentReportData = {
    studentName: "Ahmad Fauzan Rahman",
    studentId: "2024001",
    className: "XII IPA 1",
    semester: "Semester 2",
    academicYear: "2023/2024",
    averageScore: 82.5,
    highestScore: 95,
    lowestScore: 68,
    totalExams: 8,
    teacherName: "Dra. Siti Aminah, M.Pd",
    notes: "Siswa berprestasi dengan kemampuan analitis yang baik. Perlu peningkatan pada materi stoikiometri.",
    examResults: [
        { examTitle: "UTS Matematika", date: "2024-03-15", score: 88, totalQuestions: 40, correctAnswers: 35, duration: "90 menit" },
        { examTitle: "UTS Fisika", date: "2024-03-16", score: 92, totalQuestions: 35, correctAnswers: 32, duration: "90 menit" },
        { examTitle: "UTS Kimia", date: "2024-03-17", score: 78, totalQuestions: 40, correctAnswers: 31, duration: "90 menit" },
        { examTitle: "UTS Biologi", date: "2024-03-18", score: 85, totalQuestions: 50, correctAnswers: 43, duration: "90 menit" },
        { examTitle: "Quiz Aljabar", date: "2024-02-28", score: 95, totalQuestions: 20, correctAnswers: 19, duration: "30 menit" },
        { examTitle: "Quiz Mekanika", date: "2024-02-25", score: 68, totalQuestions: 15, correctAnswers: 10, duration: "30 menit" },
        { examTitle: "Quiz Stoikiometri", date: "2024-02-20", score: 72, totalQuestions: 20, correctAnswers: 14, duration: "30 menit" },
        { examTitle: "Quiz Genetika", date: "2024-02-15", score: 82, totalQuestions: 25, correctAnswers: 21, duration: "30 menit" },
    ],
};

function getGrade(score: number): { grade: string; color: string; bgColor: string } {
    if (score >= 90) return { grade: "A", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" };
    if (score >= 80) return { grade: "B", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" };
    if (score >= 70) return { grade: "C", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" };
    if (score >= 60) return { grade: "D", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" };
    return { grade: "E", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" };
}

export default function ReportCardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [studentData] = useState<StudentReportData>(dummyStudentData);

    const handleDownloadPDF = () => {
        setIsLoading(true);
        try {
            generateStudentReportCard(studentData);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const gradeInfo = getGrade(studentData.averageScore);

    return (
        <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        Rapor Digital
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Lihat dan unduh hasil ujian Anda
                    </p>
                </div>
                <Button onClick={handleDownloadPDF} disabled={isLoading} size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    {isLoading ? "Memproses..." : "Unduh PDF"}
                </Button>
            </div>

            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                        {studentData.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{studentData.studentName}</h2>
                        <div className="flex flex-wrap gap-4 mt-2 justify-center sm:justify-start text-white/80">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {studentData.studentId}
                            </span>
                            <span className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                {studentData.className}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {studentData.semester} - {studentData.academicYear}
                            </span>
                        </div>
                    </div>

                    {/* Grade Badge */}
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                        <span className="text-4xl font-bold">{gradeInfo.grade}</span>
                        <p className="text-sm text-white/80 mt-1">Grade</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border p-5 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                    <p className="text-3xl font-bold">{studentData.averageScore.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                </div>
                <div className="bg-card rounded-xl border p-5 text-center">
                    <Trophy className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-3xl font-bold text-green-600">{studentData.highestScore}</p>
                    <p className="text-sm text-muted-foreground">Nilai Tertinggi</p>
                </div>
                <div className="bg-card rounded-xl border p-5 text-center">
                    <Target className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <p className="text-3xl font-bold text-red-600">{studentData.lowestScore}</p>
                    <p className="text-sm text-muted-foreground">Nilai Terendah</p>
                </div>
                <div className="bg-card rounded-xl border p-5 text-center">
                    <Award className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-3xl font-bold">{studentData.totalExams}</p>
                    <p className="text-sm text-muted-foreground">Total Ujian</p>
                </div>
            </div>

            {/* Score Chart (Visual bar) */}
            <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Grafik Nilai per Ujian
                </h3>
                <div className="space-y-3">
                    {studentData.examResults.map((result, idx) => {
                        const gradeInfo = getGrade(result.score);
                        return (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="w-32 text-sm truncate text-muted-foreground">
                                    {result.examTitle}
                                </span>
                                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3 ${result.score >= 80 ? "bg-green-500" :
                                                result.score >= 70 ? "bg-blue-500" :
                                                    result.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                                            }`}
                                        style={{ width: `${result.score}%` }}
                                    >
                                        <span className="text-white text-xs font-medium">{result.score}</span>
                                    </div>
                                </div>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${gradeInfo.bgColor} ${gradeInfo.color}`}>
                                    {gradeInfo.grade}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Exam Results Table */}
            <div className="bg-card rounded-xl border overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                    <h3 className="font-semibold">Rincian Hasil Ujian</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium">No</th>
                                <th className="text-left p-3 text-sm font-medium">Nama Ujian</th>
                                <th className="text-center p-3 text-sm font-medium">Tanggal</th>
                                <th className="text-center p-3 text-sm font-medium">Benar/Total</th>
                                <th className="text-center p-3 text-sm font-medium">Nilai</th>
                                <th className="text-center p-3 text-sm font-medium">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {studentData.examResults.map((result, idx) => {
                                const gradeInfo = getGrade(result.score);
                                return (
                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-3 text-sm">{idx + 1}</td>
                                        <td className="p-3 text-sm font-medium">{result.examTitle}</td>
                                        <td className="p-3 text-sm text-center text-muted-foreground">{result.date}</td>
                                        <td className="p-3 text-sm text-center">
                                            {result.correctAnswers}/{result.totalQuestions}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="font-bold">{result.score}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`inline-block w-8 h-8 rounded-full ${gradeInfo.bgColor} ${gradeInfo.color} font-bold text-sm leading-8`}>
                                                {gradeInfo.grade}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Teacher Notes */}
            {studentData.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Catatan dari Guru
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">{studentData.notes}</p>
                    {studentData.teacherName && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3">
                            — {studentData.teacherName}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
