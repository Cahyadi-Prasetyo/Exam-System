"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { AddUserModal } from "@/components/admin/add-user-modal";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { getUsers, resetPassword } from "@/actions/admin-actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

type RoleFilter = "ALL" | "STUDENT" | "TEACHER";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterRole, setFilterRole] = useState<RoleFilter>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        const data = await getUsers();
        if (Array.isArray(data)) {
            setUsers(data as User[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter and search users
    const filteredUsers = users.filter((user) => {
        const matchesRole = filterRole === "ALL" || user.role === filterRole;
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleResetPassword = async (user: User) => {
        if (confirm(`Reset password untuk ${user.name}? Password akan menjadi 'password123'`)) {
            const res = await resetPassword(user.id);
            if (res.success) {
                toast({
                    title: "Password Reset Berhasil",
                    description: `Password untuk ${user.email} telah direset menjadi '${res.newPassword}'`,
                });
            } else {
                toast({
                    title: "Gagal Reset Password",
                    description: "Terjadi kesalahan saat mereset password.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleUserCreated = () => {
        fetchUsers();
        setIsAddModalOpen(false);
        toast({ title: "User Berhasil Dibuat" });
    };

    const handleUserUpdated = () => {
        fetchUsers();
        setIsEditModalOpen(false);
        toast({ title: "User Berhasil Diupdate" });
    };

    const handleUserDeleted = () => {
        fetchUsers();
        setIsDeleteDialogOpen(false);
        toast({ title: "User Berhasil Dihapus" });
    };

    const columns = [
        {
            header: "Nama",
            accessorKey: "name" as keyof User,
            cell: (user: User) => (
                <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            ),
        },
        {
            header: "Role",
            accessorKey: "role" as keyof User,
            cell: (user: User) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "TEACHER"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                >
                    {user.role === "TEACHER" ? "Guru" : user.role === "ADMIN" ? "Admin" : "Siswa"}
                </span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status" as keyof User,
            cell: (user: User) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${user.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                >
                    {user.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
            ),
        },
        {
            header: "Terdaftar",
            accessorKey: "createdAt" as keyof User,
            cell: (user: User) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </span>
            ),
        },
        {
            header: "Aksi",
            accessorKey: "id" as keyof User,
            cell: (user: User) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleResetPassword(user)}
                    >
                        Reset PW
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manajemen User</h1>
                    <p className="text-muted-foreground">
                        Kelola akun guru dan siswa
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Tambah User
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                {/* Role Filter */}
                <div className="flex gap-2">
                    {(["ALL", "STUDENT", "TEACHER"] as RoleFilter[]).map((role) => (
                        <Button
                            key={role}
                            size="sm"
                            variant={filterRole === role ? "default" : "outline"}
                            onClick={() => setFilterRole(role)}
                        >
                            {role === "ALL" ? "Semua" : role === "STUDENT" ? "Siswa" : "Guru"}
                        </Button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <DataTable columns={columns} data={filteredUsers} />
            )}

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleUserCreated}
            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={handleUserUpdated}
                user={selectedUser}
            />
            <DeleteUserDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={handleUserDeleted}
                user={selectedUser}
            />
        </div>
    );
}
