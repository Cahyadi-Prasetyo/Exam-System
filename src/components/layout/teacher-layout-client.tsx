"use client";

import { useState } from "react";
import { TeacherSidebar, TeacherSidebarContent } from "@/components/layout/teacher-sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function TeacherLayoutClient({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <TeacherSidebar />

            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b bg-background flex items-center gap-4 sticky top-0 z-40">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="-ml-2"
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
                <span className="font-bold text-lg text-primary">ExamAdmin</span>
            </div>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} side="left">
                <SheetContent className="p-0 w-64">
                    <TeacherSidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
