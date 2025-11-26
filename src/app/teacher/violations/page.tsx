"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { mockViolations, Violation } from "@/lib/mock-teacher-data";
import { ViolationDetailModal } from "@/components/teacher/violation-detail-modal";

export default function ViolationsPage() {
    const [data, setData] = useState<Violation[]>(mockViolations);
    const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReview = (violation: Violation) => {
        setSelectedViolation(violation);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = (id: string, status: "verified" | "dismissed", notes?: string) => {
        setData((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, status, teacherNotes: notes } : v
            )
        );
    };

    const columns = [
        {
            header: "Nama Siswa",
            accessorKey: "studentName" as keyof Violation,
            sortable: true,
            cell: (row: Violation) => (
                <div className="font-medium">{row.studentName}</div>
            ),
        },
        {
            header: "Ujian",
            accessorKey: "examTitle" as keyof Violation,
            sortable: true,
        },
        {
            header: "Jenis Pelanggaran",
            accessorKey: "type" as keyof Violation,
            sortable: true,
            cell: (row: Violation) => {
                const typeMap = {
                    tab_switch: {
                        label: "Pindah Tab",
                        color: "text-amber-600 dark:text-amber-400",
                    },
                    right_click: {
                        label: "Klik Kanan",
                        color: "text-rose-600 dark:text-rose-400",
                    },
                    copy_paste: {
                        label: "Copy Paste",
                        color: "text-purple-600 dark:text-purple-400",
                    },
                };
                const config = typeMap[row.type] || {
                    label: row.type,
                    color: "text-gray-600 dark:text-gray-400",
                };

                return (
                    <span className={`font-medium ${config.color}`}>
                        {config.label}
                    </span>
                );
            },
        },
        {
            header: "Waktu",
            accessorKey: "timestamp" as keyof Violation,
            sortable: true,
            cell: (row: Violation) => (
                <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                    {new Date(row.timestamp).toLocaleString("id-ID")}
                </span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status" as keyof Violation,
            sortable: true,
            cell: (row: Violation) => {
                const statusColors = {
                    pending: "text-yellow-600",
                    verified: "text-red-600 font-bold",
                    dismissed: "text-gray-400 line-through",
                };
                return (
                    <span className={`text-sm capitalize ${statusColors[row.status || 'pending']}`}>
                        {row.status === 'verified' ? 'Terverifikasi' :
                            row.status === 'dismissed' ? 'Diabaikan' : 'Menunggu'}
                    </span>
                );
            },
        },
        {
            header: "Aksi",
            accessorKey: "id" as keyof Violation,
            cell: (row: Violation) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(row)}
                        disabled={row.status !== 'pending'}
                    >
                        {row.status === 'pending' ? 'Tinjau' : 'Detail'}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tinjauan Pelanggaran</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                    Daftar pelanggaran yang terdeteksi sistem dan perlu ditinjau
                </p>
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

            <ViolationDetailModal
                violation={selectedViolation}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
