"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface ImportedUser {
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    password?: string;
    classId?: string;
}

interface ImportResult {
    success: boolean;
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: { row: number; email: string; error: string }[];
}

export async function importUsers(users: ImportedUser[]): Promise<ImportResult> {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return {
            success: false,
            totalRows: 0,
            successCount: 0,
            errorCount: 0,
            errors: [{ row: 0, email: "", error: "Unauthorized" }]
        };
    }

    const result: ImportResult = {
        success: true,
        totalRows: users.length,
        successCount: 0,
        errorCount: 0,
        errors: []
    };

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const rowNumber = i + 2; // +2 for header row and 0-index

        try {
            // Validate required fields
            if (!user.name || !user.email) {
                result.errors.push({
                    row: rowNumber,
                    email: user.email || "(kosong)",
                    error: "Nama atau email kosong"
                });
                result.errorCount++;
                continue;
            }

            // Check for existing user
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email }
            });

            if (existingUser) {
                result.errors.push({
                    row: rowNumber,
                    email: user.email,
                    error: "Email sudah terdaftar"
                });
                result.errorCount++;
                continue;
            }

            // Validate role
            const validRoles = ["STUDENT", "TEACHER", "ADMIN"];
            const role = user.role?.toUpperCase() || "STUDENT";
            if (!validRoles.includes(role)) {
                result.errors.push({
                    row: rowNumber,
                    email: user.email,
                    error: `Role tidak valid: ${user.role}`
                });
                result.errorCount++;
                continue;
            }

            // Hash password
            const password = user.password || "password123";
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    role: role as "STUDENT" | "TEACHER" | "ADMIN",
                    password: hashedPassword,
                    classId: role === "STUDENT" ? user.classId : null
                } as any
            });

            result.successCount++;
        } catch (error: any) {
            result.errors.push({
                row: rowNumber,
                email: user.email || "(unknown)",
                error: error.message || "Gagal menyimpan user"
            });
            result.errorCount++;
        }
    }

    result.success = result.errorCount === 0;
    revalidatePath("/admin/users");

    return result;
}

// Export template structure for download
export async function getImportTemplate() {
    return {
        headers: ["name", "email", "role", "password", "classId"],
        example: [
            {
                name: "Budi Santoso",
                email: "budi@example.com",
                role: "STUDENT",
                password: "password123",
                classId: ""
            },
            {
                name: "Ani Wijaya",
                email: "ani@example.com",
                role: "TEACHER",
                password: "teacher123",
                classId: ""
            }
        ]
    };
}
