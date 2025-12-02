import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExamListTable } from "@/components/exam/exam-list-table";
import { ExamSearch } from "@/components/exam/exam-search";
import { ExamPagination } from "@/components/exam/exam-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ExamManagementPage({
    searchParams,
}: {
    searchParams: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    const params = await searchParams;
    const query = params?.query || "";
    const currentPage = Number(params?.page) || 1;
    const itemsPerPage = 10;
    const skip = (currentPage - 1) * itemsPerPage;

    // Fetch exams with search and pagination
    const where = {
        title: {
            contains: query,
            mode: "insensitive" as const,
        },
    };

    const [exams, totalCount] = await Promise.all([
        prisma.exam.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: itemsPerPage,
            skip,
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        }),
        prisma.exam.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Ujian</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola daftar ujian, buat ujian baru, dan pantau statusnya</p>
                    </div>
                    <Link href="/teacher/exams/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Ujian Baru
                        </Button>
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <ExamSearch />
                </div>

                {/* Exam List */}
                <div className="space-y-4">
                    <ExamListTable exams={exams} />

                    {totalPages > 1 && (
                        <ExamPagination totalPages={totalPages} />
                    )}
                </div>
            </div>
        </div>
    );
}
