"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users, GraduationCap } from "lucide-react";
import { getClasses, createClass, updateClass, deleteClass } from "@/actions/class-subject-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
    id: string;
    name: string;
    grade: number;
    _count: { students: number; teachers: number };
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassData | null>(null);
    const [formData, setFormData] = useState({ name: "", grade: 10 });
    const { toast } = useToast();

    const fetchClasses = async () => {
        setIsLoading(true);
        const data = await getClasses();
        setClasses(data as ClassData[]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleOpenModal = (classItem?: ClassData) => {
        if (classItem) {
            setEditingClass(classItem);
            setFormData({ name: classItem.name, grade: classItem.grade });
        } else {
            setEditingClass(null);
            setFormData({ name: "", grade: 10 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (editingClass) {
            result = await updateClass(editingClass.id, formData);
        } else {
            result = await createClass(formData);
        }

        if (result.success) {
            toast({ title: editingClass ? "Kelas diupdate" : "Kelas ditambahkan", variant: "default" });
            setIsModalOpen(false);
            fetchClasses();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus kelas ini?")) return;
        const result = await deleteClass(id);
        if (result.success) {
            toast({ title: "Kelas dihapus", variant: "default" });
            fetchClasses();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const gradeLabel = (grade: number) => {
        if (grade === 10) return "X";
        if (grade === 11) return "XI";
        if (grade === 12) return "XII";
        return grade.toString();
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
                    <p className="text-muted-foreground">Kelola daftar kelas di sekolah</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Kelas
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
            ) : classes.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada kelas. Tambahkan kelas pertama!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                                    <p className="text-sm text-muted-foreground">Kelas {gradeLabel(cls.grade)}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cls)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {cls._count.students} Siswa
                                </span>
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4" /> {cls._count.teachers} Guru
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingClass ? "Edit Kelas" : "Tambah Kelas Baru"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Kelas</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Contoh: X-IPA-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tingkat</label>
                            <select
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            >
                                <option value={10}>Kelas X</option>
                                <option value={11}>Kelas XI</option>
                                <option value={12}>Kelas XII</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">{editingClass ? "Update" : "Tambah"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
