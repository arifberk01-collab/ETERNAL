"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Star, Gift, PlusCircle, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { AppProfilePreferences } from '@/lib/types';
import { Toast, useToast } from '@/components/ui/Toast';

interface CustomDetail {
    id: string;
    key: string;
    value: string;
}

export default function PartnerPage() {
    const router = useRouter();
    const { toast, showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [customDetails, setCustomDetails] = useState<CustomDetail[]>([]);
    const [giftIdeas, setGiftIdeas] = useState<CustomDetail[]>([]);
    const [preferences, setPreferences] = useState<AppProfilePreferences>({});

    useEffect(() => {
        fetchPartnerData();
    }, []);

    const fetchPartnerData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data } = await supabase.from('profile').select('preferences').eq('id', session.user.id).single();
            if (data?.preferences) {
                setPreferences(data.preferences as AppProfilePreferences);

                // Load details
                const savedDetails = data.preferences.details || {};
                const loadedDetails = Object.entries(savedDetails).map(([k, v]) => ({
                    id: Math.random().toString(36).substring(7),
                    key: k,
                    value: v as string
                }));
                // Ensure at least one empty detail row if empty
                setCustomDetails(loadedDetails.length > 0 ? loadedDetails : [{ id: '1', key: '', value: '' }]);

                // Load gifts (storing in preferences.gifts)
                const savedGifts = (data.preferences as any).gifts || {};
                const loadedGifts = Object.entries(savedGifts).map(([k, v]) => ({
                    id: Math.random().toString(36).substring(7),
                    key: k,
                    value: v as string
                }));
                setGiftIdeas(loadedGifts.length > 0 ? loadedGifts : [{ id: '1', key: '', value: '' }]);
            }
        } catch (error) {
            console.error("Partner veri çekme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Details Handlers ---
    const addCustomDetail = () => {
        setCustomDetails(prev => [...prev, { id: Math.random().toString(36).substring(7), key: '', value: '' }]);
    };
    const updateCustomDetail = (id: string, field: 'key' | 'value', val: string) => {
        setCustomDetails(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));
    };
    const removeCustomDetail = (id: string) => {
        setCustomDetails(prev => prev.filter(d => d.id !== id));
    };

    // --- Gifts Handlers ---
    const addGiftIdea = () => {
        setGiftIdeas(prev => [...prev, { id: Math.random().toString(36).substring(7), key: '', value: '' }]);
    };
    const updateGiftIdea = (id: string, field: 'key' | 'value', val: string) => {
        setGiftIdeas(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));
    };
    const removeGiftIdea = (id: string) => {
        setGiftIdeas(prev => prev.filter(d => d.id !== id));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                showToast("Oturum bulunamadı, giriş yapın.", 'error');
                return;
            }

            // Construct JSON details
            const dynamicDetails: Record<string, string> = {};
            customDetails.forEach(d => {
                const k = d.key.trim();
                const v = d.value.trim();
                if (k && v) dynamicDetails[k] = v;
            });

            // Construct JSON gifts
            const dynamicGifts: Record<string, string> = {};
            giftIdeas.forEach(d => {
                const k = d.key.trim();
                const v = d.value.trim();
                if (k && v) dynamicGifts[k] = v;
            });

            const updatedPreferences = {
                ...preferences,
                details: dynamicDetails,
                gifts: dynamicGifts
            };

            const { error: pError } = await supabase.from('profile').update({
                preferences: updatedPreferences
            }).eq('id', user.id);

            if (pError) throw pError;
            showToast("Partner bilgileri kaydedildi", 'success');

        } catch (error: any) {
            showToast(error.message || "Kaydedilirken hata oluştu.", 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-32 text-slate-200 font-light px-2 sm:px-0">
            <Toast toast={toast} />

            <div className="flex flex-col gap-2 pt-4">
                <h1 className="text-4xl font-light tracking-wide text-white font-playfair uppercase">Partner</h1>
                <p className="text-sm font-light text-slate-400">Onunla ilgili her özel detay burada güvende.</p>
            </div>

            {/* ── İlişki Detayları ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <Star size={16} className="text-gold" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Partner Detayları</h3>
                </div>

                <div className="glass-panel bg-white/5 rounded-[2rem] p-4 space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {customDetails.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl opacity-70">
                            <h4 className="text-sm font-medium text-slate-300 mb-1 tracking-wide font-playfair uppercase italic">Henüz detay eklenmedi</h4>
                            <p className="text-xs text-slate-500 font-light max-w-[200px] mx-auto">En sevdiği kahve, yüzük ölçüsü veya sevdiği renkler...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 relative z-10">
                            {customDetails.map((detail) => (
                                <div key={detail.id} className="flex items-center gap-3 w-full group/item">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <FloatingInput
                                            label="Başlık (Örn: Kahve)"
                                            name={`key-${detail.id}`}
                                            value={detail.key}
                                            onChange={(e: any) => updateCustomDetail(detail.id, 'key', e.target.value)}
                                        />
                                        <FloatingInput
                                            label="Değer"
                                            name={`val-${detail.id}`}
                                            value={detail.value}
                                            onChange={(e: any) => updateCustomDetail(detail.id, 'value', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeCustomDetail(detail.id)}
                                        className="h-14 w-14 flex items-center justify-center shrink-0 rounded-2xl glass-panel bg-white/5 text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-1 flex justify-center w-full relative z-10">
                        <Button
                            onClick={addCustomDetail}
                            className="bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-gold rounded-full px-6 transition-all duration-500 font-light flex items-center gap-2 text-sm h-12"
                        >
                            <PlusCircle size={16} /> Yeni Detay Ekle
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Potansiyel Hediyeler ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <Gift size={16} className="text-gold" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Potansiyel Hediyeler</h3>
                </div>

                <div className="glass-panel bg-white/5 rounded-[2rem] p-4 space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#f1d7b3]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {giftIdeas.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl opacity-70">
                            <h4 className="text-sm font-medium text-slate-300 mb-1 tracking-wide font-playfair uppercase italic">Henüz hediye fikri yok</h4>
                            <p className="text-xs text-slate-500 font-light max-w-[200px] mx-auto">İlerisi için kaydetmek istediğiniz hediye fikirlerini buraya listeleyebilirsiniz.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 relative z-10">
                            {giftIdeas.map((gift) => (
                                <div key={gift.id} className="flex items-center gap-3 w-full group/item">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <FloatingInput
                                            label="Hediye (Örn: Kolye)"
                                            name={`gkey-${gift.id}`}
                                            value={gift.key}
                                            onChange={(e: any) => updateGiftIdea(gift.id, 'key', e.target.value)}
                                        />
                                        <FloatingInput
                                            label="Link veya Not"
                                            name={`gval-${gift.id}`}
                                            value={gift.value}
                                            onChange={(e: any) => updateGiftIdea(gift.id, 'value', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeGiftIdea(gift.id)}
                                        className="h-14 w-14 flex items-center justify-center shrink-0 rounded-2xl glass-panel bg-white/5 text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-1 flex justify-center w-full relative z-10">
                        <Button
                            onClick={addGiftIdea}
                            className="bg-white/5 border border-white/10 hover:border-[#f1d7b3]/30 hover:bg-[#f1d7b3]/10 text-gold rounded-full px-6 transition-all duration-500 font-light flex items-center gap-2 text-sm h-12"
                        >
                            <PlusCircle size={16} /> Hediye Fikri Ekle
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Floating Save Button ── */}
            <div className="relative w-full mt-4 mb-24 max-w-md mx-auto z-20 pointer-events-none">
                <Button
                    onClick={handleSave}
                    className="w-full h-16 rounded-full shadow-[0_10px_40px_rgba(244,63,94,0.15)] flex items-center justify-center gap-3 text-sm tracking-wide font-medium pointer-events-auto bg-slate-900 border border-rose-500/30 hover:border-rose-400/50 hover:bg-slate-950 text-slate-100 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 hover:text-gold"
                    disabled={saving}
                >
                    <Save size={20} className={saving ? 'animate-spin text-gold' : 'text-gold'} />
                    {saving ? "Değişiklikler Kaydediliyor" : "Değişiklikleri Kaydet"}
                </Button>
            </div>
        </div>
    );
}
