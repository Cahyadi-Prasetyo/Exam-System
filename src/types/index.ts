export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    status: string;
    createdAt: Date;
}
