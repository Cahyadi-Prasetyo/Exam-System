"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, BookOpen, Users, Search } from "lucide-react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/actions/class-subject-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SubjectData {
    id: string;
    name: string;
    code: string | null;
    _count: { teachers: number };
}

const subjectColors = [
    "from-rose-500 to-rose-600",
    "from-amber-500 to-amber-600",
    "from-emerald-500 to-emerald-600",
    "from-cyan-500 to-cyan-600",
    "from-violet-500 to-violet-600",
    "from-pink-500 to-pink-600",
];

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
    const [formData, setFormData] = useState({ name: "", code: "" });
    const [searchQuery, setSearchQuery] = useState("");
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
            toast({ title: editingSubject ? "Mapel diupdate" : "Mapel ditambahkan" });
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
            toast({ title: "Mapel dihapus" });
            fetchSubjects();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const getColorByIndex = (index: number) => subjectColors[index % subjectColors.length];

    const filteredSubjects = subjects.filter(subj =>
        subj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subj.code && subj.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Manajemen Mata Pelajaran
                    </h1>
                    <p className="text-muted-foreground mt-1">Kelola daftar mata pelajaran</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                </Button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari mata pelajaran..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 rounded-lg text-white flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <div>
                        <div className="text-2xl font-bold">{subjects.length}</div>
                        <div className="text-xs opacity-80">Total Mapel</div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
            ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        {searchQuery ? "Tidak ada mata pelajaran yang cocok" : "Belum ada mata pelajaran. Tambahkan yang pertama!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSubjects.map((subj, index) => (
                        <div key={subj.id} className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorByIndex(index)} flex items-center justify-center text-white font-bold text-sm`}>
                                        {subj.code || subj.name.substring(0, 3).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{subj.name}</h3>
                                        {subj.code && (
                                            <span className={`text-xs bg-gradient-to-r ${getColorByIndex(index)} bg-clip-text text-transparent font-medium`}>
                                                {subj.code}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(subj)} className="hover:bg-primary/10 hover:text-primary">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subj.id)} className="hover:bg-destructive/10 hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{subj._count.teachers}</span> Guru mengajar
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
                            <BookOpen className="w-5 h-5 text-primary" />
                            {editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Nama Mata Pelajaran</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Contoh: Matematika"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Kode (Opsional)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background font-mono"
                                placeholder="Contoh: MAT"
                                maxLength={5}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Kode singkat untuk identifikasi cepat</p>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90">
                                {editingSubject ? "Update" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
