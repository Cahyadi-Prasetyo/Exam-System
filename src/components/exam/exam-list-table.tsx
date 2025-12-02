"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Exam {
    id: string;
    title: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    _count?: {
        questions: number;
    };
}

interface ExamListTableProps {
    exams: Exam[];
}

export function ExamListTable({ exams }: ExamListTableProps) {
    if (exams.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500">Belum ada ujian yang dibuat.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-4">Judul Ujian</th>
                            <th className="px-6 py-4">Durasi</th>
                            <th className="px-6 py-4">Waktu Mulai</th>
                            <th className="px-6 py-4">Waktu Selesai</th>
                            <th className="px-6 py-4">Soal</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {exams.map((exam) => (
                            <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {exam.title}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {exam.duration} Menit
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {format(new Date(exam.startTime), "d MMM yyyy, HH:mm", { locale: id })}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {format(new Date(exam.endTime), "d MMM yyyy, HH:mm", { locale: id })}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {exam._count?.questions || 0} Soal
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/teacher/exams/${exam.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
