"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { AppConfig } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Heart, ShieldAlert, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            const userId = session.user.id;
            setSessionUserId(userId);

            const { data } = await supabase.from('config').select('*').eq('id', userId).single();
            if (data) {
                setConfig(data);
            } else {
                setConfig({ relationshipStartDate: new Date().toISOString().split('T')[0] } as AppConfig);
            }
        } catch (err) {
            console.error("Config fetch error", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!sessionUserId) return;
        const relationshipStartDate = e.target.value;
        const { error } = await supabase
            .from('config')
            .upsert({ id: sessionUserId, user_id: sessionUserId, relationshipStartDate }, { onConflict: 'id' });

        if (!error) {
            setConfig(prev => prev ? { ...prev, relationshipStartDate } : { relationshipStartDate });
        }
    };

    const handleWipeData = async () => {
        if (!sessionUserId) return;
        if (confirm("TÜM VERİLERİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?")) {
            await supabase.from('memories').delete().eq('user_id', sessionUserId);
            await supabase.from('events').delete().eq('user_id', sessionUserId);
            alert("Veriler sıfırlandı.");
            window.location.reload();
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-6 animate-pulse px-2">
            <div className="h-4 w-40 rounded-full bg-white/10 mb-2" />
            <div className="h-16 rounded-2xl bg-white/5" />
            <div className="h-4 w-40 rounded-full bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/5" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 pb-28 text-slate-200 font-light px-2 sm:px-0">

            {/* ── İlişki Bilgileri ── */}
            <section>
                <div className="flex items-center gap-2 pl-2 mb-4">
                    <Heart size={16} className="text-rose-400" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">İlişki Bilgileri</h3>
                </div>

                <div className="glass-panel p-6 space-y-4">
                    <div className="relative">
                        <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                            İlişki Başlangıç Tarihi 💖
                        </label>
                        <div className="relative">
                            <Heart size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400/60 pointer-events-none" />
                            <input
                                type="date"
                                value={config?.relationshipStartDate ?? ''}
                                onChange={handleDateChange}
                                className="w-full bg-white/5 text-slate-100 border border-white/10 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 px-4 pl-10 h-14 outline-none transition-all duration-300 text-sm font-light"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Tehlikeli Bölge ── */}
            <section>
                <div className="flex items-center gap-2 pl-2 mb-4">
                    <ShieldAlert size={16} className="text-red-400" />
                    <h3 className="text-xs font-medium text-red-400 uppercase tracking-widest">Tehlikeli Bölge</h3>
                </div>

                <div className="glass-panel p-6 border-red-500/20">
                    <p className="text-xs text-slate-400 font-light mb-4 leading-relaxed">
                        Bu işlem geri alınamaz. Tüm hatıralar ve etkinlikler kalıcı olarak silinecektir.
                    </p>
                    <Button
                        variant="danger"
                        className="w-full gap-2 font-medium h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300"
                        onClick={handleWipeData}
                    >
                        <Trash2 size={18} /> Verileri Sıfırla
                    </Button>
                </div>
            </section>

            <p className="text-center text-xs text-slate-600 mt-4 mb-4 tracking-widest uppercase">
                Eren Elbaş App v1.0.0
            </p>
        </div>
    );
}
