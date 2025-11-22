import Link from "next/link";

export default function DashboardPage() {
    // Mock data for exams
    const exams = [
        {
            id: 1,
            title: "Matematika Wajib - Semester 1",
            subject: "Matematika",
            duration: "90 Menit",
            questionCount: 40,
            status: "available", // available, completed, upcoming
            deadline: "Hari ini, 14:00",
        },
        {
            id: 2,
            title: "Bahasa Indonesia - Paket A",
            subject: "Bahasa Indonesia",
            duration: "60 Menit",
            questionCount: 50,
            status: "upcoming",
            deadline: "Besok, 08:00",
        },
        {
            id: 3,
            title: "Fisika Dasar",
            subject: "Fisika",
            duration: "120 Menit",
            questionCount: 35,
            status: "completed",
            score: 85,
        },
    ];

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Top Navigation */}
            <nav className="border-b border-border bg-background shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                            E
                        </div>
                        Dashboard Siswa
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-medium">Budi Santoso</p>
                            <p className="text-xs text-muted-foreground">Kelas XII IPA 1</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                            BS
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Selamat Datang, Budi!</h1>
                    <p className="text-muted-foreground">Siap untuk ujian hari ini?</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Ujian Selesai</h3>
                        <p className="text-3xl font-bold mt-2">12</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Rata-rata Nilai</h3>
                        <p className="text-3xl font-bold mt-2 text-primary">88.5</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Ujian Akan Datang</h3>
                        <p className="text-3xl font-bold mt-2">2</p>
                    </div>
                </div>

                {/* Exam List */}
                <h2 className="text-xl font-semibold mb-4">Daftar Ujian</h2>
                <div className="grid gap-4">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/50"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                        {exam.subject}
                                    </span>
                                    {exam.status === "available" && (
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            Tersedia
                                        </span>
                                    )}
                                    {exam.status === "upcoming" && (
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            Akan Datang
                                        </span>
                                    )}
                                    {exam.status === "completed" && (
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            Selesai
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold">{exam.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {exam.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        {exam.questionCount} Soal
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {exam.status === "available" ? (
                                    <Link
                                        href={`/exam/${exam.id}`}
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full md:w-auto"
                                    >
                                        Kerjakan Sekarang
                                    </Link>
                                ) : exam.status === "completed" ? (
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Nilai Anda</p>
                                        <p className="text-2xl font-bold text-primary">{exam.score}</p>
                                    </div>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex items-center justify-center rounded-md bg-muted px-6 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed w-full md:w-auto"
                                    >
                                        Belum Dibuka
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
