"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { updateUser } from "@/actions/admin-actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
}

export function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "STUDENT" as "STUDENT" | "TEACHER" | "ADMIN",
        status: user?.status || "active" as "active" | "inactive",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role as "STUDENT" | "TEACHER" | "ADMIN",
                status: user.status as "active" | "inactive",
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            const res = await updateUser(user.id, {
                name: formData.name,
                email: formData.email,
                role: formData.role as "STUDENT" | "TEACHER" | "ADMIN",
            });

            if (res.success) {
                onSuccess();
            } else {
                toast({
                    title: "Gagal Update User",
                    description: res.error || "Terjadi kesalahan.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Terjadi kesalahan jaringan.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "STUDENT" | "TEACHER" | "ADMIN" })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        >
                            <option value="STUDENT">Siswa</option>
                            <option value="TEACHER">Guru</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {/* Status (Read-only for now as we don't have status update in action yet) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={true} // Disabled for now
                        >
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Status user belum dapat diubah.</p>
                    </div>

                    {/* Actions */}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
