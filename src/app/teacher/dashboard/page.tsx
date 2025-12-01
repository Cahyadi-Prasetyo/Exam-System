"use client";

import { StatCard } from "@/components/ui/stat-card";
import { mockExamResults } from "@/lib/mock-teacher-data";
import { useRouter } from "next/navigation";
import { BookOpen, Users, AlertTriangle, TrendingUp, Plus, FileText, ShieldAlert, ChevronRight } from "lucide-react";

export default function TeacherDashboard() {
    const router = useRouter();

    // Calculate stats from mock data
    const totalExams = new Set(mockExamResults.map((r) => r.examId)).size;
    const totalStudents = new Set(mockExamResults.map((r) => r.studentId)).size;
    const averageScore =
        mockExamResults.reduce((sum, r) => sum + r.percentage, 0) / mockExamResults.length;
    const totalViolations = mockExamResults.reduce((sum, r) => sum + r.violations, 0);

    return (
        <div className="min-h-screen bg-indigo-50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Guru</h1>
                    <p className="text-gray-500 mt-1">
                        Selamat datang kembali, Pak Budi. Berikut ringkasan aktivitas ujian hari ini.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        Semester Ganjil 2024/2025
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Ujian"
                    value={totalExams}
                    color="blue"
                    icon={<BookOpen className="w-6 h-6" />}
                    subtitle="Ujian aktif"
                />

                <StatCard
                    title="Rata-rata Nilai"
                    value={`${averageScore.toFixed(1)}%`}
                    color="green"
                    trend={{ value: 5.2, isPositive: true }}
                    icon={<TrendingUp className="w-6 h-6" />}
                    subtitle="Peningkatan"
                />

                <StatCard
                    title="Total Siswa"
                    value={totalStudents}
                    color="blue"
                    icon={<Users className="w-6 h-6" />}
                    subtitle="Mengikuti ujian"
                />

                <StatCard
                    title="Total Pelanggaran"
                    value={totalViolations}
                    color="red"
                    trend={{ value: 12.5, isPositive: false }}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    subtitle="Perlu ditinjau"
                />
            </div>

            {/* Quick Actions Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    Aksi Cepat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push("/teacher/exams/create")}
                        className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Plus className="w-24 h-24 text-blue-600 -mr-8 -mt-8" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Buat Ujian Baru</h3>
                            <p className="text-sm text-gray-500">Buat jadwal dan soal ujian baru untuk siswa</p>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/teacher/results")}
                        className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText className="w-24 h-24 text-indigo-600 -mr-8 -mt-8" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Lihat Hasil Ujian</h3>
                            <p className="text-sm text-gray-500">Analisis nilai dan performa siswa secara detail</p>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/teacher/violations")}
                        className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-md transition-all text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="w-24 h-24 text-red-600 -mr-8 -mt-8" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">Tinjau Pelanggaran</h3>
                            <p className="text-sm text-gray-500">
                                <span className="text-red-600 font-medium">{totalViolations} pelanggaran</span> memerlukan tindakan Anda
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity Placeholder (Optional for future) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p>Belum ada aktivitas ujian terbaru hari ini.</p>
                </div>
            </div>
        </div>
    );
}
