import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
    onAnswerSelect: (optionId: string) => void;
    onNext: () => void;
    onPrevious: () => void;
    onToggleFlag: () => void;
    onShowHelp: () => void;
    currentQuestion: number;
    totalQuestions: number;
    optionsCount: number;
    disabled?: boolean;
}

export function useKeyboardShortcuts({
    onAnswerSelect,
    onNext,
    onPrevious,
    onToggleFlag,
    onShowHelp,
    currentQuestion,
    totalQuestions,
    optionsCount,
    disabled = false,
}: KeyboardShortcutsOptions) {
    useEffect(() => {
        if (disabled) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const key = e.key.toLowerCase();

            // Answer selection: A, B, C, D, E
            if (['a', 'b', 'c', 'd', 'e'].includes(key)) {
                const optionIndex = key.charCodeAt(0) - 'a'.charCodeAt(0);
                if (optionIndex < optionsCount) {
                    const optionId = String.fromCharCode(65 + optionIndex); // Convert to uppercase A-E
                    onAnswerSelect(optionId);
                    e.preventDefault();
                }
            }

            // Navigation: Arrow keys
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (currentQuestion < totalQuestions - 1) {
                    onNext();
                    e.preventDefault();
                }
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentQuestion > 0) {
                    onPrevious();
                    e.preventDefault();
                }
            }

            // Flag question: F
            if (key === 'f') {
                onToggleFlag();
                e.preventDefault();
            }

            // Next question: Space
            if (e.key === ' ') {
                if (currentQuestion < totalQuestions - 1) {
                    onNext();
                    e.preventDefault();
                }
            }

            // Show shortcuts help: ?
            if (e.key === '?') {
                onShowHelp();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [
        onAnswerSelect,
        onNext,
        onPrevious,
        onToggleFlag,
        onShowHelp,
        currentQuestion,
        totalQuestions,
        optionsCount,
        disabled,
    ]);
}
