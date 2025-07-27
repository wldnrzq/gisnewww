/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],
  },
  // output: 'export', // Tetap dikomentari karena tidak digunakan
  eslint: {
    ignoreDuringBuilds: true, // Nonaktifkan ESLint saat build
  },
};

module.exports = nextConfig;