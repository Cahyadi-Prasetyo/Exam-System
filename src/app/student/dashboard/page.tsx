import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { JoinExamForm } from "@/components/student/join-exam-form";
import { BookOpen, History, User, Settings } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";

export default async function StudentDashboardPage() {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-gray-900">ExamSystem</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                            <p className="text-xs text-gray-500">Siswa</p>
                        </div>
                        <Link
                            href="/student/profile"
                            className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 hover:bg-indigo-200 transition-colors"
                            title="Profil Saya"
                        >
                            <User className="w-4 h-4 text-indigo-600" />
                        </Link>
                        <div className="pl-3 border-l border-gray-200 ml-3">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Join Exam */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang! 👋</h1>
                            <p className="text-gray-500 mt-2 text-lg">
                                Siap untuk ujian hari ini? Masukkan kode token yang diberikan oleh gurumu untuk memulai.
                            </p>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                            <JoinExamForm />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg h-fit">
                                <History className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900">Riwayat Ujian</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Lihat nilai dan pembahasan ujian yang telah kamu selesaikan di menu Riwayat.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Illustration or Info */}
                    <div className="hidden md:block relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl transform rotate-3" />
                        <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-semibold text-gray-900 text-lg">Panduan Ujian</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">1</span>
                                    <p className="text-gray-600 text-sm">Pastikan koneksi internet stabil sebelum memulai ujian.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">2</span>
                                    <p className="text-gray-600 text-sm">Dilarang membuka tab lain atau keluar dari mode layar penuh.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">3</span>
                                    <p className="text-gray-600 text-sm">Waktu akan terus berjalan meskipun kamu keluar dari halaman ujian.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">4</span>
                                    <p className="text-gray-600 text-sm">Jawaban tersimpan otomatis setiap beberapa detik.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
