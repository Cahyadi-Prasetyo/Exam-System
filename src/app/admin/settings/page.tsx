"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Moon,
    Sun,
    Bell,
    Shield,
    Database,
    Palette,
    Clock,
    Save,
    Check
} from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        examDuration: 60,
        maxViolations: 3,
        autoSubmitOnTimeout: true,
        showScoreAfterSubmit: true,
        allowReviewAnswers: true,
        notifyNewExam: true,
        notifyExamEnd: true,
        sessionTimeout: 30,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: "Pengaturan berhasil disimpan" });
        setIsSaving(false);
    };

    const SettingCard = ({
        icon: Icon,
        title,
        description,
        children,
        gradient
    }: {
        icon: any;
        title: string;
        description: string;
        children: React.ReactNode;
        gradient: string;
    }) => (
        <div className="bg-card border rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    const Toggle = ({
        checked,
        onChange,
        label
    }: {
        checked: boolean;
        onChange: (val: boolean) => void;
        label: string;
    }) => (
        <label className="flex items-center justify-between py-2 cursor-pointer group">
            <span className="text-sm">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'
                    }`}
            >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`} />
            </button>
        </label>
    );

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        Pengaturan Sistem
                    </h1>
                    <p className="text-muted-foreground mt-1">Konfigurasi sistem ujian online</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                >
                    {isSaving ? (
                        <>Menyimpan...</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Simpan Pengaturan</>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theme Settings */}
                <SettingCard
                    icon={Palette}
                    title="Tampilan"
                    description="Atur tema dan tampilan aplikasi"
                    gradient="from-purple-500 to-purple-600"
                >
                    <div className="flex gap-3">
                        <button
                            onClick={() => setTheme("light")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${theme === "light"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Sun className="w-5 h-5" />
                            Light
                            {theme === "light" && <Check className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${theme === "dark"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Moon className="w-5 h-5" />
                            Dark
                            {theme === "dark" && <Check className="w-4 h-4" />}
                        </button>
                    </div>
                </SettingCard>

                {/* Exam Settings */}
                <SettingCard
                    icon={Clock}
                    title="Pengaturan Ujian"
                    description="Konfigurasi default untuk ujian"
                    gradient="from-blue-500 to-blue-600"
                >
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Durasi Default (menit)</label>
                            <input
                                type="number"
                                value={settings.examDuration}
                                onChange={(e) => setSettings({ ...settings, examDuration: parseInt(e.target.value) || 60 })}
                                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Maks. Pelanggaran</label>
                            <input
                                type="number"
                                value={settings.maxViolations}
                                onChange={(e) => setSettings({ ...settings, maxViolations: parseInt(e.target.value) || 3 })}
                                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        </div>
                    </div>
                </SettingCard>

                {/* Auto Submit Settings */}
                <SettingCard
                    icon={Shield}
                    title="Keamanan & Proctoring"
                    description="Pengaturan keamanan ujian"
                    gradient="from-red-500 to-red-600"
                >
                    <div className="space-y-1 divide-y divide-border">
                        <Toggle
                            checked={settings.autoSubmitOnTimeout}
                            onChange={(val) => setSettings({ ...settings, autoSubmitOnTimeout: val })}
                            label="Auto-submit saat waktu habis"
                        />
                        <Toggle
                            checked={settings.showScoreAfterSubmit}
                            onChange={(val) => setSettings({ ...settings, showScoreAfterSubmit: val })}
                            label="Tampilkan nilai setelah submit"
                        />
                        <Toggle
                            checked={settings.allowReviewAnswers}
                            onChange={(val) => setSettings({ ...settings, allowReviewAnswers: val })}
                            label="Izinkan review jawaban"
                        />
                    </div>
                </SettingCard>

                {/* Notification Settings */}
                <SettingCard
                    icon={Bell}
                    title="Notifikasi"
                    description="Pengaturan notifikasi sistem"
                    gradient="from-amber-500 to-amber-600"
                >
                    <div className="space-y-1 divide-y divide-border">
                        <Toggle
                            checked={settings.notifyNewExam}
                            onChange={(val) => setSettings({ ...settings, notifyNewExam: val })}
                            label="Notifikasi ujian baru"
                        />
                        <Toggle
                            checked={settings.notifyExamEnd}
                            onChange={(val) => setSettings({ ...settings, notifyExamEnd: val })}
                            label="Notifikasi ujian selesai"
                        />
                    </div>
                </SettingCard>

                {/* Session Settings */}
                <SettingCard
                    icon={Database}
                    title="Sesi & Data"
                    description="Pengaturan sesi pengguna"
                    gradient="from-green-500 to-green-600"
                >
                    <div>
                        <label className="text-sm font-medium">Timeout Sesi (menit)</label>
                        <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            User akan logout otomatis setelah tidak aktif selama waktu ini
                        </p>
                    </div>
                </SettingCard>
            </div>
        </div>
    );
}
