"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile, changePassword } from "@/actions/profile-actions";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Lock, Save, Loader2 } from "lucide-react";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Profile form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { toast } = useToast();

    // Fetch profile on mount
    useEffect(() => {
        async function fetchProfile() {
            const result = await getProfile();
            if (result.user) {
                setProfile(result.user);
                setName(result.user.name);
                setEmail(result.user.email);
            }
            setIsLoading(false);
        }
        fetchProfile();
    }, []);

    // Handle profile update
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateProfile({ name, email });

        if (result.success) {
            toast({
                title: "Berhasil",
                description: "Profil berhasil diperbarui.",
            });
            // Update local state
            setProfile((prev) => prev ? { ...prev, name, email } : null);
        } else {
            toast({
                title: "Gagal",
                description: result.error || "Gagal memperbarui profil.",
                variant: "destructive",
            });
        }

        setIsSaving(false);
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);

        const result = await changePassword({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (result.success) {
            toast({
                title: "Berhasil",
                description: "Password berhasil diubah.",
            });
            // Reset form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);
        } else {
            toast({
                title: "Gagal",
                description: result.error || "Gagal mengubah password.",
                variant: "destructive",
            });
        }

        setIsChangingPassword(false);
    };

    // Role label
    const getRoleLabel = (role: string) => {
        switch (role) {
            case "ADMIN": return "Administrator";
            case "TEACHER": return "Guru";
            case "STUDENT": return "Siswa";
            default: return role;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat profil.</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <User className="w-8 h-8 text-indigo-600" />
                    Profil Saya
                </h1>
                <p className="text-muted-foreground mt-1">
                    Kelola informasi akun Anda
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 mb-6">
                {/* Avatar and Role Badge */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                            {profile.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{profile.name}</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            {getRoleLabel(profile.role)}
                        </span>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Bergabung Sejak
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={new Date(profile.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted/50"
                                disabled
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Simpan Perubahan
                    </Button>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Keamanan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Kelola password akun Anda
                        </p>
                    </div>
                    {!showPasswordForm && (
                        <Button
                            variant="outline"
                            onClick={() => setShowPasswordForm(true)}
                        >
                            Ubah Password
                        </Button>
                    )}
                </div>

                {showPasswordForm && (
                    <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                placeholder="Minimal 6 karakter"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                placeholder="Ulangi password baru"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isChangingPassword}>
                                {isChangingPassword ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Lock className="w-4 h-4 mr-2" />
                                )}
                                Ubah Password
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
