"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, School } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email atau password salah");
                setIsLoading(false);
                return;
            }

            // Fetch session to get user role
            const response = await fetch("/api/auth/session");
            const session = await response.json();

            // Redirect based on role
            if (session?.user?.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else if (session?.user?.role === "TEACHER") {
                router.push("/teacher/dashboard");
            } else if (session?.user?.role === "STUDENT") {
                router.push("/student/dashboard");
            } else {
                router.push("/");
            }
            router.refresh();
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-primary rounded-xl shadow-sm">
                        <School className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Sistem Ujian Online
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Silakan masuk untuk melanjutkan
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-foreground"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background text-foreground"
                                placeholder="nama@sekolah.sch.id"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background text-foreground"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-colors"
                            isLoading={isLoading}
                        >
                            Masuk
                        </Button>
                    </form>
                </div>

                {/* Demo Accounts Helper */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-4">
                        Akun Demo (Klik untuk copy)
                    </p>
                    <div className="flex justify-center gap-3 text-xs">
                        <button
                            onClick={() => { setEmail("admin@exam.com"); setPassword("password123"); }}
                            className="px-3 py-1.5 bg-card border border-border rounded-md hover:border-primary hover:text-primary transition-colors text-foreground"
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => { setEmail("teacher@exam.com"); setPassword("password123"); }}
                            className="px-3 py-1.5 bg-card border border-border rounded-md hover:border-primary hover:text-primary transition-colors text-foreground"
                        >
                            Guru
                        </button>
                        <button
                            onClick={() => { setEmail("student@exam.com"); setPassword("password123"); }}
                            className="px-3 py-1.5 bg-card border border-border rounded-md hover:border-primary hover:text-primary transition-colors text-foreground"
                        >
                            Siswa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
