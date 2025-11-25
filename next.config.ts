import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CDN Configuration - usar variable de entorno para CDN personalizado
  assetPrefix: process.env.CDN_URL || '',

  images: {
    // Configuración de tamaños de dispositivos para imágenes responsivas
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Tamaños de imagen personalizados
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Formatos de imagen optimizados (AVIF primero para mejor compresión)
    formats: ['image/avif', 'image/webp'],

    // Calidad de compresión (75 es un buen balance entre calidad y tamaño)
    minimumCacheTTL: 60,

    // Dominios permitidos para imágenes externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      },
    ],
  },

  // Headers de seguridad y caché optimizados
  async headers() {
    return [
      // Headers para assets estáticos (imágenes, fuentes, etc.)
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers para archivos JS/CSS con hash (generados por Next.js)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers de seguridad para todas las páginas
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Compresión de assets
  compress: true,

  // Configuración de output para mejor performance
  output: 'standalone',
};

export default nextConfig;
