"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createUser } from "@/actions/admin-actions";
import { getClasses, getSubjects } from "@/actions/class-subject-actions";
import { Loader2, User, GraduationCap, BookOpen, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
    id: string;
    name: string;
    grade: number;
}

interface SubjectData {
    id: string;
    name: string;
    code: string | null;
}

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "STUDENT" as "STUDENT" | "TEACHER" | "ADMIN",
        classId: "",
        subjectIds: [] as string[],
        teacherClassIds: [] as string[],
        autoGeneratePassword: true,
        password: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        const [classData, subjectData] = await Promise.all([
            getClasses(),
            getSubjects()
        ]);
        setClasses(classData as ClassData[]);
        setSubjects(subjectData as SubjectData[]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await createUser({
                name: formData.name,
                email: formData.email,
                role: formData.role,
                password: formData.autoGeneratePassword ? undefined : formData.password,
                classId: formData.role === "STUDENT" ? formData.classId : undefined,
                subjectIds: formData.role === "TEACHER" ? formData.subjectIds : undefined,
                teacherClassIds: formData.role === "TEACHER" ? formData.teacherClassIds : undefined,
            });

            if (res.success) {
                toast({ title: "User berhasil ditambahkan!", variant: "default" });
                onSuccess();
                resetForm();
            } else {
                toast({
                    title: "Gagal Menambahkan User",
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

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "STUDENT",
            classId: "",
            subjectIds: [],
            teacherClassIds: [],
            autoGeneratePassword: true,
            password: "",
        });
    };

    const toggleSubject = (id: string) => {
        setFormData(prev => ({
            ...prev,
            subjectIds: prev.subjectIds.includes(id)
                ? prev.subjectIds.filter(s => s !== id)
                : [...prev.subjectIds, id]
        }));
    };

    const toggleTeacherClass = (id: string) => {
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${roleColors[formData.role]} p-6 text-white rounded-t-lg`}>
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <User className="w-6 h-6" />
                            Tambah User Baru
                        </DialogTitle>
                        <p className="text-white/80 text-sm mt-1">
                            {formData.role === "STUDENT" && "Menambahkan siswa baru ke sistem"}
                            {formData.role === "TEACHER" && "Menambahkan guru baru ke sistem"}
                            {formData.role === "ADMIN" && "Menambahkan admin baru ke sistem"}
                        </p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Role Selection - Pills */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Pilih Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: "STUDENT", label: "Siswa", icon: User },
                                { value: "TEACHER", label: "Guru", icon: GraduationCap },
                                { value: "ADMIN", label: "Admin", icon: Lock },
                            ].map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: value as any })}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${formData.role === value
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:border-primary/50 text-muted-foreground"
                                        }`}
                                    disabled={isLoading}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name & Email - 2 columns on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
                                placeholder="Masukkan nama"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
                                placeholder="email@example.com"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Student: Class Selection */}
                    {formData.role === "STUDENT" && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                            <label className="flex items-center gap-2 text-sm font-medium mb-3 text-blue-700 dark:text-blue-300">
                                <GraduationCap className="w-4 h-4" />
                                Kelas Siswa
                            </label>
                            {classes.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Belum ada kelas. Tambahkan di menu Kelas terlebih dahulu.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {classes.map(cls => (
                                        <button
                                            key={cls.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, classId: cls.id })}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${formData.classId === cls.id
                                                    ? "border-blue-500 bg-blue-500 text-white"
                                                    : "border-border bg-background hover:border-blue-400"
                                                }`}
                                            disabled={isLoading}
                                        >
                                            {cls.name}
                                            {formData.classId === cls.id && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Teacher: Subject & Class Selection */}
                    {formData.role === "TEACHER" && (
                        <div className="space-y-4">
                            {/* Subjects */}
                            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-900">
                                <label className="flex items-center gap-2 text-sm font-medium mb-3 text-purple-700 dark:text-purple-300">
                                    <BookOpen className="w-4 h-4" />
                                    Mata Pelajaran yang Diajar
                                    {formData.subjectIds.length > 0 && (
                                        <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {formData.subjectIds.length} dipilih
                                        </span>
                                    )}
                                </label>
                                {subjects.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">
                                        Belum ada mata pelajaran. Tambahkan di menu Mata Pelajaran.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map(subj => (
                                            <button
                                                key={subj.id}
                                                type="button"
                                                onClick={() => toggleSubject(subj.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm ${formData.subjectIds.includes(subj.id)
                                                        ? "border-purple-500 bg-purple-500 text-white"
                                                        : "border-border bg-background hover:border-purple-400"
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                {formData.subjectIds.includes(subj.id) && <Check className="w-3 h-3" />}
                                                {subj.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Classes */}
                            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-900">
                                <label className="flex items-center gap-2 text-sm font-medium mb-3 text-indigo-700 dark:text-indigo-300">
                                    <GraduationCap className="w-4 h-4" />
                                    Kelas yang Diajar
                                    {formData.teacherClassIds.length > 0 && (
                                        <span className="ml-auto bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {formData.teacherClassIds.length} dipilih
                                        </span>
                                    )}
                                </label>
                                {classes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">
                                        Belum ada kelas. Tambahkan di menu Kelas.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {classes.map(cls => (
                                            <button
                                                key={cls.id}
                                                type="button"
                                                onClick={() => toggleTeacherClass(cls.id)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${formData.teacherClassIds.includes(cls.id)
                                                        ? "border-indigo-500 bg-indigo-500 text-white"
                                                        : "border-border bg-background hover:border-indigo-400"
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                {cls.name}
                                                {formData.teacherClassIds.includes(cls.id) && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <div className="flex items-center gap-3 mb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.autoGeneratePassword}
                                    onChange={(e) => setFormData({ ...formData, autoGeneratePassword: e.target.checked })}
                                    className="rounded border-border"
                                    disabled={isLoading}
                                />
                                <span className="text-sm">Gunakan password default</span>
                            </label>
                        </div>
                        {formData.autoGeneratePassword ? (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Password:</span>
                                <code className="bg-background px-2 py-1 rounded font-mono">password123</code>
                            </div>
                        ) : (
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Masukkan password"
                                disabled={isLoading}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-gradient-to-r ${roleColors[formData.role]} hover:opacity-90`}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tambah {formData.role === "STUDENT" ? "Siswa" : formData.role === "TEACHER" ? "Guru" : "Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
