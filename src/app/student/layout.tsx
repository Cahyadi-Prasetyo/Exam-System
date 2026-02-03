import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BookOpen, User } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background">
            {/* Header */}
            <header className="bg-background border-b border-border sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-foreground">ExamSystem</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground">Siswa</p>
                        </div>
                        <Link
                            href="/student/profile"
                            className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 hover:bg-indigo-200 transition-colors"
                            title="Profil Saya"
                        >
                            <User className="w-4 h-4 text-indigo-600" />
                        </Link>
                        <div className="pl-3 border-l border-border ml-3">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}
