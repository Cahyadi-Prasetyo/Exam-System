"use client";

import { useState } from "react";
import {
    Search,
    Plus,
    Filter,
    Tag,
    BookOpen,
    Trash2,
    Edit,
    Copy,
    ChevronDown,
    Shuffle,
    CheckCircle2,
    XCircle,
    X,
    Save,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DocumentImportModal } from "@/components/exam/document-import-modal";
import type { ParsedQuestion } from "@/lib/document-parser";

// Types
interface Question {
    id: string;
    text: string;
    type: "multiple_choice" | "essay";
    subject: string;
    topic: string;
    difficulty: "easy" | "medium" | "hard";
    options?: string[];
    correctAnswer?: number;
    createdAt: Date;
}

// Dummy questions
const dummyQuestions: Question[] = [
    {
        id: "1",
        text: "Berapakah hasil dari 2 + 2 × 3?",
        type: "multiple_choice",
        subject: "Matematika",
        topic: "Operasi Hitung",
        difficulty: "easy",
        options: ["6", "8", "10", "12"],
        correctAnswer: 1,
        createdAt: new Date("2024-03-10"),
    },
    {
        id: "2",
        text: "Jelaskan hukum Newton pertama tentang gerak!",
        type: "essay",
        subject: "Fisika",
        topic: "Mekanika",
        difficulty: "medium",
        createdAt: new Date("2024-03-09"),
    },
    {
        id: "3",
        text: "Apa rumus kimia air?",
        type: "multiple_choice",
        subject: "Kimia",
        topic: "Senyawa",
        difficulty: "easy",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0,
        createdAt: new Date("2024-03-08"),
    },
    {
        id: "4",
        text: "Sebutkan dan jelaskan 3 organel sel yang hanya dimiliki tumbuhan!",
        type: "essay",
        subject: "Biologi",
        topic: "Sel",
        difficulty: "hard",
        createdAt: new Date("2024-03-07"),
    },
    {
        id: "5",
        text: "Nilai x yang memenuhi persamaan 3x + 5 = 17 adalah...",
        type: "multiple_choice",
        subject: "Matematika",
        topic: "Aljabar",
        difficulty: "medium",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        createdAt: new Date("2024-03-06"),
    },
    {
        id: "6",
        text: "Percepatan gravitasi bumi adalah...",
        type: "multiple_choice",
        subject: "Fisika",
        topic: "Gravitasi",
        difficulty: "easy",
        options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
        correctAnswer: 1,
        createdAt: new Date("2024-03-05"),
    },
];

const subjects = ["Semua", "Matematika", "Fisika", "Kimia", "Biologi"];
const difficulties = ["Semua", "easy", "medium", "hard"];
const types = ["Semua", "multiple_choice", "essay"];

const difficultyLabels: Record<string, string> = {
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
};

const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function QuestionBankPage() {
    const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("Semua");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Semua");
    const [selectedType, setSelectedType] = useState("Semua");
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
    const [randomCount, setRandomCount] = useState(5);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isDocImportOpen, setIsDocImportOpen] = useState(false);
    const { toast } = useToast();

    // Form state for add/edit
    const [formData, setFormData] = useState({
        text: "",
        type: "multiple_choice" as "multiple_choice" | "essay",
        subject: "Matematika",
        topic: "",
        difficulty: "medium" as "easy" | "medium" | "hard",
        options: ["", "", "", ""],
        correctAnswer: 0,
    });

    // Filter questions
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.topic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === "Semua" || q.subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === "Semua" || q.difficulty === selectedDifficulty;
        const matchesType = selectedType === "Semua" || q.type === selectedType;
        return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
    });

    const handleSelectQuestion = (id: string) => {
        setSelectedQuestions(prev =>
            prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuestions.length === filteredQuestions.length) {
            setSelectedQuestions([]);
        } else {
            setSelectedQuestions(filteredQuestions.map(q => q.id));
        }
    };

    const handleDeleteQuestion = (id: string) => {
        if (confirm("Hapus soal ini?")) {
            setQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    const handleGenerateRandom = () => {
        const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(randomCount, shuffled.length));
        setSelectedQuestions(selected.map(q => q.id));
        setIsRandomModalOpen(false);
        toast({
            title: "Soal Dipilih",
            description: `${selected.length} soal dipilih secara acak!`,
        });
    };

    const resetForm = () => {
        setFormData({
            text: "",
            type: "multiple_choice",
            subject: "Matematika",
            topic: "",
            difficulty: "medium",
            options: ["", "", "", ""],
            correctAnswer: 0,
        });
        setEditingQuestion(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleEditQuestion = (question: Question) => {
        setFormData({
            text: question.text,
            type: question.type,
            subject: question.subject,
            topic: question.topic,
            difficulty: question.difficulty,
            options: question.options || ["", "", "", ""],
            correctAnswer: question.correctAnswer || 0,
        });
        setEditingQuestion(question);
        setIsAddModalOpen(true);
    };

    const handleSaveQuestion = () => {
        if (!formData.text.trim()) {
            toast({ title: "Error", description: "Teks soal harus diisi", variant: "destructive" });
            return;
        }
        if (!formData.topic.trim()) {
            toast({ title: "Error", description: "Topik harus diisi", variant: "destructive" });
            return;
        }

        if (editingQuestion) {
            // Update existing
            setQuestions(prev => prev.map(q =>
                q.id === editingQuestion.id
                    ? { ...q, ...formData, options: formData.type === "multiple_choice" ? formData.options : undefined }
                    : q
            ));
            toast({ title: "Berhasil", description: "Soal berhasil diperbarui" });
        } else {
            // Add new
            const newQuestion: Question = {
                id: Date.now().toString(),
                text: formData.text,
                type: formData.type,
                subject: formData.subject,
                topic: formData.topic,
                difficulty: formData.difficulty,
                options: formData.type === "multiple_choice" ? formData.options : undefined,
                correctAnswer: formData.type === "multiple_choice" ? formData.correctAnswer : undefined,
                createdAt: new Date(),
            };
            setQuestions(prev => [newQuestion, ...prev]);
            toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
        }

        setIsAddModalOpen(false);
        resetForm();
    };

    const handleBulkDelete = () => {
        if (confirm(`Hapus ${selectedQuestions.length} soal yang dipilih?`)) {
            setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
            setSelectedQuestions([]);
            toast({ title: "Berhasil", description: `${selectedQuestions.length} soal dihapus` });
        }
    };

    const handleBulkDuplicate = () => {
        const duplicated = questions
            .filter(q => selectedQuestions.includes(q.id))
            .map(q => ({
                ...q,
                id: `${q.id}-copy-${Date.now()}`,
                text: `[SALINAN] ${q.text}`,
                createdAt: new Date(),
            }));
        setQuestions(prev => [...duplicated, ...prev]);
        setSelectedQuestions([]);
        toast({ title: "Berhasil", description: `${duplicated.length} soal diduplikat` });
    };

    // Handle import from document
    const handleDocImport = (importedQuestions: ParsedQuestion[]) => {
        const newQuestions: Question[] = importedQuestions.map((q, idx) => ({
            id: `imported-${Date.now()}-${idx}`,
            text: q.text,
            type: q.type,
            subject: q.subject || "Matematika",
            topic: q.topic || "Umum",
            difficulty: q.difficulty || "medium",
            options: q.type === "multiple_choice" ? q.options : undefined,
            correctAnswer: q.type === "multiple_choice" ? q.correctAnswer : undefined,
            createdAt: new Date(),
        }));
        setQuestions(prev => [...newQuestions, ...prev]);
        toast({ title: "Berhasil", description: `${newQuestions.length} soal diimpor dari dokumen` });
    };

    const stats = {
        total: questions.length,
        easy: questions.filter(q => q.difficulty === "easy").length,
        medium: questions.filter(q => q.difficulty === "medium").length,
        hard: questions.filter(q => q.difficulty === "hard").length,
    };

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        Bank Soal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola koleksi soal untuk ujian
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setIsRandomModalOpen(true)}>
                        <Shuffle className="w-4 h-4 mr-2" />
                        Acak Soal
                    </Button>
                    <Button variant="outline" onClick={() => setIsDocImportOpen(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Import Dokumen
                    </Button>
                    <Button onClick={handleOpenAddModal}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Soal
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Soal</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.easy}</p>
                    <p className="text-sm text-muted-foreground">Mudah</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
                    <p className="text-sm text-muted-foreground">Sedang</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-3xl font-bold text-red-600">{stats.hard}</p>
                    <p className="text-sm text-muted-foreground">Sulit</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari soal atau topik..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                        />
                    </div>

                    {/* Subject Filter */}
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-background"
                    >
                        {subjects.map(s => (
                            <option key={s} value={s}>{s === "Semua" ? "Semua Mapel" : s}</option>
                        ))}
                    </select>

                    {/* Difficulty Filter */}
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-background"
                    >
                        {difficulties.map(d => (
                            <option key={d} value={d}>
                                {d === "Semua" ? "Semua Tingkat" : difficultyLabels[d]}
                            </option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-background"
                    >
                        {types.map(t => (
                            <option key={t} value={t}>
                                {t === "Semua" ? "Semua Tipe" : t === "multiple_choice" ? "Pilihan Ganda" : "Esai"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedQuestions.length > 0 && (
                <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                    <span className="font-medium">
                        {selectedQuestions.length} soal dipilih
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedQuestions([])}>
                            Batal
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleBulkDuplicate}>
                            <Copy className="w-4 h-4 mr-1" />
                            Duplikat
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hapus
                        </Button>
                    </div>
                </div>
            )}

            {/* Question List */}
            <div className="bg-card rounded-xl border overflow-hidden">
                {/* Header */}
                <div className="p-3 border-b bg-muted/50 flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-muted-foreground">
                        Menampilkan {filteredQuestions.length} dari {questions.length} soal
                    </span>
                </div>

                {/* Questions */}
                <div className="divide-y">
                    {filteredQuestions.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">Tidak ada soal yang ditemukan</p>
                        </div>
                    ) : (
                        filteredQuestions.map((question) => (
                            <div key={question.id} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.includes(question.id)}
                                        onChange={() => handleSelectQuestion(question.id)}
                                        className="w-4 h-4 rounded mt-1"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium line-clamp-2">{question.text}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                                {question.subject}
                                            </span>
                                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {question.topic}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${difficultyColors[question.difficulty]}`}>
                                                {difficultyLabels[question.difficulty]}
                                            </span>
                                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                                                {question.type === "multiple_choice" ? "Pilihan Ganda" : "Esai"}
                                            </span>
                                        </div>
                                        {question.type === "multiple_choice" && question.options && (
                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                {question.options.map((opt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${idx === question.correctAnswer
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-muted"
                                                            }`}
                                                    >
                                                        {idx === question.correctAnswer ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                        <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleEditQuestion(question)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Random Question Modal */}
            <Dialog open={isRandomModalOpen} onOpenChange={setIsRandomModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shuffle className="w-5 h-5" />
                            Acak Soal
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Pilih soal secara acak dari hasil filter saat ini ({filteredQuestions.length} soal tersedia)
                        </p>
                        <div>
                            <label className="block text-sm font-medium mb-1">Jumlah Soal</label>
                            <input
                                type="number"
                                min={1}
                                max={filteredQuestions.length}
                                value={randomCount}
                                onChange={(e) => setRandomCount(Number(e.target.value))}
                                className="w-full px-4 py-2 border rounded-lg bg-background"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRandomModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleGenerateRandom}>
                            <Shuffle className="w-4 h-4 mr-2" />
                            Acak {randomCount} Soal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Question Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={(open) => { if (!open) { resetForm(); setIsAddModalOpen(false); } }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {editingQuestion ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {editingQuestion ? "Edit Soal" : "Tambah Soal Baru"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Teks Soal *</label>
                            <textarea
                                value={formData.text}
                                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                                placeholder="Masukkan teks pertanyaan..."
                            />
                        </div>

                        {/* Type & Subject Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tipe Soal</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        type: e.target.value as "multiple_choice" | "essay"
                                    }))}
                                    className="w-full px-4 py-2 border rounded-lg bg-background"
                                >
                                    <option value="multiple_choice">Pilihan Ganda</option>
                                    <option value="essay">Esai</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mata Pelajaran</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg bg-background"
                                >
                                    {subjects.filter(s => s !== "Semua").map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Topic & Difficulty Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Topik *</label>
                                <input
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                                    placeholder="Contoh: Aljabar, Mekanika, dll."
                                    className="w-full px-4 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tingkat Kesulitan</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        difficulty: e.target.value as "easy" | "medium" | "hard"
                                    }))}
                                    className="w-full px-4 py-2 border rounded-lg bg-background"
                                >
                                    <option value="easy">Mudah</option>
                                    <option value="medium">Sedang</option>
                                    <option value="hard">Sulit</option>
                                </select>
                            </div>
                        </div>

                        {/* Options (for multiple choice) */}
                        {formData.type === "multiple_choice" && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Opsi Jawaban</label>
                                <div className="space-y-2">
                                    {formData.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={formData.correctAnswer === idx}
                                                onChange={() => setFormData(prev => ({ ...prev, correctAnswer: idx }))}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm font-medium w-6">{String.fromCharCode(65 + idx)}.</span>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOptions = [...formData.options];
                                                    newOptions[idx] = e.target.value;
                                                    setFormData(prev => ({ ...prev, options: newOptions }));
                                                }}
                                                placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                                                className="flex-1 px-3 py-1.5 border rounded bg-background text-sm"
                                            />
                                            {formData.correctAnswer === idx && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Pilih radio button untuk menandai jawaban yang benar
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => { resetForm(); setIsAddModalOpen(false); }}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveQuestion}>
                            <Save className="w-4 h-4 mr-2" />
                            {editingQuestion ? "Simpan Perubahan" : "Tambah Soal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Document Import Modal */}
            <DocumentImportModal
                isOpen={isDocImportOpen}
                onClose={() => setIsDocImportOpen(false)}
                onImport={handleDocImport}
            />
        </div>
    );
}

