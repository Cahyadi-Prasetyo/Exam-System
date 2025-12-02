"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const examSchema = z.object({
    title: z.string().min(3, "Judul ujian minimal 3 karakter"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Durasi minimal 1 menit"),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Format tanggal mulai tidak valid"),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Format tanggal selesai tidak valid"),
});

export async function createExam(prevState: any, formData: FormData) {
    const session = await auth();

    if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
        return { error: "Unauthorized" };
    }

    const validatedFields = examSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        duration: formData.get("duration"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
    });

    if (!validatedFields.success) {
        return {
            error: "Validasi gagal. Periksa kembali input Anda.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, description, duration, startTime, endTime } = validatedFields.data;

    try {
        const newExam = await prisma.exam.create({
            data: {
                title,
                description,
                duration,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });

        revalidatePath("/teacher/dashboard");
        redirect(`/teacher/exams/${newExam.id}/edit`);
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Failed to create exam:", error);
        return { error: "Gagal membuat ujian. Silakan coba lagi." };
    }
}
