// Mock data for Admin Panel
export interface User {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    status: "active" | "inactive";
    createdAt: string;
}

export const mockUsers: User[] = [
    // Teachers
    {
        id: "1",
        name: "Dr. Ahmad Santoso",
        email: "ahmad.santoso@school.com",
        role: "TEACHER",
        status: "active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        name: "Siti Nurhaliza",
        email: "siti.nur@school.com",
        role: "TEACHER",
        status: "active",
        createdAt: "2024-01-20",
    },
    {
        id: "3",
        name: "Bambang Wijaya",
        email: "bambang.w@school.com",
        role: "TEACHER",
        status: "inactive",
        createdAt: "2024-02-01",
    },
    // Students
    {
        id: "4",
        name: "Aldi Pratama",
        email: "aldi.pratama@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-01",
    },
    {
        id: "5",
        name: "Bunga Citra",
        email: "bunga.citra@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-05",
    },
    {
        id: "6",
        name: "Dimas Aditya",
        email: "dimas.aditya@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-10",
    },
    {
        id: "7",
        name: "Elsa Permata",
        email: "elsa.permata@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-12",
    },
    {
        id: "8",
        name: "Fajar Ramadhan",
        email: "fajar.r@student.com",
        role: "STUDENT",
        status: "inactive",
        createdAt: "2024-03-15",
    },
    {
        id: "9",
        name: "Gita Safitri",
        email: "gita.safitri@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-18",
    },
    {
        id: "10",
        name: "Hendra Gunawan",
        email: "hendra.g@student.com",
        role: "STUDENT",
        status: "active",
        createdAt: "2024-03-20",
    },
];

export interface AdminStats {
    totalStudents: number;
    totalTeachers: number;
    activeExams: number;
    totalViolations: number;
    activeUsers: number;
    inactiveUsers: number;
}

export const mockAdminStats: AdminStats = {
    totalStudents: 7,
    totalTeachers: 3,
    activeExams: 5,
    totalViolations: 12,
    activeUsers: 8,
    inactiveUsers: 2,
};
