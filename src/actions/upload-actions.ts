"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

export async function uploadImage(formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore error if directory exists
    }

    // Write file
    const filepath = join(uploadDir, filename);
    try {
        await writeFile(filepath, buffer);
        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to save file" };
    }
}
