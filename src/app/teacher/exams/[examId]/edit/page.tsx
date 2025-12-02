import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { EditorLayout } from "@/components/exam/editor-layout";

type Params = Promise<{ examId: string }>;

export default async function QuestionEditorPage({ params }: { params: Params }) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    const { examId } = await params;

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: {
                orderBy: { createdAt: "asc" },
                include: {
                    options: {
                        orderBy: { createdAt: "asc" }
                    }
                }
            }
        }
    });

    if (!exam) {
        notFound();
    }

    return <EditorLayout exam={exam} questions={exam.questions} />;
}
