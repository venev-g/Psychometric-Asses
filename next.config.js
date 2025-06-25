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
  // Add allowedDevOrigins configuration to fix cross-origin warnings
  allowedDevOrigins: ['127.0.0.1', 'localhost']
  // Removed redirects to allow homepage to display
}

module.exports = nextConfig