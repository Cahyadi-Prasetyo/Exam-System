"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    getAllExamsForMonitoring,
    getExamParticipants,
    forceSubmitExam
} from "@/actions/monitoring-actions";
import {
    RefreshCw,
    Users,
    Clock,
    AlertTriangle,
    CheckCircle,
    Circle,
    Loader2,
    Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exam {
    id: string;
    title: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    _count: {
        examAttempts: number;
        questions: number;
    };
}

interface Participant {
    attemptId: string;
    studentName: string;
    studentEmail: string;
    startTime: Date;
    endTime: Date | null;
    status: string;
    score: number | null;
    answeredCount: number;
    totalQuestions: number;
    lastActivityAt: Date;
    connectionStatus: "online" | "idle" | "offline";
    violationCount: number;
}

export default function MonitoringPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [examInfo, setExamInfo] = useState<{ title: string; totalQuestions: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const { toast } = useToast();

    // Fetch exams list
    const fetchExams = useCallback(async () => {
        const data = await getAllExamsForMonitoring();
        if (Array.isArray(data)) {
            setExams(data as Exam[]);
            if (data.length > 0 && !selectedExamId) {
                setSelectedExamId(data[0].id);
            }
        }
        setIsLoading(false);
    }, [selectedExamId]);

    // Fetch participants for selected exam
    const fetchParticipants = useCallback(async () => {
        if (!selectedExamId) return;

        setIsRefreshing(true);
        const data = await getExamParticipants(selectedExamId);

        if (data && !("error" in data)) {
            setParticipants(data.participants);
            setExamInfo(data.exam);
        }

        setLastUpdated(new Date());
        setIsRefreshing(false);
    }, [selectedExamId]);

    // Initial load
    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    // Fetch participants when exam changes
    useEffect(() => {
        if (selectedExamId) {
            fetchParticipants();
        }
    }, [selectedExamId, fetchParticipants]);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        if (!autoRefresh || !selectedExamId) return;

        const interval = setInterval(() => {
            fetchParticipants();
        }, 5000);

        return () => clearInterval(interval);
    }, [autoRefresh, selectedExamId, fetchParticipants]);

    // Handle force submit
    const handleForceSubmit = async (attemptId: string, studentName: string) => {
        if (!confirm(`Apakah Anda yakin ingin memaksa pengumpulan ujian untuk ${studentName}?`)) {
            return;
        }

        const result = await forceSubmitExam(attemptId);

        if (result.success) {
            toast({
                title: "Berhasil",
                description: `Ujian ${studentName} telah dikumpulkan.`,
            });
            fetchParticipants();
        } else {
            toast({
                title: "Gagal",
                description: result.error || "Terjadi kesalahan.",
                variant: "destructive",
            });
        }
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: "online" | "idle" | "offline" }) => {
        const styles = {
            online: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
            idle: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
            offline: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
        };

        const icons = {
            online: <Circle className="w-3 h-3 fill-green-500 text-green-500" />,
            idle: <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />,
            offline: <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />,
        };

        const labels = {
            online: "Online",
            idle: "Idle",
            offline: "Offline",
        };

        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {icons[status]}
                {labels[status]}
            </span>
        );
    };

    // Stats summary
    const onlineCount = participants.filter((p) => p.connectionStatus === "online").length;
    const idleCount = participants.filter((p) => p.connectionStatus === "idle").length;
    const completedCount = participants.filter((p) => p.status === "SUBMITTED" || p.status === "COMPLETED").length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600" />
                    Monitoring Ujian Real-time
                </h1>
                <p className="text-muted-foreground mt-1">
                    Pantau siswa yang sedang mengerjakan ujian
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Exam Selector */}
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Pilih Ujian</label>
                    <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {exams.length === 0 && (
                            <option value="">Tidak ada ujian</option>
                        )}
                        {exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                                {exam.title} ({exam._count.examAttempts} peserta)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Refresh Controls */}
                <div className="flex items-end gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchParticipants}
                        disabled={isRefreshing || !selectedExamId}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        variant={autoRefresh ? "default" : "outline"}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        {autoRefresh ? "Auto: ON" : "Auto: OFF"}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                        Total Peserta
                    </div>
                    <div className="text-2xl font-bold">{participants.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
                        <Circle className="w-4 h-4 fill-green-500" />
                        Online
                    </div>
                    <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-yellow-600 mb-1">
                        <Circle className="w-4 h-4 fill-yellow-500" />
                        Idle
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{idleCount}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        Selesai
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
                </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
                <div className="text-sm text-muted-foreground mb-4">
                    Terakhir diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
                    {autoRefresh && <span className="ml-2">(Auto-refresh aktif)</span>}
                </div>
            )}

            {/* Participants Table */}
            {participants.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Belum Ada Peserta</h3>
                    <p className="text-muted-foreground">
                        Belum ada siswa yang mengerjakan ujian ini.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Siswa
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Aktivitas Terakhir
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Pelanggaran
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {participants.map((participant) => (
                                    <tr key={participant.attemptId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="font-medium">{participant.studentName}</div>
                                                <div className="text-sm text-muted-foreground">{participant.studentEmail}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-600 rounded-full"
                                                        style={{
                                                            width: `${(participant.answeredCount / participant.totalQuestions) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {participant.answeredCount}/{participant.totalQuestions}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {participant.status === "SUBMITTED" || participant.status === "COMPLETED" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Selesai
                                                </span>
                                            ) : (
                                                <StatusBadge status={participant.connectionStatus} />
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {new Date(participant.lastActivityAt).toLocaleTimeString("id-ID")}
                                        </td>
                                        <td className="px-4 py-4">
                                            {participant.violationCount > 0 ? (
                                                <span className="inline-flex items-center gap-1 text-red-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {participant.violationCount}
                                                </span>
                                            ) : (
                                                <span className="text-green-600">0</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {participant.status !== "SUBMITTED" && participant.status !== "COMPLETED" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleForceSubmit(participant.attemptId, participant.studentName)}
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Force Submit
                                                </Button>
                                            )}
                                            {(participant.status === "SUBMITTED" || participant.status === "COMPLETED") && participant.score !== null && (
                                                <span className="font-medium">
                                                    Skor: {participant.score.toFixed(0)}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
