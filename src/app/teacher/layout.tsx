import { TeacherSidebar } from "@/components/layout/teacher-sidebar";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/20">
            <TeacherSidebar />
            <main className="pl-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
