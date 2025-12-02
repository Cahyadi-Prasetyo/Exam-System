import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateExamForm } from "@/components/exam/create-exam-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateExamPage() {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/teacher/exams">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buat Ujian Baru</h1>
                        <p className="text-sm text-gray-500 mt-1">Isi formulir di bawah untuk membuat ujian baru</p>
                    </div>
                </div>

                <CreateExamForm />
            </div>
        </div>
    );
}
