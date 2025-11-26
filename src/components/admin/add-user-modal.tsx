"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "STUDENT" as "STUDENT" | "TEACHER",
        autoGeneratePassword: true,
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement add user logic
        console.log("Adding user:", formData);
        onClose();
        // Reset form
        setFormData({
            name: "",
            email: "",
            role: "STUDENT",
            autoGeneratePassword: true,
            password: "",
        });
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
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
                            placeholder="John Doe"
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
                            placeholder="user@example.com"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "STUDENT" | "TEACHER" })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="STUDENT">Siswa</option>
                            <option value="TEACHER">Guru</option>
                        </select>
                    </div>

                    {/* Password Options */}
                    <div>
                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={formData.autoGeneratePassword}
                                onChange={(e) => {
                                    const auto = e.target.checked;
                                    setFormData({
                                        ...formData,
                                        autoGeneratePassword: auto,
                                        password: auto ? generatePassword() : "",
                                    });
                                }}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Generate Password Otomatis</span>
                        </label>

                        {formData.autoGeneratePassword ? (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Password yang di-generate:</p>
                                <p className="font-mono font-semibold">{formData.password || generatePassword()}</p>
                            </div>
                        ) : (
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Masukkan password"
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">Tambah User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
