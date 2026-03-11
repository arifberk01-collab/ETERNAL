import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center min-h-screen" style={{ background: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 80%) #020617' }}>
            <div className="w-full max-w-[420px] min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
}
