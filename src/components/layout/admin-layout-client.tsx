"use client";

import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/admin-sidebar";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

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
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Navbar with Mobile Trigger */}
                <div className="sticky top-0 z-30 bg-white border-b px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden -ml-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Navbar user={{ name: "Admin User", role: "Administrator", email: "admin@exam.com" }} />
                    </div>
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
