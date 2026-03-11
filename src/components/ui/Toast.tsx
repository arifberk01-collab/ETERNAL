import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error';
export interface ToastState { message: string; type: ToastType; visible: boolean; }

export function Toast({ toast }: { toast: ToastState }) {
    if (!toast.visible) return null;
    const isSuccess = toast.type === 'success';
    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-medium tracking-wide text-sm transition-all duration-500 animate-in slide-in-from-top-4 fade-in ${isSuccess ? 'bg-indigo-950/90 text-rose-400 border border-rose-500/30 backdrop-blur-xl' : 'bg-red-950/90 text-red-200 border border-red-500/30 backdrop-blur-xl'}`}>
            {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {toast.message}
        </div>
    );
}

export function useToast() {
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    return { toast, showToast };
}
