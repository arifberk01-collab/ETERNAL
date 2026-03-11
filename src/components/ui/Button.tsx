import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    const baseClass = "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-foreground hover:bg-gray-100 dark:hover:bg-white/10",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5",
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button className={cn(baseClass, variants[variant], sizes[size], className)} {...props}>
            {children}
        </button>
    );
}
