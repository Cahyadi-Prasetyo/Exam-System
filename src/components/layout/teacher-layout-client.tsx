"use client";

import { useState } from "react";
import { TeacherSidebar, TeacherSidebarContent } from "@/components/layout/teacher-sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export function TeacherLayoutClient({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <TeacherSidebar />

            {/* Mobile Sidebar Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} side="left">
                <SheetContent className="p-0 w-64">
                    <TeacherSidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen transition-all duration-300 flex flex-col">
                {/* Navbar with Mobile Trigger */}
                <div className="sticky top-0 z-30 bg-white border-b px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden -ml-2"
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
                        {/* Breadcrumb or Title could go here */}
                    </div>

                    <div className="flex items-center gap-4">
                        <Navbar user={{ name: "Pak Budi", role: "Guru Matematika", email: "guru@sekolah.id" }} />
                    </div>
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
