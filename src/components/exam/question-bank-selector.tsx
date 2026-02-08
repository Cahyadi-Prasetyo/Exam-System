"use client";

import { useState } from "react";
import {
    Search,
    BookOpen,
    Tag,
    Check,
    X,
    Shuffle,
    Filter,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Types matching question-bank page
export interface BankQuestion {
    id: string;
    text: string;
    type: "multiple_choice" | "essay";
    subject: string;
    topic: string;
    difficulty: "easy" | "medium" | "hard";
    options?: string[];
    correctAnswer?: number;
}

interface QuestionBankSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectQuestions: (questions: BankQuestion[]) => void;
    existingQuestionIds?: string[];
}

// Dummy questions from bank
const bankQuestions: BankQuestion[] = [
    {
        id: "bank-1",
        text: "Berapakah hasil dari 2 + 2 × 3?",
        type: "multiple_choice",
        subject: "Matematika",
        topic: "Operasi Hitung",
        difficulty: "easy",
        options: ["6", "8", "10", "12"],
        correctAnswer: 1,
    },
    {
        id: "bank-2",
        text: "Jelaskan hukum Newton pertama tentang gerak!",
        type: "essay",
        subject: "Fisika",
        topic: "Mekanika",
        difficulty: "medium",
    },
    {
        id: "bank-3",
        text: "Apa rumus kimia air?",
        type: "multiple_choice",
        subject: "Kimia",
        topic: "Senyawa",
        difficulty: "easy",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0,
    },
    {
        id: "bank-4",
        text: "Sebutkan dan jelaskan 3 organel sel yang hanya dimiliki tumbuhan!",
        type: "essay",
        subject: "Biologi",
        topic: "Sel",
        difficulty: "hard",
    },
    {
        id: "bank-5",
        text: "Nilai x yang memenuhi persamaan 3x + 5 = 17 adalah...",
        type: "multiple_choice",
        subject: "Matematika",
        topic: "Aljabar",
        difficulty: "medium",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
    },
    {
        id: "bank-6",
        text: "Percepatan gravitasi bumi adalah...",
        type: "multiple_choice",
        subject: "Fisika",
        topic: "Gravitasi",
        difficulty: "easy",
        options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
        correctAnswer: 1,
    },
    {
        id: "bank-7",
        text: "Tuliskan persamaan reaksi fotosintesis!",
        type: "essay",
        subject: "Biologi",
        topic: "Metabolisme",
        difficulty: "medium",
    },
    {
        id: "bank-8",
        text: "Ion yang terbentuk dari atom Na adalah...",
        type: "multiple_choice",
        subject: "Kimia",
        topic: "Ikatan Kimia",
        difficulty: "easy",
        options: ["Na⁺", "Na⁻", "Na²⁺", "Na²⁻"],
        correctAnswer: 0,
    },
];

const subjects = ["Semua", "Matematika", "Fisika", "Kimia", "Biologi"];
const difficulties = ["Semua", "easy", "medium", "hard"];

const difficultyLabels: Record<string, string> = {
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
};

const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

export function QuestionBankSelector({
    isOpen,
    onClose,
    onSelectQuestions,
    existingQuestionIds = []
}: QuestionBankSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("Semua");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Semua");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [randomCount, setRandomCount] = useState(5);
    const [showRandomInput, setShowRandomInput] = useState(false);

    // Filter questions (exclude already added)
    const availableQuestions = bankQuestions.filter(q =>
        !existingQuestionIds.includes(q.id)
    );

    const filteredQuestions = availableQuestions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.topic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === "Semua" || q.subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === "Semua" || q.difficulty === selectedDifficulty;
        return matchesSearch && matchesSubject && matchesDifficulty;
    });

    const handleToggleQuestion = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredQuestions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredQuestions.map(q => q.id));
        }
    };

    const handleRandomSelect = () => {
        const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(randomCount, shuffled.length));
        setSelectedIds(selected.map(q => q.id));
        setShowRandomInput(false);
    };

    const handleConfirm = () => {
        const selectedQuestions = bankQuestions.filter(q => selectedIds.includes(q.id));
        onSelectQuestions(selectedQuestions);
        setSelectedIds([]);
        onClose();
    };

    const handleClose = () => {
        setSelectedIds([]);
        setSearchQuery("");
        setSelectedSubject("Semua");
        setSelectedDifficulty("Semua");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <BookOpen className="w-6 h-6" />
                            Ambil dari Bank Soal
                        </DialogTitle>
                        <p className="text-white/80 text-sm mt-1">
                            Pilih soal dari koleksi bank soal untuk ditambahkan ke ujian
                        </p>
                    </DialogHeader>
                </div>

                {/* Filters */}
                <div className="p-4 border-b bg-muted/30 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari soal..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm"
                            />
                        </div>

                        {/* Subject Filter */}
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-3 py-2 border rounded-lg bg-background text-sm"
                        >
                            {subjects.map(s => (
                                <option key={s} value={s}>{s === "Semua" ? "Semua Mapel" : s}</option>
                            ))}
                        </select>

                        {/* Difficulty Filter */}
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-3 py-2 border rounded-lg bg-background text-sm"
                        >
                            {difficulties.map(d => (
                                <option key={d} value={d}>
                                    {d === "Semua" ? "Semua Tingkat" : difficultyLabels[d]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={handleSelectAll}>
                            <Check className="w-4 h-4 mr-1" />
                            {selectedIds.length === filteredQuestions.length ? "Batal Pilih Semua" : "Pilih Semua"}
                        </Button>

                        {showRandomInput ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    max={filteredQuestions.length}
                                    value={randomCount}
                                    onChange={(e) => setRandomCount(Number(e.target.value))}
                                    className="w-16 px-2 py-1 border rounded text-sm"
                                />
                                <Button size="sm" onClick={handleRandomSelect}>
                                    Acak
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowRandomInput(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setShowRandomInput(true)}>
                                <Shuffle className="w-4 h-4 mr-1" />
                                Acak Soal
                            </Button>
                        )}

                        <span className="ml-auto text-sm text-muted-foreground">
                            {selectedIds.length} dari {filteredQuestions.length} dipilih
                        </span>
                    </div>
                </div>

                {/* Question List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredQuestions.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">Tidak ada soal yang tersedia</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    onClick={() => handleToggleQuestion(question.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedIds.includes(question.id)
                                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-border hover:border-indigo-300 hover:bg-muted/50"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedIds.includes(question.id)
                                                ? "bg-indigo-500 border-indigo-500"
                                                : "border-muted-foreground/40"
                                            }`}>
                                            {selectedIds.includes(question.id) && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-2">{question.text}</p>
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
                                                    {question.type === "multiple_choice" ? "PG" : "Esai"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t bg-muted/30">
                    <Button variant="ghost" onClick={handleClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedIds.length === 0}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambahkan {selectedIds.length} Soal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
