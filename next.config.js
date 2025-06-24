/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove serverComponentsExternalPackages
  },
  serverExternalPackages: ['@supabase/ssr'], // Add this instead
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  }
}

module.exports = nextConfig