"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ClientOnly } from "@/components/ClientOnly";

// Routes that should NOT render the app chrome (header + bottom nav)
const AUTH_ROUTES = ["/login", "/register"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

    if (isAuthRoute) {
        // Full-screen, no chrome
        return <>{children}</>;
    }

    return (
        <AppShell>
            <ClientOnly>
                <Header />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20">
                    {children}
                </main>
                <BottomNav />
            </ClientOnly>
        </AppShell>
    );
}
