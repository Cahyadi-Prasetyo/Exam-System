"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Get current user profile
export async function getProfile() {
    const session = await auth();

    if (!session) {
        return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return { error: "User not found" };
    }

    return { user };
}

// Update user profile (name, email)
export async function updateProfile(data: { name: string; email: string }) {
    const session = await auth();

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Check if email is already taken by another user
        if (data.email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== session.user.id) {
                return { success: false, error: "Email sudah digunakan oleh user lain." };
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                email: data.email,
            },
        });

        revalidatePath("/teacher/profile");
        revalidatePath("/student/profile");

        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: "Gagal mengupdate profil." };
    }
}

// Change password
export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    const session = await auth();

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
        return { success: false, error: "Password baru tidak cocok." };
    }

    // Validate password length
    if (data.newPassword.length < 6) {
        return { success: false, error: "Password baru minimal 6 karakter." };
    }

    try {
        // Get current user with password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });

        if (!user) {
            return { success: false, error: "User not found." };
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            data.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            return { success: false, error: "Password saat ini salah." };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        return { success: true };
    } catch (error) {
        console.error("Change password error:", error);
        return { success: false, error: "Gagal mengubah password." };
    }
}
