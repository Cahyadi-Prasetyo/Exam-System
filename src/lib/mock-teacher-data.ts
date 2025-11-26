// Mock exam results data for teacher dashboard
export interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    nisn: string;
    examId: string;
    examTitle: string;
    score: number; // This will be the final effective score
    originalScore: number; // The auto-graded score
    manualAdjustment: number;
    bonusPoints: number;
    maxScore: number;
    percentage: number;
    duration: number; // in seconds
    violations: number;
    status: "completed" | "in-progress" | "abandoned";
    submittedAt: Date;
    answers: Record<number, string>;
    isPublished: boolean;
    adjustmentReason?: string;
    adjustedBy?: string;
    adjustedAt?: Date;
}

export interface Violation {
    id: string;
    studentId: string;
    studentName: string;
    examId: string;
    examTitle: string;
    type: "tab_switch" | "right_click" | "copy_paste";
    timestamp: Date;
    status: "pending" | "verified" | "dismissed";
    evidence?: {
        duration?: number; // seconds
        content?: string; // for copy/paste
        screen_captured?: string; // url
    };
    teacherNotes?: string;
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
        originalScore: 85,
        manualAdjustment: 0,
        bonusPoints: 0,
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
        score: 95, // Adjusted from 92
        originalScore: 92,
        manualAdjustment: 0,
        bonusPoints: 3,
        maxScore: 100,
        percentage: 95,
        duration: 3900,
        violations: 0,
        status: "completed",
        submittedAt: new Date("2024-11-20T10:25:00"),
        answers: { 0: "A", 1: "B", 2: "C" },
        isPublished: true,
        adjustmentReason: "Bonus keaktifan di kelas",
        adjustedBy: "Pak Guru",
        adjustedAt: new Date("2024-11-21T08:00:00"),
    },
    {
        id: "res-003",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        nisn: "456789123",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        score: 78,
        originalScore: 78,
        manualAdjustment: 0,
        bonusPoints: 0,
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
        originalScore: 65,
        manualAdjustment: 0,
        bonusPoints: 0,
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
        score: 32, // Adjusted from 42 (-10 penalty)
        originalScore: 42,
        manualAdjustment: -10,
        bonusPoints: 0,
        maxScore: 100,
        percentage: 32,
        duration: 3000,
        violations: 5,
        status: "completed",
        submittedAt: new Date("2024-11-21T14:20:00"),
        answers: { 0: "A", 1: "A", 2: "A" },
        isPublished: false,
        adjustmentReason: "Pengurangan nilai karena pelanggaran berat",
        adjustedBy: "Pak Guru",
        adjustedAt: new Date("2024-11-21T15:00:00"),
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
        status: "pending",
        evidence: { duration: 15 },
    },
    {
        id: "vio-002",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        type: "tab_switch",
        timestamp: new Date("2024-11-20T10:20:00"),
        status: "verified",
        evidence: { duration: 45 },
        teacherNotes: "Siswa mengakui membuka google",
    },
    {
        id: "vio-003",
        studentId: "std-003",
        studentName: "Cahya Prasetyo",
        examId: "MTK-2024-A1",
        examTitle: "Matematika Wajib - Semester 1",
        type: "copy_paste",
        timestamp: new Date("2024-11-20T10:28:00"),
        status: "pending",
        evidence: { content: "Rumus Pythagoras adalah a^2 + b^2 = c^2" },
    },
    {
        id: "vio-004",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:05:00"),
        status: "dismissed",
        evidence: { duration: 2 },
        teacherNotes: "Terpencet tidak sengaja",
    },
    {
        id: "vio-005",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "right_click",
        timestamp: new Date("2024-11-21T14:10:00"),
        status: "pending",
    },
    {
        id: "vio-006",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:12:00"),
        status: "pending",
        evidence: { duration: 120 },
    },
    {
        id: "vio-007",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:15:00"),
        status: "pending",
        evidence: { duration: 30 },
    },
    {
        id: "vio-008",
        studentId: "std-005",
        studentName: "Eko Prasetyo",
        examId: "FIS-2024-B1",
        examTitle: "Fisika - Quiz Hukum Newton",
        type: "tab_switch",
        timestamp: new Date("2024-11-21T14:18:00"),
        status: "pending",
        evidence: { duration: 10 },
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
