// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Add explicit cookie options for better cross-browser compatibility
              // Type-safe cookie options
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'lax', // Allow cookies in same-site context
                secure: process.env.NODE_ENV === 'production', // Secure in production
                httpOnly: true, // Not accessible via JavaScript
                path: '/', // Available across all paths
              })
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}