import { createMiddleware } from '@/lib/supabase/middleware'

export const middleware = createMiddleware

export const config = {
  matcher: [
    '/admin/:path*',
    '/assessment/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/results/:path*'
  ]
}