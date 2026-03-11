import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsedItem = JSON.parse(item);
                if (typeof parsedItem === 'object' && parsedItem !== null && !Array.isArray(parsedItem)) {
                    if (key === 'eren_profile' && 'bloodGroup' in parsedItem) {
                        delete parsedItem.bloodGroup;
                    }
                    setState({ ...initialValue, ...parsedItem });
                } else {
                    setState(parsedItem);
                }
            } else {
                setState(initialValue);
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}": `, error);
        }
        setIsLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setState((current) => {
            const nextValue = value instanceof Function ? value(current) : value;

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                try {
                    window.localStorage.setItem(key, JSON.stringify(nextValue));
                } catch (error) {
                    console.warn(`Error setting localStorage key "${key}": `, error);
                }
            }, 300);

            return nextValue;
        });
    }, [key]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                        setState(prev => ({ ...prev, ...parsed }));
                    } else {
                        setState(parsed);
                    }
                } catch {
                    // Ignore parse error
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [state, setValue, isLoaded] as const;
}
