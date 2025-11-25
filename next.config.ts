import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuración de tamaños de dispositivos para imágenes responsivas
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Tamaños de imagen personalizados
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Formatos de imagen optimizados (WebP y AVIF)
    formats: ['image/webp', 'image/avif'],
    
    // Calidad de compresión (75 es un buen balance entre calidad y tamaño)
    minimumCacheTTL: 60,
    
    // Dominios permitidos para imágenes externas (añadir según necesidad)
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
};

export default nextConfig;
