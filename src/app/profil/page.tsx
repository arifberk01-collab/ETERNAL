"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from 'next/navigation';
import {
    User, Camera, Save, Settings, Heart, StickyNote,
    CheckCircle2, XCircle, Star, PlusCircle, Trash2, LogOut
} from "lucide-react";

// ─── Toast Component ───────────────────────────────────────────────────────────
type ToastType = 'success' | 'error';
interface ToastState { message: string; type: ToastType; visible: boolean; }

function Toast({ toast }: { toast: ToastState }) {
    if (!toast.visible) return null;
    const isSuccess = toast.type === 'success';
    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-medium tracking-wide text-sm transition-all duration-500 animate-in slide-in-from-top-4 fade-in ${isSuccess ? 'bg-indigo-950/90 text-rose-400 border border-rose-500/30 backdrop-blur-xl' : 'bg-red-950/90 text-red-200 border border-red-500/30 backdrop-blur-xl'}`}>
            {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {toast.message}
        </div>
    );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function SkeletonProfile() {
    return (
        <div className="flex flex-col gap-8 pb-28 animate-pulse px-2">
            <div className="flex flex-col items-center justify-center py-12 rounded-[2.5rem] glass-panel bg-white/5">
                <div className="w-28 h-28 rounded-full bg-white/10 mb-6" />
                <div className="h-8 w-40 rounded-full bg-white/10 mb-3" />
                <div className="h-4 w-64 rounded-full bg-white/10" />
            </div>
            <div className="space-y-4">
                <div className="h-4 w-32 rounded-full bg-white/10 ml-2" />
                <div className="h-[300px] rounded-[2.5rem] glass-panel bg-white/5" />
            </div>
        </div>
    );
}

// ─── Modern Floating Input Component ───────────────────────────────────────────
function FloatingInput({
    label, name, value, onChange, type = "text", icon, placeholder, className = ""
}: {
    label: string, name: string, value: string, onChange: any, type?: string, icon?: React.ReactNode, placeholder?: string, className?: string
}) {
    return (
        <div className={`relative group ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-500">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || " "}
                className={`peer w-full h-14 rounded-2xl glass-panel text-white placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 focus:bg-white/10 transition-all duration-500 outline-none pt-4 pb-1 ${icon ? 'pl-11' : 'pl-4'} pr-4 font-light text-sm`}
            />
            <label
                htmlFor={name}
                className={`absolute text-xs tracking-wider text-slate-400 duration-500 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-rose-500 ${icon ? 'left-11' : 'left-4'}`}
            >
                {label}
            </label>
        </div>
    );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Switch({ checked, onChange, label, description, icon }: { checked: boolean, onChange: () => void, label: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl glass-panel cursor-pointer hover:bg-white/10 hover:border-rose-500/30 transition-all duration-500" onClick={onChange}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 border ${checked ? 'bg-gold border-rose-400 text-slate-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-medium tracking-wide text-slate-200">{label}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] font-light leading-relaxed">{description}</p>
                </div>
            </div>
            <div className={`relative w-12 h-6 transition-colors duration-500 rounded-full ${checked ? 'bg-rose-500/30' : 'bg-white/10'}`}>
                <div className={`absolute top-1 left-1 bg-slate-200 w-4 h-4 rounded-full transition-transform duration-500 shadow-md ${checked ? 'translate-x-6 bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}

// ─── Live Love Counter Component ───────────────────────────────────────────────
function LoveCounter({ startDate }: { startDate: string }) {
    const [time, setTime] = useState<{ years: number; months: number; days: number; hours: number; minutes: number } | null>(null);

    useEffect(() => {
        if (!startDate) return;

        const calculateTime = () => {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) return;

            const now = new Date();
            let diff = now.getTime() - start.getTime();
            if (diff < 0) diff = 0;

            const y = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            const m = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
            const d = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTime({ years: y, months: m, days: d, hours: h, minutes: min });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // update every minute
        return () => clearInterval(timer);
    }, [startDate]);

    if (!time) {
        return (
            <div className="flex justify-center gap-3 mt-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-panel rounded-2xl p-2 min-w-[60px] h-[64px]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex justify-center gap-3 mt-6">
            {[
                { label: 'Yıl', value: time.years },
                { label: 'Ay', value: time.months },
                { label: 'Gün', value: time.days },
                { label: 'Saat', value: time.hours },
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center glass-panel rounded-2xl p-2 min-w-[64px] transition-all duration-500 hover:-translate-y-1 hover:shadow-rose-500/20 text-slate-100">
                    <span className="text-xl font-light">{item.value}</span>
                    <span className="text-[9px] uppercase tracking-widest text-gold mt-0.5">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfileDashboard() {
    const router = useRouter();
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

    // Ensure all strings are non-undefined for controlled inputs
    const [form, setForm] = useState({
        name: "", bio: "", avatar_url: ""
    });

    const [anniversaryDate, setAnniversaryDate] = useState("");

    // Dynamic Custom Preferences (Özel Detaylar)
    const [customDetails, setCustomDetails] = useState<{ id: string, key: string, value: string }[]>([]);

    const [preferences, setPreferences] = useState<{ showEvents: boolean, showMemories: boolean, details: any }>({
        showEvents: true, showMemories: true, details: {}
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            const userId = session.user.id;
            setSessionUserId(userId);

            const [profileRes, configRes] = await Promise.all([
                supabase.from('profile').select('*').eq('id', userId).maybeSingle(),
                supabase.from('config').select('*').eq('id', userId).maybeSingle()
            ]);

            const p = profileRes.data;
            if (p) {
                setForm(prev => ({
                    ...prev,
                    name: p.name || "", bio: p.bio || "", avatar_url: p.avatar_url || "",
                }));

                if (p.preferences && typeof p.preferences === 'object') {
                    const prefObj = p.preferences as any;
                    setPreferences(prev => ({ ...prev, ...prefObj }));

                    // Parse custom details
                    if (prefObj.details) {
                        const parsedDetails = Object.entries(prefObj.details).map(([k, v]) => ({
                            id: Math.random().toString(36).substring(7),
                            key: k,
                            value: String(v)
                        }));
                        setCustomDetails(parsedDetails);
                    }
                }
                if (p.avatar_url) setPreviewImage(p.avatar_url);
            }

            const c = configRes.data;
            if (c?.relationshipStartDate) {
                setAnniversaryDate(c.relationshipStartDate);
            }
        } catch (err) {
            console.error("Fetch hatası:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            showToast("Dosya boyutu 10MB'dan küçük olmalıdır.", 'error');
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `profile_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true });

            if (!uploadError) {
                const { data } = supabase.storage.from('photos').getPublicUrl(fileName);
                return data?.publicUrl ?? (previewImage || "");
            }
        } catch (err) {
            console.warn('Upload error', err);
        }
        return previewImage || "";
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error('Kullanıcı bulunamadı!');
                showToast("Oturum bulunamadı, lütfen tekrar giriş yapın.", 'error');
                setSaving(false);
                return;
            }

            let finalAvatarUrl = form.avatar_url;
            if (selectedFile) finalAvatarUrl = await uploadImage(selectedFile);

            // Construct JSONB details
            const dynamicDetails: Record<string, string> = {};
            customDetails.forEach(d => {
                const k = d.key.trim();
                const v = d.value.trim();
                if (k && v) dynamicDetails[k] = v;
            });

            const updatedPreferences = {
                ...preferences,
                details: dynamicDetails
            };

            // Upsert Profile
            const { error: pError } = await supabase.from('profile').upsert({
                id: user.id, user_id: user.id, ...form, avatar_url: finalAvatarUrl || null, preferences: updatedPreferences
            }, { onConflict: 'id' });

            // Upsert Config
            const { error: cError } = await supabase.from('config').upsert({
                id: user.id, user_id: user.id, relationshipStartDate: anniversaryDate || null
            }, { onConflict: 'id' });

            if (pError || cError) throw new Error(pError?.message || cError?.message);

            // ✅ Immediately update local state so UI reflects the new data
            if (finalAvatarUrl) {
                setForm(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
                setPreviewImage(finalAvatarUrl);
            }
            setSelectedFile(null);
            setPreferences(updatedPreferences);

            // Also re-fetch to ensure complete DB state sync
            await fetchData();

            showToast("Profil başarıyla güncellendi! ✨");
        } catch (err: any) {
            showToast(`Hata: ${err.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addCustomDetail = () => {
        setCustomDetails([...customDetails, { id: Math.random().toString(36).substring(7), key: "", value: "" }]);
    };

    const updateCustomDetail = (id: string, field: 'key' | 'value', val: string) => {
        setCustomDetails(customDetails.map(d => d.id === id ? { ...d, [field]: val } : d));
    };

    const removeCustomDetail = (id: string) => {
        setCustomDetails(customDetails.filter(d => d.id !== id));
    };

    if (loading) return <SkeletonProfile />;

    const displayAvatar = previewImage || form.avatar_url || null;

    return (
        <div className="flex flex-col gap-8 pb-32 text-slate-200 font-light px-2 sm:px-0">
            <Toast toast={toast} />

            {/* ── Glassmorphism Hero ── */}
            <section className="relative overflow-hidden rounded-[2.5rem] glass-panel p-8 mt-2 transition-all duration-700 hover:shadow-rose-500/10">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center">

                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(244,63,94,0.15)] cursor-pointer relative overflow-hidden group hover:scale-105 transition-all duration-500"
                    >
                        {displayAvatar ? (
                            <img src={displayAvatar} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-rose-500/50 drop-shadow-md" />
                        )}
                        <div className="absolute inset-0 bg-indigo-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
                            <Camera size={28} className="text-gold" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-medium tracking-wide text-slate-100 mb-3 filter drop-shadow-md">{form.name || "Kullanıcı ✨"}</h2>

                    {form.bio ? (
                        <p className="text-slate-300 text-sm max-w-[280px] leading-relaxed font-light">{form.bio}</p>
                    ) : (
                        <p className="text-slate-500 text-xs tracking-wide uppercase max-w-[280px]">Biyografi henüz eklenmedi 📝</p>
                    )}

                    {anniversaryDate && (
                        <LoveCounter startDate={anniversaryDate} />
                    )}
                </div>
            </section>

            {/* ── Temel Ayarlar ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <User size={16} className="text-gold" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Kişisel Bilgiler</h3>
                </div>

                <div className="glass-panel bg-white/5 rounded-[2.5rem] p-6 space-y-5">
                    <FloatingInput label="İsim Soyisim veya Hitap" name="name" value={form.name} onChange={handleChange} icon={<User size={18} />} />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-red-400 transition-colors duration-500">
                            <Heart size={18} />
                        </div>
                        <input
                            type="date"
                            name="anniversaryDate"
                            value={anniversaryDate}
                            onChange={(e) => setAnniversaryDate(e.target.value)}
                            className="peer w-full h-14 rounded-2xl glass-panel text-slate-200 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/30 focus:bg-white/10 transition-all outline-none pt-4 pb-1 pl-11 pr-4 font-light text-sm"
                        />
                        <label className="absolute text-[10px] tracking-wider text-slate-400 uppercase top-[14px] left-11">
                            Tanışma Günü 💖
                        </label>
                    </div>

                    <div className="relative">
                        <div className="absolute top-[14px] left-0 pl-4 text-slate-500">
                            <StickyNote size={18} />
                        </div>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Sizi anlatan güzel bir söz veya biyografi..."
                            className="w-full min-h-[100px] rounded-2xl glass-panel text-slate-200 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 focus:bg-white/10 transition-all outline-none p-4 pl-11 font-light text-sm leading-relaxed resize-y placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </section>

            {/* ── Tercihler ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <Settings size={16} className="text-gold" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Uygulama Görünümü</h3>
                </div>

                <div className="flex flex-col gap-3">
                    <Switch
                        label="Etkinlikleri Göster"
                        description="Ana sayfada yaklaşan buluşma ve etkinlikleri sergiler. 🥂"
                        icon={<Star size={20} />}
                        checked={preferences.showEvents ?? true}
                        onChange={() => setPreferences(prev => ({ ...prev, showEvents: !prev.showEvents }))}
                    />
                    <Switch
                        label="Anıları Göster"
                        description="Fotoğraf galerisi ve özel anılar sekmesini görünür yapar. 📸"
                        icon={<Camera size={20} />}
                        checked={preferences.showMemories ?? true}
                        onChange={() => setPreferences(prev => ({ ...prev, showMemories: !prev.showMemories }))}
                    />
                </div>
            </section>

            {/* ── DYNAMIC Ekstra Bilgiler ── */}
            <section className="space-y-4">
                <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center gap-2">
                        <Star size={16} className="text-gold" />
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">İlişki Detayları</h3>
                    </div>
                </div>

                <div className="glass-panel bg-white/5 rounded-[2.5rem] p-6 space-y-4">
                    {customDetails.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl opacity-70">
                            <h4 className="text-sm font-medium text-slate-300 mb-1 tracking-wide">Henüz özel detay eklenmedi ✨</h4>
                            <p className="text-xs text-slate-500 font-light max-w-[200px] mx-auto">İlk buluşma mekanınız, birbirinize taktığınız isimler gibi detaylar ekleyin.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {customDetails.map((detail) => (
                                <div key={detail.id} className="flex items-center gap-3 w-full group">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <FloatingInput
                                            label="Başlık (Örn: İlk Şarkımız 🎵)"
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

                    <div className="pt-2 flex justify-center w-full">
                        <Button
                            onClick={addCustomDetail}
                            className="bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-gold rounded-full px-6 transition-all duration-500 font-light flex items-center gap-2 text-sm h-12"
                        >
                            <PlusCircle size={16} /> Yeni Detay Ekle
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Floating Save Button ── */}
            <div className="relative w-full mt-8 mb-24 max-w-md mx-auto z-20 pointer-events-none">
                <Button
                    onClick={handleSave}
                    className="w-full h-16 rounded-full shadow-[0_10px_40px_rgba(244,63,94,0.15)] flex items-center justify-center gap-3 text-sm tracking-wide font-medium pointer-events-auto bg-slate-900 border border-rose-500/30 hover:border-rose-400/50 hover:bg-slate-950 text-slate-100 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 hover:text-gold"
                    disabled={saving}
                >
                    <Save size={20} className={saving ? 'animate-spin text-gold' : 'text-gold'} />
                    {saving ? "Değişiklikler Kaydediliyor ✨" : "Profili Güncelle 💖"}
                </Button>

                <Button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push('/login');
                    }}
                    className="w-full h-14 mt-4 rounded-full flex items-center justify-center gap-3 text-sm tracking-wide font-medium pointer-events-auto bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-all duration-500"
                >
                    <LogOut size={18} />
                    Çıkış Yap
                </Button>
            </div>
        </div>
    );
}
