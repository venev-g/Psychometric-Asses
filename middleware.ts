import { middleware } from '@/lib/supabase/middleware'

export { middleware }

export const config = {
  matcher: [
    '/admin/:path*',
    '/assessment/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/results/:path*'
  ]
}