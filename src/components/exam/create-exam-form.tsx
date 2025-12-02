"use client";

import { useActionState } from "react";
import { createExam } from "@/actions/exam-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, FileText, Save, Settings, Sparkles } from "lucide-react";

export function CreateExamForm() {
    const [state, action, isPending] = useActionState(createExam, null);

    return (
        <form action={action}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 md:p-8 shadow-sm border-gray-200/60 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Sparkles className="w-32 h-32" />
                        </div>

                        <div className="space-y-6 relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Informasi Utama</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Judul Ujian <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="title"
                                        placeholder="Contoh: Ujian Akhir Semester Matematika Kelas X"
                                        required
                                        className="h-12 text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                    />
                                    {state?.fieldErrors?.title && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-red-500" />
                                            {state.fieldErrors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none text-sm"
                                        placeholder="Tuliskan deskripsi, instruksi, atau kompetensi dasar yang diujikan..."
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <Card className="p-6 shadow-sm border-gray-200/60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Settings className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Pengaturan</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Duration */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    Durasi Pengerjaan
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        name="duration"
                                        defaultValue={60}
                                        min={1}
                                        required
                                        className="pr-16"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                                        Menit
                                    </div>
                                </div>
                                {state?.fieldErrors?.duration && (
                                    <p className="text-sm text-red-500">{state.fieldErrors.duration}</p>
                                )}
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Schedule */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Waktu Mulai
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        name="startTime"
                                        required
                                        className="text-sm"
                                    />
                                    {state?.fieldErrors?.startTime && (
                                        <p className="text-sm text-red-500">{state.fieldErrors.startTime}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Waktu Selesai
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        name="endTime"
                                        required
                                        className="text-sm"
                                    />
                                    {state?.fieldErrors?.endTime && (
                                        <p className="text-sm text-red-500">{state.fieldErrors.endTime}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Error Message */}
                    {state?.error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            {state.error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        isLoading={isPending}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan & Lanjut
                    </Button>

                    <p className="text-xs text-center text-gray-400">
                        Langkah selanjutnya: Input Soal
                    </p>
                </div>
            </div>
        </form>
    );
}
