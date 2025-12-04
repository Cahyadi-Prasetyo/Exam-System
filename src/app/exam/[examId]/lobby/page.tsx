import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { LobbyClient } from "@/components/exam/lobby-client";
import { Clock, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Params = Promise<{ examId: string }>;

export default async function ExamLobbyPage({ params }: { params: Params }) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    const { examId } = await params;

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            _count: {
                select: { questions: true }
            }
        }
    });

    if (!exam) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{exam.title}</h1>
                    <p className="text-indigo-100">
                        {format(new Date(exam.startTime), "EEEE, d MMMM yyyy • HH:mm", { locale: id })}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                            <Clock className="w-6 h-6 text-indigo-600 mb-2" />
                            <span className="text-sm text-gray-500">Durasi</span>
                            <span className="text-lg font-bold text-gray-900">{exam.duration} Menit</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                            <FileText className="w-6 h-6 text-indigo-600 mb-2" />
                            <span className="text-sm text-gray-500">Jumlah Soal</span>
                            <span className="text-lg font-bold text-gray-900">{exam._count.questions} Soal</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Instruksi Penting
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Waktu akan mulai berjalan otomatis setelah Anda menekan tombol mulai.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Pastikan koneksi internet Anda stabil selama ujian berlangsung.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Dilarang membuka tab lain atau aplikasi lain (sistem akan mendeteksi).</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Jawaban akan tersimpan secara otomatis.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t border-gray-100">
                        <LobbyClient examId={exam.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
