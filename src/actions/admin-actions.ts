"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Exclude password
            }
        });

        // Map to match the UI expected format if needed, or just return as is
        // The UI expects: id, name, email, role, status (we don't have status in DB yet, assume active), createdAt
        return users.map(user => ({
            ...user,
            status: "active" // Default to active for now
        }));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { error: "Failed to fetch users" };
    }
}

export async function createUser(data: { name: string; email: string; role: "STUDENT" | "TEACHER" | "ADMIN"; password?: string }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return { error: "Email already registered" };
        }

        const hashedPassword = await bcrypt.hash(data.password || "password123", 10);

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                password: hashedPassword
            }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { error: "Failed to create user" };
    }
}

export async function updateUser(id: string, data: { name: string; email: string; role: "STUDENT" | "TEACHER" | "ADMIN" }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                role: data.role
            }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { error: "Failed to update user" };
    }
}

export async function deleteUser(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.user.delete({
            where: { id }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { error: "Failed to delete user" };
    }
}

export async function resetPassword(id: string, newPassword?: string) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const passwordToSet = newPassword || "password123"; // Default reset password
        const hashedPassword = await bcrypt.hash(passwordToSet, 10);

        await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword
            }
        });

        return { success: true, newPassword: passwordToSet };
    } catch (error) {
        console.error("Failed to reset password:", error);
        return { error: "Failed to reset password" };
    }
}
