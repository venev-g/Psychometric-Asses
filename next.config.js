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
  }
  // Removed redirects to allow homepage to display
}

module.exports = nextConfig