"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { Calendar, Plus } from 'lucide-react';
import { AppEvent } from "@/lib/types";
import { daysUntil } from "@/lib/utils";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EventCard } from "@/components/EventCard";

export default function EventsPage() {
    const router = useRouter();
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);

    // New Fields State
    const [eventType, setEventType] = useState<'meeting' | 'anniversary'>('meeting');
    const [locationInput, setLocationInput] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setSessionUserId(session.user.id);

            const { data } = await supabase.from('events').select('*').eq('user_id', session.user.id);
            if (data) {
                setEvents(data);
            } else {
                setEvents([]);
            }
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenAdd = () => {
        setEditingEvent(null);
        setEventType('meeting');
        setLocationInput('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (event: AppEvent) => {
        setEditingEvent(event);
        setEventType(event.type || 'meeting');
        setLocationInput(event.location || '');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (!error) setEvents(events.filter(e => e.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const dateISO = formData.get('dateISO') as string;

        // Extracting new fields from state
        const typeSelected = eventType;
        const locationSelected = eventType === 'meeting' ? locationInput.trim() : null;

        if (editingEvent) {
            const { error } = await supabase
                .from('events')
                .update({ title, dateISO, type: typeSelected, location: locationSelected, user_id: sessionUserId })
                .eq('id', editingEvent.id);

            if (!error) {
                setEvents(events.map(e => e.id === editingEvent.id ? { ...e, title, dateISO, type: typeSelected, location: locationSelected || undefined } : e));
            }
        } else {
            if (!sessionUserId) {
                alert("Oturum bulunamadı, lütfen tekrar giriş yapın.");
                return;
            }

            const { data, error } = await supabase
                .from('events')
                .insert([{
                    title,
                    dateISO,
                    iconType: 'heart',
                    type: typeSelected,
                    location: locationSelected,
                    user_id: sessionUserId
                }])
                .select();

            if (error) {
                alert("Hata: " + error.message);
            } else if (data) {
                setEvents([...events, data[0]]);
            }
        }
        setIsModalOpen(false);
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;

    const safeEvents = events || [];
    const groupedEvents = safeEvents.reduce((acc: Record<string, AppEvent[]>, event) => {
        if (!event?.dateISO) return acc;
        const date = new Date(event.dateISO);
        const monthYear = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(event);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedEvents).sort((a, b) => {
        const dateA = new Date(groupedEvents[a]?.[0]?.dateISO || 0);
        const dateB = new Date(groupedEvents[b]?.[0]?.dateISO || 0);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <div className="flex flex-col gap-6">
            {sortedKeys.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center glass-panel rounded-[2rem] border-dashed border-white/20 mt-10">
                    <Calendar size={48} className="text-slate-500 mb-4 opacity-40" />
                    <h4 className="font-medium text-slate-200 mb-2 tracking-wide font-playfair uppercase">Henüz bir etkinlik yok</h4>
                    <p className="text-xs font-light text-slate-400 max-w-[250px] leading-relaxed">Önemli tarihleri buraya ekleyerek geri sayımı başlatabilirsiniz.</p>
                </div>
            )}

            {sortedKeys.map(key => (
                <section key={key}>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-1 font-playfair">{key}</h3>
                    <div className="flex flex-col gap-3">
                        {groupedEvents[key].map((event: AppEvent) => {
                            const daysLeft = daysUntil(event.dateISO);
                            return (
                                <EventCard
                                    key={event.id}
                                    event={{ ...event, daysLeft }}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                </section>
            ))}

            <FloatingActionButton onClick={handleOpenAdd} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}>
                <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
                    <Input name="title" label="Etkinlik Adı" defaultValue={editingEvent?.title} required />
                    <Input name="dateISO" label="Tarih" type="date" defaultValue={editingEvent?.dateISO} required />

                    <div className="flex flex-col gap-2">
                        <label className="text-xs tracking-wider text-slate-400 pl-4 uppercase">Etkinlik Türü</label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value as any)}
                            className="h-14 rounded-2xl glass-panel text-white bg-white/5 border border-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all duration-500 outline-none px-4 font-light text-sm cursor-pointer appearance-none"
                        >
                            <option value="meeting" className="bg-slate-900 text-white">Buluşma (Tek Seferlik)</option>
                            <option value="anniversary" className="bg-slate-900 text-white">Yıl Dönümü (Tekrarlayan)</option>
                        </select>
                    </div>

                    {eventType === 'meeting' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Input
                                name="location"
                                label="Konum (Örn: Kadıköy Moda)"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-14 bg-white/10 text-white border border-white/20 hover:bg-rose-500 hover:border-transparent transition-all duration-300">
                            {editingEvent ? "Güncelle" : "Ekle"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
