// src/lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from '@/types/database.types'

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return { supabase, supabaseResponse }
};

export async function middleware(req: NextRequest) {
  const { supabase, supabaseResponse } = createClient(req)
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Protect assessment routes
  if (req.nextUrl.pathname.startsWith('/assessment') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/assessment/:path*', '/dashboard/:path*']
}