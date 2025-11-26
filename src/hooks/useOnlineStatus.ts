import { useState, useEffect } from 'react';

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        // Check initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setWasOffline(true);

            // Reset wasOffline after 3 seconds (for showing "reconnected" message)
            setTimeout(() => setWasOffline(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        // Listen to browser online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline, wasOffline };
}
