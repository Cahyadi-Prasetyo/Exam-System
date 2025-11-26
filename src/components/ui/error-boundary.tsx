"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "./button";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error("Error caught by boundary:", error, errorInfo);

        // In production, you could log to an error reporting service
        // e.g., Sentry, LogRocket, etc.
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-background rounded-lg border border-border shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-destructive"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Oops! Terjadi Kesalahan
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Aplikasi mengalami error yang tidak terduga
                                    </p>
                                </div>
                            </div>

                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="mb-4 p-3 bg-destructive/5 rounded border border-destructive/20">
                                    <p className="text-xs font-mono text-destructive break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Button
                                    onClick={this.handleReset}
                                    className="w-full"
                                    variant="primary"
                                >
                                    Coba Lagi
                                </Button>
                                <Button
                                    onClick={() => (window.location.href = "/")}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    Kembali ke Halaman Utama
                                </Button>
                            </div>

                            <p className="mt-4 text-xs text-center text-muted-foreground">
                                Jika masalah berlanjut, hubungi administrator sistem
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
