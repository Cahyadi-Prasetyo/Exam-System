import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@exam.com" },
        update: {},
        create: {
            email: "admin@exam.com",
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    // Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: "teacher@exam.com" },
        update: {},
        create: {
            email: "teacher@exam.com",
            name: "Teacher User",
            password: hashedPassword,
            role: "TEACHER",
        },
    });

    // Create Student
    const student = await prisma.user.upsert({
        where: { email: "student@exam.com" },
        update: {},
        create: {
            email: "student@exam.com",
            name: "Student User",
            password: hashedPassword,
            role: "STUDENT",
        },
    });

    console.log({ admin, teacher, student });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
