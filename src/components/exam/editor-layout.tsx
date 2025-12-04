"use client";

import { useState, useEffect } from "react";
import { QuestionList } from "./question-list";
import { QuestionEditor } from "./question-editor";
import { createQuestion, deleteQuestion } from "@/actions/question-actions";
import { publishExam, regenerateToken } from "@/actions/exam-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Share2, RefreshCw, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
    exam: {
        id: string;
        title: string;
        status: string;
        token: string | null;
    };
    questions: any[];
}

export function EditorLayout({ exam, questions }: EditorLayoutProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Publishing State
    const [status, setStatus] = useState(exam.status);
    const [token, setToken] = useState(exam.token);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

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

    const handlePublish = async () => {
        if (!confirm("Apakah Anda yakin ingin mempublikasikan ujian ini? Siswa akan dapat mengakses ujian dengan token.")) return;

        setIsPublishing(true);
        const res = await publishExam(exam.id);
        if (res.success && res.token) {
            setStatus("PUBLISHED");
            setToken(res.token);
        } else {
            alert("Gagal mempublikasikan ujian");
        }
        setIsPublishing(false);
    };

    const handleRegenerateToken = async () => {
        if (!confirm("Token lama tidak akan berlaku lagi. Lanjutkan?")) return;

        setIsRegenerating(true);
        const res = await regenerateToken(exam.id);
        if (res.success && res.token) {
            setToken(res.token);
        } else {
            alert("Gagal generate token baru");
        }
        setIsRegenerating(false);
    };

    const copyToken = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const selectedQuestion = questions.find(q => q.id === selectedId);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Top Bar */}
            <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/exams"
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-gray-900">{exam.title}</h1>
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium border",
                                status === "PUBLISHED"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                            )}>
                                {status === "PUBLISHED" ? "Published" : "Draft"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Editor Soal</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {status === "PUBLISHED" && token ? (
                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Token:</span>
                            <code className="text-sm font-bold text-indigo-900 tracking-widest">{token}</code>
                            <div className="h-4 w-px bg-indigo-200 mx-1" />
                            <button onClick={copyToken} className="text-indigo-400 hover:text-indigo-700 transition-colors" title="Copy Token">
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleRegenerateToken}
                                disabled={isRegenerating}
                                className="text-indigo-400 hover:text-indigo-700 transition-colors"
                                title="Regenerate Token"
                            >
                                <RefreshCw className={cn("w-4 h-4", isRegenerating && "animate-spin")} />
                            </button>
                        </div>
                    ) : (
                        <Button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                        >
                            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                            Publish Exam
                        </Button>
                    )}

                    <div className="h-6 w-px bg-gray-200 mx-1" />

                    <Button variant="outline" size="sm" className="gap-2 text-gray-600">
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                </div>
            </header >

            {/* Main Content */}
            < div className="flex flex-1 overflow-hidden" >
                <QuestionList
                    questions={questions}
                    selectedQuestionId={selectedId}
                    onSelect={handleSelect}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />

                {
                    selectedQuestion ? (
                        <QuestionEditor question={selectedQuestion} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Eye className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="font-medium">Pilih atau buat soal baru</p>
                            <p className="text-sm text-gray-400 mt-1">Gunakan sidebar kiri untuk navigasi</p>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
