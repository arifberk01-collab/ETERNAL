import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Parse a YYYY-MM-DD string (or Date) as LOCAL midnight, avoiding UTC timezone shift
function parseLocalDate(date: Date | string | null | undefined): Date {
    if (!date) return new Date(); // Fallback to today if missing

    if (date instanceof Date) {
        if (isNaN(date.getTime())) return new Date(); // Fallback if Invalid Date object
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    try {
        const parts = date.split('T')[0].split('-');
        if (parts.length !== 3) return new Date();
        const [year, month, day] = parts.map(Number);

        const d = new Date(year, month - 1, day, 0, 0, 0, 0);
        if (isNaN(d.getTime())) return new Date(); // Check for parsing failure
        return d;
    } catch {
        return new Date(); // Failsafe
    }
}

export function daysBetween(start: Date | string | null | undefined, end: Date | string | null | undefined): number {
    const d1 = parseLocalDate(start);
    const d2 = parseLocalDate(end);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function daysUntil(date: Date | string | null | undefined): number {
    const target = parseLocalDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return days; // negative = past, 0 = today, positive = future
}
