import { TeacherLayoutClient } from "@/components/layout/teacher-layout-client";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TeacherLayoutClient>
            {children}
        </TeacherLayoutClient>
    );
}
