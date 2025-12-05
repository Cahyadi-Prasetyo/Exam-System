"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    ExamResult,
    getScoreColor,
    getScoreBgColor,
} from "@/lib/mock-teacher-data"; // Keeping types/helpers, but not data
import { GradeAdjustmentModal } from "@/components/teacher/grade-adjustment-modal";
import { getAllExamResults } from "@/actions/teacher-actions";
import { Loader2 } from "lucide-react";

export default function ExamResultsPage() {
    const router = useRouter();
    const [data, setData] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

    useEffect(() => {
        async function fetchResults() {
            const res = await getAllExamResults();
            if (Array.isArray(res)) {
                setData(res as ExamResult[]);
            }
            setIsLoading(false);
        }
        fetchResults();
    }, []);

    const handleExportCSV = () => {
        // Basic CSV export logic
        const headers = [
            "Student Name",
            "NISN",
            "Exam Title",
            "Score",
            "Original Score",
            "Adjustment",
            "Violations",
            "Status",
            "Published",
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
                    row.originalScore,
                    row.manualAdjustment + row.bonusPoints,
                    row.violations,
                    row.status,
                    row.isPublished ? "Yes" : "No",
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

    const handleAdjustClick = (result: ExamResult) => {
        setSelectedResult(result);
        setIsAdjustmentModalOpen(true);
    };

    const handleSaveAdjustment = (id: string, adjustment: number, bonus: number, reason: string) => {
        // TODO: Implement server action for saving adjustment
        console.log("Saving adjustment:", { id, adjustment, bonus, reason });

        setData((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newScore = Math.min(
                        item.maxScore,
                        Math.max(0, item.originalScore + adjustment + bonus)
                    );
                    return {
                        ...item,
                        manualAdjustment: adjustment,
                        bonusPoints: bonus,
                        score: newScore,
                        percentage: (newScore / item.maxScore) * 100,
                        adjustmentReason: reason,
                        adjustedBy: "Current User", // Mock user
                        adjustedAt: new Date(),
                    };
                }
                return item;
            })
        );
    };

    const handleTogglePublish = (shouldPublish: boolean) => {
        if (confirm(`Apakah Anda yakin ingin ${shouldPublish ? 'mempublikasikan' : 'menyembunyikan'} semua nilai?`)) {
            // TODO: Implement server action for bulk publish
            setData((prev) => prev.map(item => ({ ...item, isPublished: shouldPublish })));
        }
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
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span
                            className={`font-medium ${getScoreBgColor(
                                row.percentage
                            )} ${getScoreColor(row.percentage)}`}
                        >
                            {row.score} / {row.maxScore}
                        </span>
                        {!row.isPublished && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                Hidden
                            </span>
                        )}
                    </div>
                    {(row.manualAdjustment !== 0 || row.bonusPoints !== 0) && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                            (Orig: {row.originalScore}
                            {row.manualAdjustment !== 0 ? ` ${row.manualAdjustment > 0 ? '+' : ''}${row.manualAdjustment}` : ''}
                            {row.bonusPoints > 0 ? ` +${row.bonusPoints}B` : ''})
                        </span>
                    )}
                </div>
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
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/teacher/results/${row.studentId}/${row.examId}`)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                        Detail
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustClick(row)}
                    >
                        Adjust
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hasil Ujian</h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Daftar nilai dan performa siswa secara detail
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-md shadow-sm">
                        <Button
                            variant="outline"
                            className="rounded-r-none border-r-0"
                            onClick={() => handleTogglePublish(true)}
                        >
                            Publish All
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-l-none"
                            onClick={() => handleTogglePublish(false)}
                        >
                            Unpublish All
                        </Button>
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
            </div>

            {/* Content */}
            <div className="bg-background rounded-lg p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <DataTable
                        data={data}
                        columns={columns}
                        searchKey="studentName"
                        pageSize={10}
                    />
                )}
            </div>

            <GradeAdjustmentModal
                result={selectedResult}
                isOpen={isAdjustmentModalOpen}
                onClose={() => setIsAdjustmentModalOpen(false)}
                onSave={handleSaveAdjustment}
            />
        </div>
    );
}
