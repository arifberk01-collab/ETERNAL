import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware — scaffolded for Supabase Auth.
 *
 * Currently a pass-through. To enable auth-gating, uncomment the Supabase
 * session check below and import the Supabase server client.
 *
 * Example (when ready):
 *   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
 *   const supabase = createMiddlewareClient({ req, res });
 *   const { data: { session } } = await supabase.auth.getSession();
 *   if (!session) return NextResponse.redirect(new URL('/login', req.url));
 */
export function middleware(_req: NextRequest) {
    // Pass-through: no redirect until Supabase Auth is wired up
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes EXCEPT:
         * - /login and /register (public auth pages)
         * - /_next/static, /_next/image (Next.js internals)
         * - /favicon.ico, /noise.png (public assets)
         * - /api routes
         */
        "/((?!login|register|api|_next/static|_next/image|favicon.ico|noise.png).*)",
    ],
};
