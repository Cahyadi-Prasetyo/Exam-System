import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number; // Minimum distance for swipe (in pixels)
    disabled?: boolean;
}

interface TouchPosition {
    x: number;
    y: number;
    time: number;
}

export function useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    disabled = false,
}: SwipeGestureOptions) {
    const touchStart = useRef<TouchPosition | null>(null);
    const touchEnd = useRef<TouchPosition | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        if (disabled) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchEnd.current = null;
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now(),
            };
            setIsSwiping(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStart.current) return;

            touchEnd.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now(),
            };

            const diffX = Math.abs(touchEnd.current.x - touchStart.current.x);
            const diffY = Math.abs(touchEnd.current.y - touchStart.current.y);

            // If horizontal swipe is dominant, prevent scrolling
            if (diffX > diffY && diffX > threshold / 2) {
                setIsSwiping(true);
                // Prevent vertical scroll during horizontal swipe
                e.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            if (!touchStart.current || !touchEnd.current) {
                setIsSwiping(false);
                return;
            }

            const diffX = touchEnd.current.x - touchStart.current.x;
            const diffY = touchEnd.current.y - touchStart.current.y;
            const diffTime = touchEnd.current.time - touchStart.current.time;

            const absX = Math.abs(diffX);
            const absY = Math.abs(diffY);

            // Ensure swipe is fast enough (within 300ms) and meets threshold
            if (diffTime > 300) {
                setIsSwiping(false);
                return;
            }

            // Horizontal swipe
            if (absX > absY && absX > threshold) {
                if (diffX > 0) {
                    onSwipeRight?.();
                } else {
                    onSwipeLeft?.();
                }
            }
            // Vertical swipe
            else if (absY > threshold) {
                if (diffY > 0) {
                    onSwipeDown?.();
                } else {
                    onSwipeUp?.();
                }
            }

            setIsSwiping(false);
            touchStart.current = null;
            touchEnd.current = null;
        };

        // Add listeners with passive: false to allow preventDefault
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, disabled]);

    return { isSwiping };
}
