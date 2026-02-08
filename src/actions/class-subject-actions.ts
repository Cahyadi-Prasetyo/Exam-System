"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============ CLASS ACTIONS ============

export async function getClasses() {
    try {
        const classes = await (prisma as any).class.findMany({
            orderBy: { grade: "asc" },
            include: {
                _count: {
                    select: { students: true, teachers: true }
                }
            }
        });
        return classes;
    } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
    }
}

export async function createClass(data: { name: string; grade: number }) {
    try {
        const newClass = await (prisma as any).class.create({
            data: {
                name: data.name,
                grade: data.grade,
            },
        });
        revalidatePath("/admin/classes");
        return { success: true, data: newClass };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Nama kelas sudah ada" };
        }
        console.error("Error creating class:", error);
        return { success: false, error: "Gagal membuat kelas" };
    }
}

export async function updateClass(id: string, data: { name: string; grade: number }) {
    try {
        const updated = await (prisma as any).class.update({
            where: { id },
            data: {
                name: data.name,
                grade: data.grade,
            },
        });
        revalidatePath("/admin/classes");
        return { success: true, data: updated };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Nama kelas sudah ada" };
        }
        console.error("Error updating class:", error);
        return { success: false, error: "Gagal mengupdate kelas" };
    }
}

export async function deleteClass(id: string) {
    try {
        await (prisma as any).class.delete({ where: { id } });
        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error) {
        console.error("Error deleting class:", error);
        return { success: false, error: "Gagal menghapus kelas" };
    }
}

// ============ SUBJECT ACTIONS ============

export async function getSubjects() {
    try {
        const subjects = await (prisma as any).subject.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { teachers: true }
                }
            }
        });
        return subjects;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
}

export async function createSubject(data: { name: string; code?: string }) {
    try {
        const newSubject = await (prisma as any).subject.create({
            data: {
                name: data.name,
                code: data.code || null,
            },
        });
        revalidatePath("/admin/subjects");
        return { success: true, data: newSubject };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Nama mata pelajaran sudah ada" };
        }
        console.error("Error creating subject:", error);
        return { success: false, error: "Gagal membuat mata pelajaran" };
    }
}

export async function updateSubject(id: string, data: { name: string; code?: string }) {
    try {
        const updated = await (prisma as any).subject.update({
            where: { id },
            data: {
                name: data.name,
                code: data.code || null,
            },
        });
        revalidatePath("/admin/subjects");
        return { success: true, data: updated };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Nama mata pelajaran sudah ada" };
        }
        console.error("Error updating subject:", error);
        return { success: false, error: "Gagal mengupdate mata pelajaran" };
    }
}

export async function deleteSubject(id: string) {
    try {
        await (prisma as any).subject.delete({ where: { id } });
        revalidatePath("/admin/subjects");
        return { success: true };
    } catch (error) {
        console.error("Error deleting subject:", error);
        return { success: false, error: "Gagal menghapus mata pelajaran" };
    }
}
