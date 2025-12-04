"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const joinExamSchema = z.object({
    token: z.string().min(6, "Token harus 6 karakter").max(6, "Token harus 6 karakter"),
});

export async function joinExam(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    const validatedFields = joinExamSchema.safeParse({
        token: formData.get("token"),
    });

    if (!validatedFields.success) {
        return {
            error: "Token tidak valid",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { token } = validatedFields.data;

    try {
        // Find exam by token
        // Cast to any to bypass stale Prisma Client types
        const exam = await prisma.exam.findFirst({
            where: { token } as any,
        }) as any;

        if (!exam) {
            return { error: "Ujian tidak ditemukan. Periksa kembali token Anda." };
        }

        if (exam.status !== "PUBLISHED") {
            return { error: "Ujian belum dimulai atau sudah ditutup." };
        }

        // Check if attempt already exists
        const existingAttempt = await prisma.examAttempt.findFirst({
            where: {
                userId: session.user.id,
                examId: exam.id,
            },
        });

        if (existingAttempt) {
            // If already submitted, prevent re-entry (unless we allow retakes, but for now strict)
            if (existingAttempt.status === "SUBMITTED" || existingAttempt.status === "COMPLETED") {
                return { error: "Anda sudah menyelesaikan ujian ini." };
            }
            // If in progress, redirect to lobby/play
            redirect(`/exam/${exam.id}/lobby`);
        }

        // Redirect to lobby
        redirect(`/exam/${exam.id}/lobby`);
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Failed to join exam:", error);
        return { error: "Gagal bergabung ke ujian." };
    }
}

export async function startExam(examId: string) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
        });

        if (!exam) return { error: "Exam not found" };

        // Check for existing attempt
        const existingAttempt = await prisma.examAttempt.findFirst({
            where: {
                userId: session.user.id,
                examId: examId,
            },
        });

        if (existingAttempt) {
            if (existingAttempt.status === "SUBMITTED" || existingAttempt.status === "COMPLETED") {
                return { error: "Anda sudah menyelesaikan ujian ini." };
            }
            // Resume attempt
            redirect(`/exam/${examId}/play`);
        }

        // Create new attempt
        await prisma.examAttempt.create({
            data: {
                userId: session.user.id,
                examId: examId,
                status: "IN_PROGRESS",
                startTime: new Date(),
            },
        });

        redirect(`/exam/${examId}/play`);
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Failed to start exam:", error);
        return { error: "Gagal memulai ujian." };
    }
}

export async function submitAnswer(attemptId: string, questionId: string, answerText: string) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    try {
        const existingAnswer = await prisma.answer.findFirst({
            where: {
                examAttemptId: attemptId,
                questionId: questionId
            }
        });

        if (existingAnswer) {
            await prisma.answer.update({
                where: { id: existingAnswer.id },
                data: { answerText }
            });
        } else {
            await prisma.answer.create({
                data: {
                    examAttemptId: attemptId,
                    questionId,
                    answerText
                }
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to submit answer:", error);
        return { error: "Failed to save answer" };
    }
}

export async function finishExam(attemptId: string) {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                status: "SUBMITTED",
                endTime: new Date()
            }
        });

        redirect("/student/dashboard");
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Failed to finish exam:", error);
        return { error: "Failed to finish exam" };
    }
}
