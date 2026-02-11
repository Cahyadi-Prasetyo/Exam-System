"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users, GraduationCap, Search } from "lucide-react";
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
    const [searchQuery, setSearchQuery] = useState("");
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
            toast({ title: editingClass ? "Kelas diupdate" : "Kelas ditambahkan", variant: "success" });
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
            toast({ title: "Kelas dihapus", variant: "success" });
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

    const gradeColors: Record<number, string> = {
        10: "from-blue-500 to-blue-600",
        11: "from-purple-500 to-purple-600",
        12: "from-green-500 to-green-600"
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        Manajemen Kelas
                    </h1>
                    <p className="text-muted-foreground mt-1">Kelola daftar kelas di sekolah</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-linear-to-r from-blue-500 to-blue-600 hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Kelas
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Cari kelas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[10, 11, 12].map(grade => {
                    const count = classes.filter(c => c.grade === grade).length;
                    return (
                        <div key={grade} className={`bg-linear-to-br ${gradeColors[grade]} p-4 rounded-xl text-white`}>
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm opacity-80">Kelas {gradeLabel(grade)}</div>
                        </div>
                    );
                })}
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
            ) : filteredClasses.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery ? "Tidak ada kelas yang cocok" : "Belum ada kelas. Tambahkan kelas pertama!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${gradeColors[cls.grade] || gradeColors[10]} flex items-center justify-center text-white font-bold`}>
                                        {gradeLabel(cls.grade)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{cls.name}</h3>
                                        <p className="text-sm text-muted-foreground">Kelas {gradeLabel(cls.grade)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cls)} className="hover:bg-primary/10 hover:text-primary">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)} className="hover:bg-destructive/10 hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{cls._count.students}</span> Siswa
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{cls._count.teachers}</span> Guru
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            {editingClass ? "Edit Kelas" : "Tambah Kelas Baru"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Nama Kelas</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Contoh: X-IPA-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tingkat</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[10, 11, 12].map(grade => (
                                    <button
                                        key={grade}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, grade })}
                                        className={`py-3 rounded-lg border-2 font-medium transition-all ${formData.grade === grade
                                            ? `border-transparent bg-linear-to-r ${gradeColors[grade]} text-white`
                                            : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        Kelas {gradeLabel(grade)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className={`bg-linear-to-r ${gradeColors[formData.grade]} hover:opacity-90`}>
                                {editingClass ? "Update" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
