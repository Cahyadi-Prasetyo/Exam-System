import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ExamPlayClient } from "@/components/exam/exam-play-client";

type Params = Promise<{ examId: string }>;

export default async function ExamPlayPage({ params }: { params: Params }) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    const { examId } = await params;

    // Fetch Exam with Questions and Options
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: {
                include: {
                    options: true
                },
                orderBy: { createdAt: "asc" } // Or custom order
            }
        }
    });

    if (!exam) {
        notFound();
    }

    if (exam.questions.length === 0) {
        // Redirect to lobby if no questions are available
        redirect(`/exam/${examId}/lobby?error=no_questions`);
    }

    // Fetch Attempt
    const attempt = await prisma.examAttempt.findFirst({
        where: {
            userId: session.user.id,
            examId: examId,
        },
        include: {
            answers: true
        }
    });

    if (!attempt) {
        redirect(`/exam/${examId}/lobby`);
    }

    if (attempt.status === "SUBMITTED" || attempt.status === "COMPLETED") {
        redirect("/student/dashboard"); // Or results page
    }

    return <ExamPlayClient exam={exam} attempt={attempt} />;
}
