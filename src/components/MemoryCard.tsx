"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Edit2, Trash2 } from 'lucide-react';
import { AppMemory } from '@/lib/types';

interface MemoryCardProps {
    memory: AppMemory;
    onEdit: (memory: AppMemory) => void;
    onDelete: (id: string) => void;
}

export function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
    return (
        <Card className="flex flex-col p-0 overflow-hidden relative border border-white/10 bg-white/5">
            <div className="p-5">
                <h4 className="font-medium text-slate-100 text-lg mb-1 tracking-wide">{memory.title}</h4>
                <p className="text-xs text-rose-400 font-light mb-4">
                    {new Date(memory.dateISO).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-h-[200px] overflow-y-auto mb-4">
                    {memory.description}
                </p>

                {memory.image && (
                    <div className="w-full h-48 sm:h-56 relative rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-2 shadow-inner">
                        <img
                            src={memory.image}
                            alt={memory.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="flex border-t border-white/10 divide-x divide-white/10 bg-white/5 backdrop-blur-md">
                <button
                    onClick={() => onEdit(memory)}
                    className="flex-1 flex justify-center items-center gap-2 py-3 text-xs tracking-wide font-medium text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors duration-500"
                >
                    <Edit2 size={14} /> Düzenle
                </button>
                <button
                    onClick={() => onDelete(memory.id)}
                    className="flex-1 flex justify-center items-center gap-2 py-3 text-xs tracking-wide font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-500"
                >
                    <Trash2 size={14} /> Sil
                </button>
            </div>
        </Card>
    );
}
