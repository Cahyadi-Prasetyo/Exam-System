import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { JoinExamForm } from "@/components/student/join-exam-form";
import { History } from "lucide-react";

export default async function StudentDashboardPage() {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left Column: Join Exam */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Selamat Datang! 👋</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                            Siap untuk ujian hari ini? Masukkan kode token yang diberikan oleh gurumu untuk memulai.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-border">
                        <JoinExamForm />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg h-fit">
                            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Riwayat Ujian</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Lihat nilai dan pembahasan ujian yang telah kamu selesaikan di menu Riwayat.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Illustration or Info */}
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-3xl transform rotate-3" />
                    <div className="relative bg-white dark:bg-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-border space-y-6">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Panduan Ujian</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Pastikan koneksi internet stabil sebelum memulai ujian.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">2</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Dilarang membuka tab lain atau keluar dari mode layar penuh.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">3</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Waktu akan terus berjalan meskipun kamu keluar dari halaman ujian.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">4</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Jawaban tersimpan otomatis setiap beberapa detik.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
