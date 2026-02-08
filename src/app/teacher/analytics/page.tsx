"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    AlertTriangle,
    Download,
    PieChart,
    LineChart,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy data for analytics
const examStats = {
    totalExams: 15,
    totalStudents: 245,
    avgScore: 72.5,
    passRate: 78.2,
};

const scoreDistribution = [
    { range: "0-20", count: 5, color: "bg-red-500" },
    { range: "21-40", count: 12, color: "bg-orange-500" },
    { range: "41-60", count: 35, color: "bg-yellow-500" },
    { range: "61-80", count: 85, color: "bg-blue-500" },
    { range: "81-100", count: 63, color: "bg-green-500" },
];

const recentExams = [
    { id: 1, name: "UTS Matematika X-A", date: "2024-03-15", students: 35, avgScore: 76.5 },
    { id: 2, name: "UTS Fisika XI-IPA", date: "2024-03-14", students: 32, avgScore: 68.2 },
    { id: 3, name: "Quiz Kimia XII", date: "2024-03-12", students: 28, avgScore: 82.1 },
    { id: 4, name: "UAS Biologi X-B", date: "2024-03-10", students: 34, avgScore: 71.8 },
];

const mostMissedQuestions = [
    { id: 1, question: "Rumus percepatan pada gerak...", exam: "UTS Fisika", wrongRate: 68 },
    { id: 2, question: "Nilai x dari persamaan...", exam: "UTS Matematika", wrongRate: 54 },
    { id: 3, question: "Struktur sel prokariotik...", exam: "UAS Biologi", wrongRate: 48 },
    { id: 4, question: "Reaksi oksidasi-reduksi...", exam: "Quiz Kimia", wrongRate: 42 },
];

const monthlyTrends = [
    { month: "Jan", avgScore: 68, students: 180 },
    { month: "Feb", avgScore: 72, students: 195 },
    { month: "Mar", avgScore: 75, students: 210 },
    { month: "Apr", avgScore: 71, students: 225 },
    { month: "May", avgScore: 78, students: 240 },
    { month: "Jun", avgScore: 80, students: 245 },
];

export default function AnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "semester">("month");

    const maxCount = Math.max(...scoreDistribution.map(s => s.count));
    const maxMonthlyStudents = Math.max(...monthlyTrends.map(t => t.students));

    const handleExport = (type: string) => {
        alert(`Export ${type} berhasil! (Demo)`);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-600" />
                        Analitik Ujian
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Statistik dan analisis hasil ujian
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as "week" | "month" | "semester")}
                        className="px-4 py-2 border rounded-lg bg-background"
                    >
                        <option value="week">7 Hari Terakhir</option>
                        <option value="month">30 Hari Terakhir</option>
                        <option value="semester">Semester Ini</option>
                    </select>
                    <Button variant="outline" onClick={() => handleExport("PDF")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleExport("Excel")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <BarChart3 className="w-10 h-10 opacity-80" />
                        <span className="text-3xl font-bold">{examStats.totalExams}</span>
                    </div>
                    <p className="mt-2 text-white/80">Total Ujian</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <Users className="w-10 h-10 opacity-80" />
                        <span className="text-3xl font-bold">{examStats.totalStudents}</span>
                    </div>
                    <p className="mt-2 text-white/80">Total Peserta</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <TrendingUp className="w-10 h-10 opacity-80" />
                        <span className="text-3xl font-bold">{examStats.avgScore}</span>
                    </div>
                    <p className="mt-2 text-white/80">Rata-rata Nilai</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <PieChart className="w-10 h-10 opacity-80" />
                        <span className="text-3xl font-bold">{examStats.passRate}%</span>
                    </div>
                    <p className="mt-2 text-white/80">Tingkat Kelulusan</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution Chart */}
                <div className="bg-card rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Distribusi Nilai
                    </h2>
                    <div className="space-y-3">
                        {scoreDistribution.map((item) => (
                            <div key={item.range} className="flex items-center gap-3">
                                <span className="w-16 text-sm text-muted-foreground">{item.range}</span>
                                <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                                    <div
                                        className={`${item.color} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                                    >
                                        <span className="text-white text-sm font-medium">{item.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                        <span>0</span>
                        <span>Jumlah Siswa</span>
                        <span>{maxCount}</span>
                    </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-card rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-purple-600" />
                        Tren Bulanan
                    </h2>
                    <div className="flex items-end gap-2 h-48">
                        {monthlyTrends.map((item, index) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center gap-1">
                                    <span className="text-xs font-medium">{item.avgScore}</span>
                                    <div
                                        className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md transition-all duration-500"
                                        style={{ height: `${(item.avgScore / 100) * 150}px` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">{item.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded" />
                            <span className="text-muted-foreground">Rata-rata Nilai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Exams */}
                <div className="bg-card rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Ujian Terbaru
                    </h2>
                    <div className="space-y-3">
                        {recentExams.map((exam) => (
                            <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                <div>
                                    <p className="font-medium">{exam.name}</p>
                                    <p className="text-sm text-muted-foreground">{exam.date} • {exam.students} siswa</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${exam.avgScore >= 75 ? "text-green-600" :
                                            exam.avgScore >= 60 ? "text-yellow-600" : "text-red-600"
                                        }`}>
                                        {exam.avgScore}
                                    </span>
                                    <p className="text-xs text-muted-foreground">rata-rata</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Most Missed Questions */}
                <div className="bg-card rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Soal Paling Sulit
                    </h2>
                    <div className="space-y-3">
                        {mostMissedQuestions.map((q, index) => (
                            <div key={q.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? "bg-red-500" :
                                        index === 1 ? "bg-orange-500" :
                                            index === 2 ? "bg-yellow-500" : "bg-gray-400"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{q.question}</p>
                                    <p className="text-sm text-muted-foreground">{q.exam}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-red-600">{q.wrongRate}%</span>
                                    <p className="text-xs text-muted-foreground">salah</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
