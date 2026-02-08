"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { updateUser } from "@/actions/admin-actions";
import { getClasses, getSubjects } from "@/actions/class-subject-actions";
import { Loader2, GraduationCap, BookOpen, Users, UserCog, ShieldCheck, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
    id: string;
    name: string;
    grade: number;
}

interface SubjectData {
    id: string;
    name: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
}

export function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "STUDENT" as "STUDENT" | "TEACHER" | "ADMIN",
        classId: "",
        subjectIds: [] as string[],
        teacherClassIds: [] as string[],
    });

    // Fetch classes & subjects
    useEffect(() => {
        async function fetchData() {
            const [classData, subjectData] = await Promise.all([
                getClasses(),
                getSubjects()
            ]);
            setClasses(classData as ClassData[]);
            setSubjects(subjectData as SubjectData[]);
        }
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    // Update form when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role as "STUDENT" | "TEACHER" | "ADMIN",
                classId: (user as any).classId || "",
                subjectIds: (user as any).teacherSubjects?.map((ts: any) => ts.subjectId) || [],
                teacherClassIds: (user as any).teacherClasses?.map((tc: any) => tc.classId) || [],
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            const res = await updateUser(user.id, {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                classId: formData.role === "STUDENT" ? formData.classId : undefined,
                subjectIds: formData.role === "TEACHER" ? formData.subjectIds : undefined,
                teacherClassIds: formData.role === "TEACHER" ? formData.teacherClassIds : undefined,
            });

            if (res.success) {
                onSuccess();
            } else {
                toast({
                    title: "Gagal Update User",
                    description: res.error || "Terjadi kesalahan.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Terjadi kesalahan jaringan.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSubject = (id: string) => {
        setFormData(prev => ({
            ...prev,
            subjectIds: prev.subjectIds.includes(id)
                ? prev.subjectIds.filter(s => s !== id)
                : [...prev.subjectIds, id]
        }));
    };

    const toggleClass = (id: string) => {
        setFormData(prev => ({
            ...prev,
            teacherClassIds: prev.teacherClassIds.includes(id)
                ? prev.teacherClassIds.filter(c => c !== id)
                : [...prev.teacherClassIds, id]
        }));
    };

    const roleColors = {
        STUDENT: "from-blue-500 to-blue-600",
        TEACHER: "from-purple-500 to-purple-600",
        ADMIN: "from-red-500 to-red-600"
    };

    const roleIcons = {
        STUDENT: Users,
        TEACHER: GraduationCap,
        ADMIN: ShieldCheck
    };

    if (!user) return null;

    const RoleIcon = roleIcons[formData.role];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg p-0 overflow-hidden">
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${roleColors[formData.role]} p-6 text-white transition-all duration-300`}>
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <UserCog className="w-6 h-6" />
                            Edit User
                        </DialogTitle>
                        <p className="text-white/80 text-sm mt-1">
                            Perbarui informasi {formData.role === "STUDENT" ? "siswa" : formData.role === "TEACHER" ? "guru" : "admin"}
                        </p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["STUDENT", "TEACHER", "ADMIN"] as const).map((role) => {
                                const Icon = roleIcons[role];
                                return (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role, classId: "", subjectIds: [], teacherClassIds: [] })}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition-all ${formData.role === role
                                                ? `border-transparent bg-gradient-to-r ${roleColors[role]} text-white`
                                                : "border-border hover:border-primary/50"
                                            }`}
                                        disabled={isLoading}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">
                                            {role === "STUDENT" ? "Siswa" : role === "TEACHER" ? "Guru" : "Admin"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Student: Class Selection */}
                    {formData.role === "STUDENT" && (
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                <Users className="w-4 h-4 inline mr-1" />
                                Kelas
                            </label>
                            {classes.length === 0 ? (
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                    Belum ada kelas. Tambahkan di menu Kelas.
                                </p>
                            ) : (
                                <select
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                    disabled={isLoading}
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Teacher: Subject & Class Selection */}
                    {formData.role === "TEACHER" && (
                        <>
                            {/* Subjects */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <BookOpen className="w-4 h-4 inline mr-1" />
                                    Mata Pelajaran ({formData.subjectIds.length} dipilih)
                                </label>
                                {subjects.length === 0 ? (
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        Belum ada mata pelajaran. Tambahkan di menu Mata Pelajaran.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map((subject) => (
                                            <button
                                                key={subject.id}
                                                type="button"
                                                onClick={() => toggleSubject(subject.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${formData.subjectIds.includes(subject.id)
                                                        ? "bg-purple-500 text-white"
                                                        : "bg-muted hover:bg-muted/80"
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                {formData.subjectIds.includes(subject.id) && <Check className="w-3 h-3" />}
                                                {subject.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Classes for Teacher */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <GraduationCap className="w-4 h-4 inline mr-1" />
                                    Kelas yang Diampu ({formData.teacherClassIds.length} dipilih)
                                </label>
                                {classes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        Belum ada kelas. Tambahkan di menu Kelas.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {classes.map((cls) => (
                                            <button
                                                key={cls.id}
                                                type="button"
                                                onClick={() => toggleClass(cls.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${formData.teacherClassIds.includes(cls.id)
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-muted hover:bg-muted/80"
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                {formData.teacherClassIds.includes(cls.id) && <Check className="w-3 h-3" />}
                                                {cls.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-gradient-to-r ${roleColors[formData.role]} hover:opacity-90`}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
