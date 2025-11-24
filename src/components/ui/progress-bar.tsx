import React from 'react';

interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    className?: string;
    showLabel?: boolean;
}

export function ProgressBar({
    value,
    max = 100,
    className = '',
    showLabel = false,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">{value}/{max}</span>
                    <span className="text-foreground font-medium">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
}
