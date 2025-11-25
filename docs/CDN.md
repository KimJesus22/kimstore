# Configuración de CDN

Esta guía explica cómo configurar y usar un CDN (Content Delivery Network) para optimizar la entrega de assets estáticos en KimStore.

## ¿Qué es un CDN?

Un CDN es una red de servidores distribuidos globalmente que almacenan copias de tus assets estáticos (imágenes, CSS, JavaScript) y los sirven desde la ubicación más cercana al usuario, mejorando significativamente el rendimiento.

## Opciones de CDN

### 1. Vercel Edge Network (Recomendado)

**Si deployeas en Vercel:**
- ✅ CDN automático incluido
- ✅ Sin configuración adicional necesaria
- ✅ Optimización de imágenes automática
- ✅ 100+ ubicaciones globales
- ✅ Gratis en plan hobby

**No requiere configuración adicional** - Vercel maneja todo automáticamente.

### 2. Cloudflare CDN

**Para deployment self-hosted:**

1. **Configurar DNS:**
   ```
   CNAME cdn.kimstore.com -> tu-servidor.com
   ```

2. **Configurar variables de entorno:**
   ```env
   CDN_URL=https://cdn.kimstore.com
   NEXT_PUBLIC_CDN_URL=https://cdn.kimstore.com
   ```

3. **Configurar reglas de caché en Cloudflare:**
   - Page Rules → Cache Everything
   - Edge Cache TTL: 1 year
   - Browser Cache TTL: 1 year

### 3. AWS CloudFront

**Para deployment en AWS:**

1. **Crear distribución de CloudFront:**
   ```bash
   Origin Domain: tu-servidor.com
   Origin Protocol Policy: HTTPS Only
   Viewer Protocol Policy: Redirect HTTP to HTTPS
   Cache Policy: CachingOptimized
   ```

2. **Configurar variables de entorno:**
   ```env
   CDN_URL=https://d111111abcdef8.cloudfront.net
   NEXT_PUBLIC_CDN_URL=https://d111111abcdef8.cloudfront.net
   ```

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` con:

```env
# CDN Configuration
CDN_URL=https://cdn.kimstore.com
NEXT_PUBLIC_CDN_URL=https://cdn.kimstore.com
```

**Notas:**
- `CDN_URL`: Usado en servidor para generar URLs
- `NEXT_PUBLIC_CDN_URL`: Usado en cliente (navegador)
- Si no se configuran, los assets se sirven localmente

### Next.js Configuration

La configuración ya está lista en `next.config.ts`:

```typescript
const nextConfig = {
  // CDN para assets estáticos
  assetPrefix: process.env.CDN_URL || '',
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Headers de caché optimizados
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Uso en el Código

### Utilidades de CDN

```typescript
import { getAssetUrl, getOptimizedImageUrl, getCDNInfo } from '@/lib/cdn.utils';

// Obtener URL de asset
const logoUrl = getAssetUrl('/images/logo.png');
// Resultado: https://cdn.kimstore.com/images/logo.png (si CDN está configurado)
// Resultado: /images/logo.png (si no hay CDN)

// Obtener URL de imagen optimizada
const imageUrl = getOptimizedImageUrl('/products/gpu.jpg', 800, 80);

// Verificar si CDN está habilitado
const cdnInfo = getCDNInfo();
console.log(cdnInfo);
// { enabled: true, url: 'https://cdn.kimstore.com', provider: 'Cloudflare' }
```

### Componente Image de Next.js

El componente `Image` de Next.js automáticamente usa el CDN configurado:

```tsx
import Image from 'next/image';

<Image
  src="/products/gpu.jpg"
  alt="GPU"
  width={800}
  height={600}
  priority
/>
```

## Headers de Caché

### Assets Estáticos (Imágenes, Fuentes)

```
Cache-Control: public, max-age=31536000, immutable
```

- **public**: Puede ser cacheado por navegadores y CDN
- **max-age=31536000**: Cachear por 1 año
- **immutable**: El archivo nunca cambiará

### Archivos JS/CSS (con hash)

```
Cache-Control: public, max-age=31536000, immutable
```

Next.js agrega hash a los archivos, por lo que son inmutables.

### HTML (Páginas)

```
Cache-Control: max-age=0, must-revalidate
```

Las páginas se revalidan en cada request (compatible con ISR).

## Headers de Seguridad

Configurados automáticamente para todas las páginas:

```
X-DNS-Prefetch-Control: on
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin
```

## Optimización de Imágenes

### Formatos Soportados

1. **AVIF** (prioridad 1)
   - Mejor compresión (~50% más pequeño que JPEG)
   - Soporte moderno en navegadores

2. **WebP** (fallback)
   - Buena compresión (~30% más pequeño que JPEG)
   - Amplio soporte en navegadores

3. **JPEG/PNG** (fallback final)
   - Para navegadores antiguos

### Tamaños Responsive

Configurados para diferentes dispositivos:

```typescript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
```

Next.js automáticamente sirve el tamaño óptimo según el dispositivo.

## Verificación

### 1. Build de Producción

```bash
npm run build
```

Verifica que no haya errores relacionados con assets.

### 2. Verificar URLs en HTML

Inspecciona el HTML generado:

```html
<!-- Sin CDN -->
<script src="/_next/static/chunks/main.js"></script>

<!-- Con CDN -->
<script src="https://cdn.kimstore.com/_next/static/chunks/main.js"></script>
```

### 3. Verificar Headers

```bash
curl -I https://kimstore.com/_next/static/chunks/main.js
```

Deberías ver:
```
Cache-Control: public, max-age=31536000, immutable
```

### 4. Verificar Imágenes

```bash
curl -I https://kimstore.com/_next/image?url=/products/gpu.jpg&w=800&q=75
```

## Métricas de Rendimiento

### Antes del CDN

- **TTFB (assets)**: 200-500ms
- **Download time**: Variable según ubicación
- **Cache hit rate**: 0%

### Después del CDN

- **TTFB (assets)**: <50ms
- **Download time**: Consistente globalmente
- **Cache hit rate**: >90%

### Herramientas de Medición

- **Lighthouse**: Auditoría de rendimiento
- **WebPageTest**: Testing desde múltiples ubicaciones
- **GTmetrix**: Análisis de velocidad

## Troubleshooting

### Assets no se cargan desde CDN

**Problema:** Los assets se siguen sirviendo desde el servidor origin.

**Solución:**
1. Verificar que `CDN_URL` esté configurado en `.env.local`
2. Reiniciar el servidor de desarrollo
3. Hacer un nuevo build: `npm run build`

### Imágenes no se optimizan

**Problema:** Las imágenes se sirven en formato original.

**Solución:**
1. Usar el componente `Image` de Next.js
2. Verificar que el dominio esté en `remotePatterns`
3. Verificar que el navegador soporte AVIF/WebP

### Headers de caché no se aplican

**Problema:** Los headers `Cache-Control` no aparecen.

**Solución:**
1. Verificar configuración en `next.config.ts`
2. En desarrollo, los headers pueden no aplicarse (solo en producción)
3. Verificar que el CDN no esté sobrescribiendo headers

## Mejores Prácticas

### 1. Usar Next.js Image

```tsx
// ✅ Correcto
<Image src="/logo.png" alt="Logo" width={200} height={50} />

// ❌ Incorrecto
<img src="/logo.png" alt="Logo" />
```

### 2. Preload Assets Críticos

```tsx
import { preloadAsset } from '@/lib/cdn.utils';

// En componente o useEffect
preloadAsset('/fonts/inter.woff2', 'font');
```

### 3. DNS Prefetch

```tsx
import { setupCDNPrefetch } from '@/lib/cdn.utils';

// En layout raíz
useEffect(() => {
  setupCDNPrefetch();
}, []);
```

### 4. Lazy Loading

```tsx
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  loading="lazy" // Carga diferida
/>
```

## Costos

### Vercel

- **Hobby**: Gratis (100GB bandwidth/mes)
- **Pro**: $20/mes (1TB bandwidth/mes)

### Cloudflare

- **Free**: Gratis (bandwidth ilimitado)
- **Pro**: $20/mes (características adicionales)

### AWS CloudFront

- **Pay-as-you-go**: ~$0.085/GB (primeros 10TB)
- **Free tier**: 1TB/mes por 12 meses

## Recursos Adicionales

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Cloudflare CDN](https://www.cloudflare.com/cdn/)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)

---

**Última actualización:** Noviembre 2025
