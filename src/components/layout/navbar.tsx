"use client";

import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

interface NavbarProps {
    user: {
        name: string;
        role: string;
        email: string;
        image?: string;
    };
}

export function Navbar({ user }: NavbarProps) {
    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left side (Breadcrumbs or Page Title could go here) */}
            <div className="flex items-center gap-4">
                {/* Mobile menu trigger would be handled by the parent layout */}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
                {/* Notifications (Placeholder) */}
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 py-1.5 h-auto hover:bg-gray-50 rounded-full border border-transparent hover:border-gray-200 transition-all">
                            <Avatar className="h-8 w-8 border border-gray-200">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-700 leading-none">{user.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="w-4 h-4 mr-2 text-gray-500" />
                            Pengaturan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
