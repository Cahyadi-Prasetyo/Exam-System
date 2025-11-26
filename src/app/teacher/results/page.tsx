"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    mockExamResults,
    ExamResult,
    getScoreColor,
    getScoreBgColor,
} from "@/lib/mock-teacher-data";

export default function ExamResultsPage() {
    const router = useRouter();
    const [data] = useState<ExamResult[]>(mockExamResults);

    const handleExportCSV = () => {
        // Basic CSV export logic
        const headers = [
            "Student Name",
            "NISN",
            "Exam Title",
            "Score",
            "Violations",
            "Status",
            "Submitted At",
        ];
        const csvContent = [
            headers.join(","),
            ...data.map((row) =>
                [
                    `"${row.studentName}"`,
                    `"${row.nisn}"`,
                    `"${row.examTitle}"`,
                    row.score,
                    row.violations,
                    row.status,
                    new Date(row.submittedAt).toLocaleString(),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "exam_results.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        {
            header: "Nama Siswa",
            accessorKey: "studentName" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <div>
                    <div className="font-medium">{row.studentName}</div>
                    <div className="text-xs text-muted-foreground">{row.nisn}</div>
                </div>
            ),
        },
        {
            header: "Ujian",
            accessorKey: "examTitle" as keyof ExamResult,
            sortable: true,
        },
        {
            header: "Nilai",
            accessorKey: "score" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span
                    className={`font-medium ${getScoreBgColor(
                        row.percentage
                    )} ${getScoreColor(row.percentage)}`}
                >
                    {row.score} / {row.maxScore}
                </span>
            ),
        },
        {
            header: "Durasi",
            accessorKey: "duration" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => {
                const minutes = Math.floor(row.duration / 60);
                return <span>{minutes} min</span>;
            },
        },
        {
            header: "Pelanggaran",
            accessorKey: "violations" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span
                    className={`font-medium ${row.violations > 0 ? "text-red-600" : "text-green-600"
                        }`}
                >
                    {row.violations}
                </span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span className="capitalize text-muted-foreground">{row.status}</span>
            ),
        },
        {
            header: "Waktu Submit",
            accessorKey: "submittedAt" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                    {new Date(row.submittedAt).toLocaleDateString("id-ID")}
                </span>
            ),
        },
        {
            header: "Aksi",
            accessorKey: "id" as keyof ExamResult,
            cell: (row: ExamResult) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/teacher/results/${row.studentId}/${row.examId}`)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hasil Ujian</h1>
                    <p className="text-muted-foreground mt-2">
                        Daftar nilai dan performa siswa secara detail
                    </p>
                </div>
                <Button onClick={handleExportCSV} variant="outline">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Export CSV
                </Button>
            </div>

            {/* Content */}
            <div className="bg-background rounded-lg p-6">
                <DataTable
                    data={data}
                    columns={columns}
                    searchKey="studentName"
                    pageSize={10}
                />
            </div>
        </div>
    );
}
