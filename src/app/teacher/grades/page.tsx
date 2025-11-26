"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    mockExamResults,
    ExamResult,
    getScoreColor,
    getScoreBgColor,
} from "@/lib/mock-teacher-data";
import { GradeAdjustmentModal } from "@/components/teacher/grade-adjustment-modal";

export default function GradeManagementPage() {
    const [data, setData] = useState<ExamResult[]>(mockExamResults);
    const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "adjusted">("all");

    const handleAdjustClick = (result: ExamResult) => {
        setSelectedResult(result);
        setIsAdjustmentModalOpen(true);
    };

    const handleSaveAdjustment = (id: string, adjustment: number, bonus: number, reason: string) => {
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

    const filteredData = filter === "all"
        ? data
        : data.filter(r => r.manualAdjustment !== 0 || r.bonusPoints !== 0);

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
            header: "Nilai Original",
            accessorKey: "originalScore" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span className="text-muted-foreground font-mono">
                    {row.originalScore}
                </span>
            ),
        },
        {
            header: "Penyesuaian",
            accessorKey: "manualAdjustment" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <div className="flex flex-col text-xs">
                    {row.manualAdjustment !== 0 && (
                        <span className={row.manualAdjustment > 0 ? "text-green-600" : "text-red-600"}>
                            Manual: {row.manualAdjustment > 0 ? "+" : ""}{row.manualAdjustment}
                        </span>
                    )}
                    {row.bonusPoints > 0 && (
                        <span className="text-blue-600">
                            Bonus: +{row.bonusPoints}
                        </span>
                    )}
                    {row.manualAdjustment === 0 && row.bonusPoints === 0 && (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            ),
        },
        {
            header: "Nilai Akhir",
            accessorKey: "score" as keyof ExamResult,
            sortable: true,
            cell: (row: ExamResult) => (
                <span
                    className={`font-bold text-lg ${getScoreColor(row.percentage)}`}
                >
                    {row.score}
                </span>
            ),
        },
        {
            header: "Alasan",
            accessorKey: "adjustmentReason" as keyof ExamResult,
            cell: (row: ExamResult) => (
                <span className="text-sm text-muted-foreground italic truncate max-w-[200px] block">
                    {row.adjustmentReason || "-"}
                </span>
            ),
        },
        {
            header: "Aksi",
            accessorKey: "id" as keyof ExamResult,
            cell: (row: ExamResult) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustClick(row)}
                >
                    Adjust
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Nilai</h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Kelola nilai siswa, berikan bonus, atau penyesuaian manual
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-muted rounded-lg">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "all"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Semua Siswa
                    </button>
                    <button
                        onClick={() => setFilter("adjusted")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "adjusted"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Telah Disesuaikan
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                <DataTable
                    data={filteredData}
                    columns={columns}
                    searchKey="studentName"
                    pageSize={10}
                />
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
