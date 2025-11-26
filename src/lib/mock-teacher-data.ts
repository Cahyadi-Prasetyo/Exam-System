// Mock exam results data for teacher dashboard
export interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    nisn: string;
    examId: string;
    examTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    duration: number; // in seconds
    violations: number;
    status: "completed" | "in-progress" | "abandoned";
    submittedAt: Date;
    answers: Record<number, string>;
    isPublished: boolean;
}

export interface Violation {
    id: string;
    studentId: string;
    studentName: string;
    examId: string;
    examTitle: string;
    type: "tab_switch" | "right_click" | "copy_paste";
    timestamp: Date;
    metadata?: any;
}

// Mock data: Exam Results
export const mockExamResults: ExamResult[] = [
    {
        id: "res-001",
        studentId: "std-001",
        studentName: "Budi Santoso",
        nisn: "123456789",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        score: 85,
        maxScore: 100,
        percentage: 85,
        duration: 4200, // 70 minutes
        violations: 1,
        status: "completed",
        submittedAt: new Date("2024-11-20T10:30:00"),
        answers: { 0: "A", 1: "B", 2: "C" },
        isPublished: true,
    },
    {
        id: "res-002",
        studentId: "std-002",
        studentName: "Ani Wijaya",
        nisn: "987654321",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        score: 92,
        maxScore: 100,
        percentage: 92,
        duration: 3900,
        violations: 0,
        status: "completed",
        submittedAt: new Date("2024-11-20T10:25:00"),
        answers: { 0: "A", 1: "B", 2: "C" },
        isPublished: true,
    },
    {
        id: "res-003",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        nisn: "456789123",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        score: 78,
        maxScore: 100,
        percentage: 78,
        duration: 4500,
        violations: 3,
        status: "completed",
        submittedAt: new Date("2024-11-20T10:35:00"),
        answers: { 0: "B", 1: "C", 2: "D" },
        isPublished: true,
    },
    {
        id: "res-004",
        studentId: "std-004",
        studentName: "Dewi Lestari",
        nisn: "321654987",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        score: 65,
        maxScore: 100,
        percentage: 65,
        duration: 2700,
        violations: 0,
        status: "completed",
        submittedAt: new Date("2024-11-21T14:15:00"),
        answers: { 0: "C", 1: "D", 2: "A" },
        isPublished: false,
    },
    {
        id: "res-005",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        nisn: "789123456",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        score: 42,
        maxScore: 100,
        percentage: 42,
        duration: 3000,
        violations: 5,
        status: "completed",
        submittedAt: new Date("2024-11-21T14:20:00"),
        answers: { 0: "A", 1: "A", 2: "A" },
        isPublished: false,
    },
];

// Mock data: Violations
export const mockViolations: Violation[] = [
    {
        id: "vio-001",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        type: "tab_switch",
        timestamp: new Date("2024-11-20T10:15:00"),
    },
    {
        id: "vio-002",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        type: "tab_switch",
        timestamp: new Date("2024-11-20T10:20:00"),
    },
    {
        id: "vio-003",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        type: "tab_switch",
        timestamp: new Date("2024-11-20T10:28:00"),
    },
    {
        id: "vio-004",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:05:00"),
    },
    {
        id: "vio-005",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:10:00"),
    },
    {
        id: "vio-006",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:12:00"),
    },
    {
        id: "vio-007",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:15:00"),
    },
    {
        id: "vio-008",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:18:00"),
    },
];

// Helper function to get score color
export function getScoreColor(percentage: number): string {
    if (percentage >= 90) return "text-emerald-700 dark:text-emerald-400";
    if (percentage >= 75) return "text-blue-700 dark:text-blue-400";
    if (percentage >= 60) return "text-amber-700 dark:text-amber-400";
    if (percentage >= 45) return "text-orange-700 dark:text-orange-400";
    return "text-rose-700 dark:text-rose-400 font-bold"; // Critical/Failing
}

// Helper function to get score background color
export function getScoreBgColor(percentage: number): string {
    return "";
}
