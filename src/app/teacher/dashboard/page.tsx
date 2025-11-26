"use client";

import { StatCard } from "@/components/ui/stat-card";
import { mockExamResults } from "@/lib/mock-teacher-data";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();

    // Calculate stats from mock data
    const totalExams = new Set(mockExamResults.map((r) => r.examId)).size;
    const totalStudents = new Set(mockExamResults.map((r) => r.studentId)).size;
    const averageScore =
        mockExamResults.reduce((sum, r) => sum + r.percentage, 0) / mockExamResults.length;
    const totalViolations = mockExamResults.reduce((sum, r) => sum + r.violations, 0);

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage exams, view results, and monitor student performance
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm text-muted-foreground hover:text-foreground transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Ujian"
                        value={totalExams}
                        color="blue"
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        }
                    />

                    <StatCard
                        title="Rata-rata Nilai"
                        value={`${averageScore.toFixed(1)}%`}
                        color="green"
                        trend={{ value: 5.2, isPositive: true }}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        }
                    />

                    <StatCard
                        title="Total Siswa"
                        value={totalStudents}
                        color="blue"
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        }
                    />

                    <StatCard
                        title="Total Pelanggaran"
                        value={totalViolations}
                        color="red"
                        trend={{ value: 12.5, isPositive: false }}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        }
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push("/teacher/results")}
                        className="bg-background border-2 border-border rounded-lg p-6 hover:border-primary transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Lihat Hasil Ujian</h3>
                                <p className="text-sm text-muted-foreground">
                                    Tinjau nilai dan performa siswa
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/teacher/violations")}
                        className="bg-background border-2 border-border rounded-lg p-6 hover:border-primary transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Tinjau Pelanggaran</h3>
                                <p className="text-sm text-muted-foreground">
                                    {totalViolations} pelanggaran perlu ditinjau
                                </p>
                            </div>
                        </div>
                    </button>

                    <button className="bg-background border-2 border-border rounded-lg p-6 hover:border-primary transition-colors text-left">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Buat Ujian Baru</h3>
                                <p className="text-sm text-muted-foreground">Tambah ujian baru</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
