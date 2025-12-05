import { TeacherLayoutClient } from "@/components/layout/teacher-layout-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    return (
        <TeacherLayoutClient user={session.user}>
            {children}
        </TeacherLayoutClient>
    );
}
