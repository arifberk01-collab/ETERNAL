import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium mb-1.5">{label}</label>}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-white/5 text-white border border-white/10 rounded-xl focus:ring-rose-500 focus:border-rose-500 h-12 px-4 transition-all text-base outline-none",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
