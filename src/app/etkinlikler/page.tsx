"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
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

            const { data } = await supabase.from('events').select('*');
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
        setIsModalOpen(true);
    };

    const handleOpenEdit = (event: AppEvent) => {
        setEditingEvent(event);
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

        if (editingEvent) {
            const { error } = await supabase
                .from('events')
                .update({ title, dateISO })
                .eq('id', editingEvent.id);

            if (!error) {
                setEvents(events.map(e => e.id === editingEvent.id ? { ...e, title, dateISO } : e));
            }
        } else {
            if (!sessionUserId) {
                alert("Oturum bulunamadı, lütfen tekrar giriş yapın.");
                return;
            }

            const { data, error } = await supabase
                .from('events')
                .insert([{ title, dateISO, iconType: 'heart', user_id: sessionUserId }])
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
                <div className="text-center text-gray-500 py-10 mt-10">Henüz bir etkinlik yok.</div>
            )}

            {sortedKeys.map(key => (
                <section key={key}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">{key}</h3>
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
                    <div className="pt-4">
                        <Button type="submit" className="w-full">
                            {editingEvent ? "Güncelle" : "Ekle"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
