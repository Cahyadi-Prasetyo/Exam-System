"use client";

import { signOutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => signOutAction()}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
        </Button>
    );
}
