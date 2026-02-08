"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileText, ListChecks, BookOpen, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    text: string;
    type: string;
}

interface QuestionListProps {
    questions: Question[];
    selectedQuestionId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onImportFromBank?: () => void;
    onImportFromDoc?: () => void;
    isLoading?: boolean;
}

export function QuestionList({
    questions,
    selectedQuestionId,
    onSelect,
    onAdd,
    onDelete,
    onImportFromBank,
    onImportFromDoc,
    isLoading
}: QuestionListProps) {

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 md:w-72 shrink-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-700">Daftar Soal</h2>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 font-medium">
                            {questions.length}
                        </span>
                    </div>
                    <Button
                        onClick={onAdd}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        disabled={isLoading}
                        title="Tambah Soal Baru"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
                {onImportFromBank && (
                    <Button
                        onClick={onImportFromBank}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        disabled={isLoading}
                    >
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        Ambil dari Bank Soal
                    </Button>
                )}
                {onImportFromDoc && (
                    <Button
                        onClick={onImportFromDoc}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50 mt-1.5"
                        disabled={isLoading}
                    >
                        <Upload className="w-4 h-4 mr-1.5" />
                        Import dari Dokumen
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {questions.map((q, index) => (
                    <div
                        key={q.id}
                        onClick={() => onSelect(q.id)}
                        className={cn(
                            "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
                            selectedQuestionId === q.id
                                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 transition-colors",
                            selectedQuestionId === q.id
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        )}>
                            {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "text-sm font-medium truncate",
                                selectedQuestionId === q.id ? "text-indigo-900" : "text-gray-700"
                            )}>
                                {q.text.replace(/<[^>]*>?/gm, '') || "Tanpa Teks"}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                {q.type === "MULTIPLE_CHOICE" ? (
                                    <ListChecks className="w-3 h-3 text-gray-400" />
                                ) : (
                                    <FileText className="w-3 h-3 text-gray-400" />
                                )}
                                <span className="text-xs text-gray-400 truncate">
                                    {q.type === "MULTIPLE_CHOICE" ? "Pilihan Ganda" : "Essay"}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Yakin ingin menghapus soal ini?")) {
                                    onDelete(q.id);
                                }
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                ))}

                {questions.length === 0 && (
                    <div className="text-center py-10 px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Belum ada soal.</p>
                        <p className="text-xs text-gray-400 mt-1">Klik tombol (+) di atas untuk menambah soal.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
