"use client";

import { useState, useCallback } from "react";
import {
    Upload,
    FileText,
    Check,
    X,
    AlertCircle,
    Loader2,
    Edit,
    Trash2,
    CheckCircle2,
    FileQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { parseQuestionsFromText, type ParsedQuestion } from "@/lib/document-parser";

interface DocumentImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (questions: ParsedQuestion[]) => void;
}

type Step = "upload" | "parsing" | "preview" | "importing";

const difficultyLabels: Record<string, string> = {
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
};

export function DocumentImportModal({ isOpen, onClose, onImport }: DocumentImportModalProps) {
    const [step, setStep] = useState<Step>("upload");
    const [file, setFile] = useState<File | null>(null);
    const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const { toast } = useToast();

    // Reset state
    const resetState = () => {
        setStep("upload");
        setFile(null);
        setParsedQuestions([]);
        setErrors([]);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    // File handling
    const handleFileSelect = async (selectedFile: File) => {
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];

        const hasValidExtension = validExtensions.some(ext =>
            selectedFile.name.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension && !validTypes.includes(selectedFile.type)) {
            toast({
                title: "Format tidak didukung",
                description: "Gunakan file PDF, DOC, DOCX, atau TXT",
                variant: "destructive"
            });
            return;
        }

        setFile(selectedFile);
        setStep("parsing");

        try {
            // Read file content
            let text = "";

            if (selectedFile.name.toLowerCase().endsWith('.txt')) {
                text = await selectedFile.text();
            } else if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
                // For PDF, we need to use server-side parsing
                // For now, show instruction modal
                toast({
                    title: "PDF Detected",
                    description: "Konversi PDF ke teks untuk hasil terbaik. Atau copy-paste konten ke field teks.",
                });
                // Fallback: try to read as text (won't work for binary PDF)
                text = await selectedFile.text();
            } else {
                // DOC/DOCX - try mammoth in browser
                const mammoth = await import('mammoth');
                const arrayBuffer = await selectedFile.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            }

            // Parse questions from text
            const result = parseQuestionsFromText(text);

            if (result.success && result.questions.length > 0) {
                setParsedQuestions(result.questions);
                setErrors(result.errors);
                setStep("preview");
            } else {
                setErrors(result.errors.length > 0 ? result.errors : ["Tidak ada soal yang ditemukan"]);
                setStep("upload");
                toast({
                    title: "Parsing gagal",
                    description: result.errors[0] || "Format dokumen tidak dikenali",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Parse error:", error);
            setStep("upload");
            toast({
                title: "Error",
                description: "Gagal membaca file. Coba format lain.",
                variant: "destructive"
            });
        }
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    }, []);

    // Question editing
    const handleRemoveQuestion = (index: number) => {
        setParsedQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleQuestionTextChange = (index: number, text: string) => {
        setParsedQuestions(prev => prev.map((q, i) =>
            i === index ? { ...q, text } : q
        ));
    };

    const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
        setParsedQuestions(prev => prev.map((q, i) => {
            if (i !== qIndex) return q;
            const newOptions = [...q.options];
            newOptions[optIndex] = value;
            return { ...q, options: newOptions };
        }));
    };

    const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
        setParsedQuestions(prev => prev.map((q, i) =>
            i === qIndex ? { ...q, correctAnswer: optIndex } : q
        ));
    };

    const handleTypeChange = (index: number, type: "multiple_choice" | "essay") => {
        setParsedQuestions(prev => prev.map((q, i) =>
            i === index ? {
                ...q,
                type,
                options: type === "multiple_choice" ? ["", "", "", ""] : [],
                correctAnswer: type === "multiple_choice" ? 0 : -1
            } : q
        ));
    };

    // Import questions
    const handleImport = async () => {
        if (parsedQuestions.length === 0) return;

        setStep("importing");

        try {
            onImport(parsedQuestions);
            toast({
                title: "Berhasil!",
                description: `${parsedQuestions.length} soal berhasil diimpor`
            });
            handleClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal mengimpor soal",
                variant: "destructive"
            });
            setStep("preview");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <FileText className="w-6 h-6" />
                            Import Soal dari Dokumen
                        </DialogTitle>
                        <p className="text-white/80 text-sm mt-1">
                            Upload file PDF, DOC, DOCX, atau TXT berisi soal
                        </p>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Upload Step */}
                    {step === "upload" && (
                        <div className="space-y-4">
                            {/* Drop zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                                    ${isDragging
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                        : "border-muted-foreground/30 hover:border-emerald-400 hover:bg-muted/50"
                                    }
                                `}
                                onClick={() => document.getElementById('doc-file-input')?.click()}
                            >
                                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-lg font-medium mb-2">
                                    Drag & drop file di sini
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    atau klik untuk memilih file
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Format: PDF, DOC, DOCX, TXT (Max 10MB)
                                </p>
                                <input
                                    id="doc-file-input"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFileSelect(f);
                                    }}
                                />
                            </div>

                            {/* Format guide */}
                            <div className="bg-muted/50 rounded-lg p-4 text-sm">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <FileQuestion className="w-4 h-4" />
                                    Format Dokumen yang Didukung:
                                </h4>
                                <pre className="bg-background rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap">
                                    {`1. Pertanyaan pilihan ganda?
   A. Opsi salah
   B. Opsi benar ✓
   C. Opsi salah
   D. Opsi salah

2. Pertanyaan esai?
   [Esai]

Tanda jawaban benar: ✓ * (benar)`}
                                </pre>
                            </div>

                            {/* Errors */}
                            {errors.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-600 dark:text-red-400">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Kesalahan:</p>
                                            <ul className="list-disc list-inside text-sm mt-1">
                                                {errors.map((err, i) => (
                                                    <li key={i}>{err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Parsing Step */}
                    {step === "parsing" && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
                            <p className="text-lg font-medium">Memproses dokumen...</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {file?.name}
                            </p>
                        </div>
                    )}

                    {/* Preview Step */}
                    {step === "preview" && (
                        <div className="space-y-4">
                            {/* Summary */}
                            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{parsedQuestions.length} soal ditemukan</p>
                                        <p className="text-sm text-muted-foreground">{file?.name}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={resetState}>
                                    Upload Ulang
                                </Button>
                            </div>

                            {/* Question list */}
                            <div className="space-y-4">
                                {parsedQuestions.map((q, qIndex) => (
                                    <div key={qIndex} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                                                    {qIndex + 1}
                                                </span>
                                                <select
                                                    value={q.type}
                                                    onChange={(e) => handleTypeChange(qIndex, e.target.value as "multiple_choice" | "essay")}
                                                    className="text-xs border rounded px-2 py-1 bg-background"
                                                >
                                                    <option value="multiple_choice">Pilihan Ganda</option>
                                                    <option value="essay">Esai</option>
                                                </select>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500"
                                                onClick={() => handleRemoveQuestion(qIndex)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Question text */}
                                        <textarea
                                            value={q.text}
                                            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none mb-3"
                                            rows={2}
                                        />

                                        {/* Options for multiple choice */}
                                        {q.type === "multiple_choice" && (
                                            <div className="space-y-2">
                                                {q.options.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={q.correctAnswer === optIndex}
                                                            onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm font-medium w-5">
                                                            {String.fromCharCode(65 + optIndex)}.
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                            placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                                                            className="flex-1 px-2 py-1 border rounded text-sm bg-background"
                                                        />
                                                        {q.correctAnswer === optIndex && (
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Importing Step */}
                    {step === "importing" && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
                            <p className="text-lg font-medium">Mengimpor soal...</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {parsedQuestions.length} soal akan ditambahkan
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t bg-muted/30">
                    <Button variant="ghost" onClick={handleClose}>
                        Batal
                    </Button>
                    {step === "preview" && (
                        <Button
                            onClick={handleImport}
                            disabled={parsedQuestions.length === 0}
                            className="bg-linear-to-r from-emerald-500 to-teal-600"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Import {parsedQuestions.length} Soal
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
