"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all active exams (currently in progress - between startTime and endTime)
export async function getActiveExams() {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    const now = new Date();

    const exams = await prisma.exam.findMany({
        where: {
            status: "PUBLISHED",
            startTime: { lte: now },
            endTime: { gte: now },
        },
        select: {
            id: true,
            title: true,
            duration: true,
            startTime: true,
            endTime: true,
            _count: {
                select: {
                    examAttempts: true,
                    questions: true,
                },
            },
        },
        orderBy: { startTime: "desc" },
    });

    return exams;
}

// Get all exams with attempts for monitoring (including past exams)
export async function getAllExamsForMonitoring() {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    const exams = await prisma.exam.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            id: true,
            title: true,
            duration: true,
            startTime: true,
            endTime: true,
            _count: {
                select: {
                    examAttempts: true,
                    questions: true,
                },
            },
        },
        orderBy: { startTime: "desc" },
        take: 20, // Last 20 exams
    });

    return exams;
}

// Get participants of a specific exam with real-time status
export async function getExamParticipants(examId: string) {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        select: {
            id: true,
            title: true,
            duration: true,
            _count: { select: { questions: true } },
        },
    });

    if (!exam) {
        return { error: "Exam not found" };
    }

    const attempts = await prisma.examAttempt.findMany({
        where: { examId },
        select: {
            id: true,
            userId: true,
            startTime: true,
            endTime: true,
            status: true,
            score: true,
            lastActivityAt: true,
            answeredCount: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: { violations: true },
            },
        },
        orderBy: { startTime: "desc" },
    });

    const now = new Date();
    const IDLE_THRESHOLD = 60 * 1000; // 1 minute
    const OFFLINE_THRESHOLD = 3 * 60 * 1000; // 3 minutes

    const participants = attempts.map((attempt) => {
        const lastActivity = new Date(attempt.lastActivityAt);
        const timeSinceActivity = now.getTime() - lastActivity.getTime();

        let connectionStatus: "online" | "idle" | "offline";

        if (attempt.status === "SUBMITTED" || attempt.status === "COMPLETED") {
            connectionStatus = "offline"; // Completed exams show as offline
        } else if (timeSinceActivity < IDLE_THRESHOLD) {
            connectionStatus = "online";
        } else if (timeSinceActivity < OFFLINE_THRESHOLD) {
            connectionStatus = "idle";
        } else {
            connectionStatus = "offline";
        }

        return {
            attemptId: attempt.id,
            odId: attempt.user.id,
            studentName: attempt.user.name,
            studentEmail: attempt.user.email,
            startTime: attempt.startTime,
            endTime: attempt.endTime,
            status: attempt.status,
            score: attempt.score,
            answeredCount: attempt.answeredCount,
            totalQuestions: exam._count.questions,
            lastActivityAt: attempt.lastActivityAt,
            connectionStatus,
            violationCount: attempt._count.violations,
        };
    });

    return {
        exam: {
            id: exam.id,
            title: exam.title,
            duration: exam.duration,
            totalQuestions: exam._count.questions,
        },
        participants,
    };
}

// Force submit a student's exam
export async function forceSubmitExam(attemptId: string) {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const attempt = await prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: { select: { id: true } },
                answers: { select: { isCorrect: true } },
            },
        });

        if (!attempt) {
            return { success: false, error: "Attempt not found" };
        }

        if (attempt.status === "SUBMITTED" || attempt.status === "COMPLETED") {
            return { success: false, error: "Exam already submitted" };
        }

        // Calculate score
        const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;
        const totalQuestions = attempt.answers.length;
        const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Update attempt
        await prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                status: "SUBMITTED",
                endTime: new Date(),
                score,
                originalScore: score,
            },
        });

        // Log this as a violation (forced submit)
        await prisma.violation.create({
            data: {
                examAttemptId: attemptId,
                type: "FORCE_SUBMIT",
                details: `Exam was force-submitted by teacher: ${session.user.name}`,
                status: "REVIEWED",
                adminNotes: "Auto-marked as reviewed",
            },
        });

        revalidatePath("/teacher/monitoring");
        return { success: true };
    } catch (error) {
        console.error("Force submit error:", error);
        return { success: false, error: "Failed to force submit exam" };
    }
}

// Update student activity (called when student answers or navigates)
export async function updateStudentActivity(attemptId: string, answeredCount?: number) {
    try {
        const updateData: { lastActivityAt: Date; answeredCount?: number } = {
            lastActivityAt: new Date(),
        };

        if (answeredCount !== undefined) {
            updateData.answeredCount = answeredCount;
        }

        await prisma.examAttempt.update({
            where: { id: attemptId },
            data: updateData,
        });

        return { success: true };
    } catch (error) {
        console.error("Update activity error:", error);
        return { success: false };
    }
}
