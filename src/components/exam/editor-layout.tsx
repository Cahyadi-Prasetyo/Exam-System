"use client";

import { useState, useEffect } from "react";
import { QuestionList } from "./question-list";
import { QuestionEditor } from "./question-editor";
import { createQuestion, deleteQuestion } from "@/actions/question-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

interface EditorLayoutProps {
    exam: any; // Type this properly if possible
    questions: any[];
}

export function EditorLayout({ exam, questions }: EditorLayoutProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state with URL param
    useEffect(() => {
        const qParam = searchParams.get("q");
        if (qParam) {
            setSelectedId(qParam);
        } else if (questions.length > 0 && !selectedId) {
            // Default to first question if none selected
            setSelectedId(questions[0].id);
        }
    }, [searchParams, questions, selectedId]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        router.push(`/teacher/exams/${exam.id}/edit?q=${id}`);
    };

    const handleAdd = async () => {
        setIsLoading(true);
        const res = await createQuestion(exam.id);
        if (res.success && res.data) {
            handleSelect(res.data.id);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        await deleteQuestion(id, exam.id);
        // If we deleted the selected question, select the first one available
        if (selectedId === id) {
            const first = questions.find(q => q.id !== id);
            if (first) {
                handleSelect(first.id);
            } else {
                setSelectedId(null);
                router.push(`/teacher/exams/${exam.id}/edit`);
            }
        }
        setIsLoading(false);
    };

    const selectedQuestion = questions.find(q => q.id === selectedId);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Top Bar */}
            <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/dashboard"
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900">{exam.title}</h1>
                        <p className="text-xs text-gray-500">Editor Soal</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Selesai & Simpan
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <QuestionList
                    questions={questions}
                    selectedQuestionId={selectedId}
                    onSelect={handleSelect}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />

                {selectedQuestion ? (
                    <QuestionEditor question={selectedQuestion} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                        <p>Pilih atau buat soal baru untuk mulai mengedit.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
