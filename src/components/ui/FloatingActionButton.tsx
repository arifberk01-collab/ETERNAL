"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingActionButton({
    onClick,
    className
}: {
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "fixed bottom-24 right-4 md:right-[calc(50%-190px)] w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 z-40",
                className
            )}
        >
            <Plus size={32} />
        </button>
    );
}
