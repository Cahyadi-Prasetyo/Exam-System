"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { startExam } from "@/actions/student-actions";
import { Loader2, Play } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface LobbyClientProps {
    examId: string;
}

export function LobbyClient({ examId }: LobbyClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam === "no_questions") {
            setError("Ujian ini belum memiliki soal. Silakan hubungi pengawas.");
        }
    }, [searchParams]);

    const handleStart = async () => {
        if (!confirm("Waktu akan berjalan setelah Anda menekan tombol Start. Yakin ingin memulai?")) return;

        setIsLoading(true);
        setError(null);

        const res = await startExam(examId);

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        }
        // Redirect handled by server action
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Button
                onClick={handleStart}
                disabled={isLoading || !!searchParams.get("error")}
                className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memuat Soal...
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Mulai Ujian Sekarang
                    </>
                )}
            </Button>
        </div>
    );
}
