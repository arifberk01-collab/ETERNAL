"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Image as ImageIcon, User, Settings, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', icon: Home, label: 'Ana Sayfa' },
    { href: '/partner', icon: Heart, label: 'Partner' },
    { href: '/etkinlikler', icon: Calendar, label: 'Etkinlikler' },
    { href: '/anilar', icon: ImageIcon, label: 'Anılar' },
    { href: '/profil', icon: User, label: 'Profil' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="h-20 border-t border-white/10 shrink-0 sticky bottom-0 bg-slate-950/80 backdrop-blur-md z-40 pb-4 shadow-lg">
            <ul className="flex justify-around items-center h-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <li key={item.href} className="flex-1 flex justify-center">
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-500",
                                    isActive ? "text-[#f1d7b3] drop-shadow-[0_0_12px_rgba(241,215,179,0.7)] scale-110 -translate-y-1" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                )}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
