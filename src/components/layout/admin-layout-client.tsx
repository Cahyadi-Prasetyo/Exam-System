"use client";

import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/admin-sidebar";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            {/* Mobile Sidebar Sheet */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <AdminSidebarContent onClose={() => setIsSidebarOpen(false)} />
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg">Exam System</h1>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}
