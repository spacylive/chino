/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// Polyfill para navegadores legacy
if (typeof require !== 'undefined') {
  require('./polyfills.js');
}

export default nextConfig
