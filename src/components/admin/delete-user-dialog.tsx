"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/mock-admin-data";

interface DeleteUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export function DeleteUserDialog({ isOpen, onClose, user }: DeleteUserDialogProps) {
    const handleDelete = () => {
        // TODO: Implement delete user logic
        console.log("Deleting user:", user?.id);
        onClose();
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hapus User">
            <div className="space-y-4">
                <p>
                    Apakah Anda yakin ingin menghapus user <span className="font-bold">{user.name}</span> ({user.role})?
                </p>
                <p className="text-sm text-muted-foreground">
                    Tindakan ini tidak dapat dibatalkan. Semua data terkait user ini akan dihapus.
                </p>

                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} className="flex-1">
                        Hapus
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
