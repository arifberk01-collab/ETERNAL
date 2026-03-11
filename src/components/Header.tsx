"use client";

import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const getTitle = () => {
        switch (pathname) {
            case '/': return 'Eternal';
            case '/etkinlikler': return 'Etkinlikler';
            case '/anilar': return 'Anılar';
            case '/profil': return 'Profil';
            case '/ayarlar': return 'Ayarlar';
            case '/partner': return 'Partner';
            default: return 'Eternal';
        }
    };

    return (
        <header className="h-16 flex items-center justify-center border-b border-white/10 shrink-0 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
            <h1 className="text-xl tracking-[0.2em] text-slate-100 font-playfair uppercase">
                {getTitle()}
            </h1>
        </header>
    );
}
