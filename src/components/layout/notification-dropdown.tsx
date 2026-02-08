"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, ExternalLink, GraduationCap, AlertTriangle, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface Notification {
    id: string;
    type: "exam" | "violation" | "user" | "result" | "system";
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    link?: string;
}

// Dummy notifications data
const dummyNotifications: Notification[] = [
    {
        id: "1",
        type: "exam",
        title: "Ujian Baru Tersedia",
        message: "Ujian Matematika Kelas X telah dipublikasikan",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false,
        link: "/teacher/exams"
    },
    {
        id: "2",
        type: "violation",
        title: "Pelanggaran Terdeteksi",
        message: "Siswa Budi Santoso melakukan tab switch",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        link: "/teacher/violations"
    },
    {
        id: "3",
        type: "user",
        title: "User Baru Terdaftar",
        message: "15 siswa baru telah didaftarkan via import",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        link: "/admin/users"
    },
    {
        id: "4",
        type: "result",
        title: "Hasil Ujian Masuk",
        message: "25 siswa telah menyelesaikan Ujian Fisika",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isRead: true,
        link: "/teacher/results"
    },
    {
        id: "5",
        type: "system",
        title: "Sistem Update",
        message: "Fitur import Excel telah ditambahkan",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
    },
];

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "exam": return <GraduationCap className="w-4 h-4 text-blue-500" />;
        case "violation": return <AlertTriangle className="w-4 h-4 text-red-500" />;
        case "user": return <UserPlus className="w-4 h-4 text-green-500" />;
        case "result": return <FileText className="w-4 h-4 text-purple-500" />;
        case "system": return <Bell className="w-4 h-4 text-gray-500" />;
        default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
};

const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
};

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                    <DropdownMenuLabel className="p-0 font-semibold">
                        Notifikasi
                        {unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                {unreadCount} baru
                            </span>
                        )}
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-primary hover:text-primary"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 border-b last:border-0 hover:bg-muted/50 transition-colors group ${!notification.isRead ? "bg-primary/5" : ""
                                    }`}
                            >
                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notification.isRead ? "bg-primary/10" : "bg-muted"
                                        }`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium truncate ${!notification.isRead ? "text-foreground" : "text-muted-foreground"
                                                }`}>
                                                {notification.title}
                                            </p>
                                            {!notification.isRead && (
                                                <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] text-muted-foreground">
                                                {getTimeAgo(notification.timestamp)}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => markAsRead(notification.id)}
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </Button>
                                                )}
                                                {notification.link && (
                                                    <Link href={notification.link} onClick={() => markAsRead(notification.id)}>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                    onClick={() => deleteNotification(notification.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="m-0" />
                        <div className="p-2 flex justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground"
                                onClick={clearAll}
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Hapus Semua
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
