/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'olscqocjamidtmpzxrxu.supabase.co', // dominio Supabase para Storage público
    ],
  },
}

module.exports = nextConfig
