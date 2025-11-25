"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExamResultNotificationCard } from "@/components/ui/exam-result-notification";

export default function DashboardPage() {
    const router = useRouter();
    const [examCode, setExamCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [resultNotifications, setResultNotifications] = useState<any[]>([]);

    // Load notifications from localStorage (demo purposes)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem("examResultNotifications");
            if (stored) {
                try {
                    const notifications = JSON.parse(stored);
                    setResultNotifications(notifications);
                } catch (error) {
                    console.error("Failed to parse notifications", error);
                }
            }
        }
    }, []);

    const handleDismissNotification = (id: string) => {
        const updated = resultNotifications.filter((n) => n.id !== id);
        setResultNotifications(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("examResultNotifications", JSON.stringify(updated));
        }
    };

    const handleSubmitCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!examCode.trim()) return;

        setIsValidating(true);
        // Simulasi validasi kode
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Redirect ke konfirmasi ujian
        router.push(`/exam/confirm?code=${examCode}`);
    };

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Navbar */}
            <nav className="border-b border-border bg-background shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M22 10v6M2 10v6" />
                                <path d="M20 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                <path d="M15 22a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z" />
                                <path d="M5 22a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z" />
                            </svg>
                        </div>
                        <span className="hidden sm:inline">Exam System</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-medium">Budi Santoso</p>
                            <p className="text-xs text-muted-foreground">XII IPA 1</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-border text-primary font-semibold">
                            BS
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="ml-2 hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Selamat Datang, Budi! 👋
                    </h1>
                    <p className="text-muted-foreground">Siap untuk ujian hari ini?</p>
                </div>

                {/* Exam Result Notifications */}
                {resultNotifications.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {resultNotifications.map((notification) => (
                            <ExamResultNotificationCard
                                key={notification.id}
                                notification={notification}
                                onDismiss={handleDismissNotification}
                            />
                        ))}
                    </div>
                )}

                {/* Input Kode Ujian - Primary CTA */}
                <Card className="mb-8 border-2 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0  01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                            Masukkan Kode Ujian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitCode} className="flex flex-col sm:flex-row gap-3">
                            <Input
                                value={examCode}
                                onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                                placeholder="Contoh: MTK-2024-A1"
                                className="flex-1 font-mono text-lg"
                                maxLength={20}
                            />
                            <Button
                                type="submit"
                                size="lg"
                                isLoading={isValidating}
                                disabled={!examCode.trim()}
                                className="sm:w-auto"
                            >
                                {isValidating ? "Memvalidasi..." : "Mulai Ujian"}
                            </Button>
                        </form>
                        <p className="text-sm text-muted-foreground mt-3">
                            Masukkan kode ujian yang diberikan oleh guru Anda
                        </p>
                    </CardContent>
                </Card>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Notifications Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    Notifikasi
                                </span>
                                <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-1">
                                    2
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Notification items */}
                            <div className="p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-blue-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Ujian Fisika - Besok</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ujian Fisika Dasar akan dimulai besok pukul 08:00 WIB
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">2 jam yang lalu</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-yellow-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Pengumuman</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Libur sekolah tanggal 25 November 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">1 hari yang lalu</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Profil Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary text-primary font-bold text-xl">
                                    BS
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Budi Santoso</p>
                                    <p className="text-sm text-muted-foreground">XII IPA 1</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-border">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">NISN</span>
                                    <span className="font-medium">1234567890</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium">budi@sekolah.sch.id</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Angkatan</span>
                                    <span className="font-medium">2024</span>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full mt-4">
                                Edit Profil
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
