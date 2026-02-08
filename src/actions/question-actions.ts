"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const questionSchema = z.object({
    text: z.string().optional(),
    imageUrl: z.string().optional().nullable(), // Allow null to remove image
    type: z.enum(["MULTIPLE_CHOICE", "ESSAY"]).optional(),
});

const optionSchema = z.object({
    text: z.string().optional(),
    isCorrect: z.boolean().optional(),
});

export async function createQuestion(examId: string) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        const question = await prisma.question.create({
            data: {
                examId,
                text: "Pertanyaan Baru",
                type: "MULTIPLE_CHOICE",
            },
        });
        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true, data: question };
    } catch (error) {
        return { error: "Gagal membuat pertanyaan" };
    }
}

export async function updateQuestion(questionId: string, data: z.infer<typeof questionSchema>) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        const question = await prisma.question.update({
            where: { id: questionId },
            data,
        });
        revalidatePath(`/teacher/exams/${question.examId}/edit`);
        return { success: true, data: question };
    } catch (error) {
        return { error: "Gagal mengupdate pertanyaan" };
    }
}

export async function deleteQuestion(questionId: string, examId: string) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        await prisma.question.delete({
            where: { id: questionId },
        });
        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus pertanyaan" };
    }
}

export async function createOption(questionId: string, examId: string) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        const option = await prisma.option.create({
            data: {
                questionId,
                text: "Opsi Baru",
                isCorrect: false,
            },
        });
        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true, data: option };
    } catch (error) {
        return { error: "Gagal membuat opsi" };
    }
}

export async function updateOption(optionId: string, examId: string, data: z.infer<typeof optionSchema>) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        // If setting isCorrect to true, we might want to set others to false (for single choice)
        // But for now let's keep it simple, maybe multiple correct answers are allowed?
        // Usually multiple choice has one correct answer.

        if (data.isCorrect) {
            // Find the option to get questionId
            const opt = await prisma.option.findUnique({ where: { id: optionId } });
            if (opt) {
                await prisma.option.updateMany({
                    where: { questionId: opt.questionId, id: { not: optionId } },
                    data: { isCorrect: false }
                });
            }
        }

        const option = await prisma.option.update({
            where: { id: optionId },
            data,
        });
        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true, data: option };
    } catch (error) {
        return { error: "Gagal mengupdate opsi" };
    }
}

export async function deleteOption(optionId: string, examId: string) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        await prisma.option.delete({
            where: { id: optionId },
        });
        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus opsi" };
    }
}

interface BankQuestionData {
    text: string;
    type: "MULTIPLE_CHOICE" | "ESSAY";
    options?: string[];
    correctAnswer?: number;
}

export async function createQuestionFromBank(examId: string, data: BankQuestionData) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") return { error: "Unauthorized" };

    try {
        // Create the question
        const question = await prisma.question.create({
            data: {
                examId,
                text: data.text,
                type: data.type,
            },
        });

        // If multiple choice, create options
        if (data.type === "MULTIPLE_CHOICE" && data.options && data.options.length > 0) {
            await prisma.option.createMany({
                data: data.options.map((text, index) => ({
                    questionId: question.id,
                    text,
                    isCorrect: index === data.correctAnswer,
                })),
            });
        }

        revalidatePath(`/teacher/exams/${examId}/edit`);
        return { success: true, data: question };
    } catch (error) {
        console.error("Error creating question from bank:", error);
        return { error: "Gagal mengimpor pertanyaan dari bank soal" };
    }
}

