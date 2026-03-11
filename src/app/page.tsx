"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { daysBetween, daysUntil } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AppConfig, AppEvent } from "@/lib/types";
import { Calendar, ArrowRight, Image as ImageIcon, Heart, Sparkles, Plus } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Live Love Counter Component ───────────────────────────────────────────────
function LoveCounter({ startDate }: { startDate: string }) {
  const [time, setTime] = useState<{ years: number; months: number; days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    if (!startDate) return;

    const calculateTime = () => {
      // Safe parsing
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
      <div className="flex justify-center gap-2 sm:gap-4 mt-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-3 min-w-[70px] h-[72px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4 mt-6">
      {[
        { label: 'Yıl', value: time.years },
        { label: 'Ay', value: time.months },
        { label: 'Gün', value: time.days },
        { label: 'Saat', value: time.hours },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center glass-panel rounded-2xl p-3 min-w-[70px] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-rose-500/20">
          <span className="text-2xl font-light text-slate-100">{item.value}</span>
          <span className="text-[10px] uppercase tracking-widest text-gold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loaders ────────────────────────────────────────────────────────
function MainSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-64 rounded-3xl bg-white/5 border border-white/10" />
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="h-6 w-32 rounded-full bg-white/10" />
        <div className="h-4 w-16 rounded-full bg-white/10" />
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const [configRes, eventsRes] = await Promise.all([
          supabase.from('config').select('*').eq('id', session.user.id).maybeSingle(),
          supabase.from('events').select('*').eq('user_id', session.user.id)
        ]);

        if (configRes.data) setConfig(configRes.data);
        if (eventsRes.data) setEvents(eventsRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!isMounted || loading) return <MainSkeleton />;

  const safeEvents = events || [];
  const upcomingEvents = (safeEvents || [])
    .filter(e => e && e?.dateISO)
    .map(e => ({ ...e, daysLeft: daysUntil(e?.dateISO) }))
    .filter(e => typeof e?.daysLeft === 'number' && e.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pb-24 text-slate-200 font-light">

      {/* ── Hero Section (Glassmorphism) ── */}
      <section>
        <div className="relative overflow-hidden rounded-[2.5rem] glass-panel p-8">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-full mb-6 border border-white/10 shadow-inner group transition-all duration-500 ease-in-out hover:shadow-rose-500/20">
              <Heart size={32} className="text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] group-hover:scale-110 transition-transform duration-500" />
            </div>

            {config?.relationshipStartDate ? (
              <>
                <p className="text-slate-400 font-medium mb-2 text-xs uppercase tracking-widest">Birlikte Geçen Zaman</p>
                <LoveCounter startDate={config.relationshipStartDate} />
              </>
            ) : (
              <div className="py-6 flex flex-col items-center">
                <Sparkles size={40} className="text-gold mb-3 opacity-80" />
                <h2 className="text-2xl font-light text-slate-100 mb-2 font-playfair tracking-wide uppercase">Başlangıç Tarihini Gir!</h2>
                <p className="text-slate-400 text-sm mb-6 font-light">Profil sayfasından tanışma gününüzü ayarlayın.</p>
                <Button onClick={() => router.push('/profil')} className="bg-gold border-none hover:bg-rose-400 rounded-full px-6 font-medium text-white transition-all duration-500">
                  Profili Düzenle
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="px-1">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-medium tracking-wide text-slate-100 font-playfair uppercase">Yaklaşan Günler</h3>
          <Link href="/etkinlikler" className="text-xs text-gold font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:border-rose-500/30">
            Tümü <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <Card
                key={event.id}
                className="group relative overflow-hidden flex items-center justify-between p-5 hover:scale-[1.02] hover:shadow-rose-500/10 transition-all duration-500 cursor-pointer glass-panel bg-white/5"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-rose-500 transition-colors duration-500" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-all duration-500 border border-white/10">
                    <Calendar size={20} className="font-light" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100 mb-0.5 tracking-wide">{event.title}</h4>
                    <p className="text-xs text-slate-400 font-light">
                      {event?.dateISO ? new Date(event.dateISO).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`text-xl font-light ${event.daysLeft === 0 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse' : 'text-slate-100'}`}>
                    {event.daysLeft === 0 ? "Bugün!" : event.daysLeft}
                  </div>
                  {event.daysLeft !== 0 && <div className="text-[10px] tracking-widest font-medium text-slate-500 uppercase">gün kaldı</div>}
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center glass-panel rounded-[2rem] border-dashed border-white/20">
              <div className="flex gap-2 mb-4 opacity-50">
                <Calendar size={32} className="text-slate-400" />
                <Sparkles size={32} className="text-gold" />
              </div>
              <h4 className="font-medium text-slate-200 mb-2 tracking-wide font-playfair uppercase">İlk etkinliğinizi planlayın</h4>
              <p className="text-xs font-light text-slate-400 max-w-[250px] leading-relaxed">Yaklaşan bir etkinlik bulunmuyor. Yeni bir tarih ekleyerek geri sayımı başlatın.</p>
            </div>
          )}
        </div>
      </section>

      <FloatingActionButton onClick={() => setIsAddOpen(true)} />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Seçimini Yap">
        <div className="flex flex-col gap-3 p-2">
          <button
            onClick={() => { setIsAddOpen(false); router.push('/etkinlikler'); }}
            className="flex items-center gap-4 p-4 rounded-2xl glass-panel bg-white/5 hover:bg-white/10 hover:border-rose-500/30 transition-all duration-500 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 text-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
              <Calendar size={22} className="font-light" />
            </div>
            <div>
              <div className="font-medium tracking-wide text-slate-100 font-playfair uppercase">Yeni Etkinlik</div>
              <div className="text-xs font-light text-slate-400 mt-0.5">Gelecek bir tarih için geri sayım</div>
            </div>
          </button>

          <button
            onClick={() => { setIsAddOpen(false); router.push('/anilar'); }}
            className="flex items-center gap-4 p-4 rounded-2xl glass-panel bg-white/5 hover:bg-white/10 hover:border-rose-500/30 transition-all duration-500 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 text-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
              <ImageIcon size={22} className="font-light" />
            </div>
            <div>
              <div className="font-medium tracking-wide text-slate-100 font-playfair uppercase">Fotoğraflı Anı</div>
              <div className="text-xs font-light text-slate-400 mt-0.5">Birlikte geçirdiğiniz bir anı ölümsüzleştirin</div>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
