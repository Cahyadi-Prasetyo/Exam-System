"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getTeacherDashboardStats() {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    try {
        // 1. Total Exams created by this teacher (assuming we filter by creator later, but for now all exams)
        // Note: Schema doesn't have creatorId on Exam yet, so we'll fetch all exams for now or assume single teacher context for MVP.
        // Ideally, Exam should have a creatorId. For now, we'll count ALL exams.
        const totalExams = await prisma.exam.count();

        // 2. Total Students (Unique users who have attempted any exam)
        const totalStudents = await prisma.examAttempt.groupBy({
            by: ['userId'],
            _count: {
                userId: true
            }
        }).then(res => res.length);

        // 3. Average Score (of all submitted attempts)
        const attemptsWithScore = await prisma.examAttempt.findMany({
            where: {
                status: { in: ["SUBMITTED", "COMPLETED"] },
                score: { not: null }
            },
            select: { score: true, exam: { select: { questions: true } } } // Need max score logic?
        });

        // Calculate percentage for each attempt to get average percentage
        // Simplified: Assuming score is already percentage or we just average the raw score?
        // Let's assume score is raw. We need max score.
        // For now, let's just average the 'score' field.
        const totalScore = attemptsWithScore.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const averageScore = attemptsWithScore.length > 0 ? totalScore / attemptsWithScore.length : 0;

        // 4. Total Violations
        const totalViolations = await prisma.violation.count();

        return {
            totalExams,
            totalStudents,
            averageScore,
            totalViolations
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { error: "Failed to fetch stats" };
    }
}

export async function getAllExamResults() {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    try {
        const results = await prisma.examAttempt.findMany({
            where: {
                status: { in: ["SUBMITTED", "COMPLETED"] }
            },
            include: {
                user: true,
                exam: {
                    include: {
                        questions: true
                    }
                },
                violations: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Transform to match ExamResult interface
        return results.map(attempt => {
            const maxScore = attempt.exam.questions.length * 10; // Assuming 10 points per question for now
            // Or if we have points in Question model, sum them up.
            // Let's use a standard 100 for max score if we don't have specific points.
            // Actually, let's calculate max score based on question count * 10 (simple logic)

            const finalScore = attempt.score || 0;
            const percentage = maxScore > 0 ? (finalScore / maxScore) * 100 : 0;

            return {
                id: attempt.id,
                studentId: attempt.user.id,
                studentName: attempt.user.name,
                nisn: attempt.user.email, // Using email as NISN/ID for now
                examId: attempt.exam.id,
                examTitle: attempt.exam.title,
                score: finalScore,
                maxScore: maxScore,
                percentage: percentage,
                originalScore: attempt.originalScore || finalScore,
                manualAdjustment: attempt.manualAdjustment,
                bonusPoints: attempt.bonusPoints,
                duration: attempt.endTime && attempt.startTime
                    ? (new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000
                    : 0,
                violations: attempt.violations.length,
                status: attempt.status === "SUBMITTED" || attempt.status === "COMPLETED" ? "completed" : "in-progress",
                submittedAt: attempt.endTime || attempt.updatedAt,
                isPublished: attempt.isPublished,
                answers: {} as any // Placeholder to satisfy interface, not used in table
            };
        });
    } catch (error) {
        console.error("Failed to fetch exam results:", error);
        return { error: "Failed to fetch results" };
    }
}
