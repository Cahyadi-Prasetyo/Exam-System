"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, BookOpen, Users } from "lucide-react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/actions/class-subject-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SubjectData {
    id: string;
    name: string;
    code: string | null;
    _count: { teachers: number };
}

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
    const [formData, setFormData] = useState({ name: "", code: "" });
    const { toast } = useToast();

    const fetchSubjects = async () => {
        setIsLoading(true);
        const data = await getSubjects();
        setSubjects(data as SubjectData[]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleOpenModal = (subject?: SubjectData) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({ name: subject.name, code: subject.code || "" });
        } else {
            setEditingSubject(null);
            setFormData({ name: "", code: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (editingSubject) {
            result = await updateSubject(editingSubject.id, formData);
        } else {
            result = await createSubject(formData);
        }

        if (result.success) {
            toast({ title: editingSubject ? "Mapel diupdate" : "Mapel ditambahkan", variant: "default" });
            setIsModalOpen(false);
            fetchSubjects();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus mata pelajaran ini?")) return;
        const result = await deleteSubject(id);
        if (result.success) {
            toast({ title: "Mapel dihapus", variant: "default" });
            fetchSubjects();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Mata Pelajaran</h1>
                    <p className="text-muted-foreground">Kelola daftar mata pelajaran</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
            ) : subjects.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada mata pelajaran. Tambahkan yang pertama!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subj) => (
                        <div key={subj.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{subj.name}</h3>
                                    {subj.code && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                            {subj.code}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(subj)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subj.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {subj._count.teachers} Guru
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
                        <DialogTitle>{editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Mata Pelajaran</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Contoh: Matematika"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kode (Opsional)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Contoh: MAT"
                                maxLength={5}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">{editingSubject ? "Update" : "Tambah"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
