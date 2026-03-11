"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, Trash2, Edit2, MapPin, Heart } from 'lucide-react';
import { AppEvent } from '@/lib/types';
import { daysUntil, daysUntilNextAnniversary } from '@/lib/utils';

interface EventCardProps {
    event: AppEvent;
    onEdit: (event: AppEvent) => void;
    onDelete: (id: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
    const isAnniversary = event.type === 'anniversary';
    const daysLeft = isAnniversary ? daysUntilNextAnniversary(event.dateISO) : daysUntil(event.dateISO);

    return (
        <Card className="flex flex-col p-0 overflow-hidden group border border-white/10 bg-white/5">
            <div className="flex items-center justify-between p-4 bg-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-rose-400 border border-white/10 flex items-center justify-center shrink-0">
                        {isAnniversary ? (
                            <Heart size={22} className="font-light text-[#f1d7b3]" />
                        ) : (
                            <Calendar size={22} className="font-light" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-100 tracking-wide">{event.title}</h4>
                        <div className="text-xs text-slate-400 font-light mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{new Date(event.dateISO).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>

                            {isAnniversary && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#f1d7b3]/30 text-[#f1d7b3] uppercase tracking-wider bg-[#f1d7b3]/10">
                                    Yıl Dönümü
                                </span>
                            )}

                            {event.type === 'meeting' && event.location && (
                                <span className="inline-flex items-center gap-1 text-slate-300">
                                    <MapPin size={10} className="text-rose-400" />
                                    {event.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    {daysLeft > 0 ? (
                        <>
                            <div className="text-xl font-light text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{daysLeft}</div>
                            <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">gün kaldı</div>
                        </>
                    ) : daysLeft === 0 ? (
                        <div className="text-rose-400 font-medium text-[11px] bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full uppercase tracking-widest">Bugün!</div>
                    ) : (
                        <div className="text-slate-500 font-medium text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Geçti</div>
                    )}
                </div>
            </div>

            {/* Actions reveal on swipe or tap */}
            <div className="flex border-t border-white/10 divide-x divide-white/10 bg-white/5 backdrop-blur-md">
                <button
                    onClick={() => onEdit(event)}
                    className="flex-1 flex justify-center items-center gap-2 py-3 text-xs tracking-wide font-medium text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors duration-500"
                >
                    <Edit2 size={14} /> Düzenle
                </button>
                <button
                    onClick={() => onDelete(event.id)}
                    className="flex-1 flex justify-center items-center gap-2 py-3 text-xs tracking-wide font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-500"
                >
                    <Trash2 size={14} /> Sil
                </button>
            </div>
        </Card>
    );
}
