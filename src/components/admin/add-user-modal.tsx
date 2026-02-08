"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createUser } from "@/actions/admin-actions";
import { getClasses, getSubjects } from "@/actions/class-subject-actions";
import { Loader2 } from "lucide-react";
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="John Doe"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="user@example.com"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "STUDENT" | "TEACHER" | "ADMIN" })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            disabled={isLoading}
                        >
                            <option value="STUDENT">Siswa</option>
                            <option value="TEACHER">Guru</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {/* Student: Class Selection */}
                    {formData.role === "STUDENT" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Kelas</label>
                            <select
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                disabled={isLoading}
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Teacher: Subject Selection */}
                    {formData.role === "TEACHER" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Mata Pelajaran yang Diajar</label>
                                <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                                    {subjects.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Belum ada mata pelajaran</p>
                                    ) : (
                                        subjects.map(subj => (
                                            <label key={subj.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.subjectIds.includes(subj.id)}
                                                    onChange={() => toggleSubject(subj.id)}
                                                    className="rounded"
                                                    disabled={isLoading}
                                                />
                                                <span className="text-sm">{subj.name}</span>
                                                {subj.code && <span className="text-xs text-muted-foreground">({subj.code})</span>}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Kelas yang Diajar</label>
                                <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                                    {classes.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Belum ada kelas</p>
                                    ) : (
                                        classes.map(cls => (
                                            <label key={cls.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.teacherClassIds.includes(cls.id)}
                                                    onChange={() => toggleTeacherClass(cls.id)}
                                                    className="rounded"
                                                    disabled={isLoading}
                                                />
                                                <span className="text-sm">{cls.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Password Options */}
                    <div>
                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={formData.autoGeneratePassword}
                                onChange={(e) => setFormData({ ...formData, autoGeneratePassword: e.target.checked })}
                                className="rounded"
                                disabled={isLoading}
                            />
                            <span className="text-sm font-medium">Generate Password Otomatis</span>
                        </label>

                        {formData.autoGeneratePassword ? (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Password Default:</p>
                                <p className="font-mono font-semibold">password123</p>
                            </div>
                        ) : (
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Masukkan password"
                                disabled={isLoading}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tambah User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
