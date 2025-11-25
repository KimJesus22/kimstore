/**
 * Utilidades para manejo de URLs de CDN
 */

/**
 * Obtiene la URL base del CDN desde variables de entorno
 */
export function getCDNUrl(): string {
    return process.env.NEXT_PUBLIC_CDN_URL || process.env.CDN_URL || '';
}

/**
 * Genera una URL completa para un asset estático
 * @param path - Ruta del asset (ej: '/images/logo.png')
 * @returns URL completa con prefijo de CDN si está configurado
 */
export function getAssetUrl(path: string): string {
    const cdnUrl = getCDNUrl();

    // Asegurar que el path comience con /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Si hay CDN configurado, usarlo
    if (cdnUrl) {
        return `${cdnUrl}${normalizedPath}`;
    }

    // Si no, usar ruta relativa
    return normalizedPath;
}

/**
 * Genera una URL optimizada para imágenes
 * @param src - URL de la imagen
 * @param width - Ancho deseado (opcional)
 * @param quality - Calidad de la imagen 1-100 (opcional, default: 75)
 * @returns URL optimizada
 */
export function getOptimizedImageUrl(
    src: string,
    width?: number,
    quality: number = 75
): string {
    // Si es una URL externa, devolverla tal cual
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // Si es una ruta local, aplicar CDN si está configurado
    return getAssetUrl(src);
}

/**
 * Verifica si el CDN está habilitado
 */
export function isCDNEnabled(): boolean {
    return !!getCDNUrl();
}

/**
 * Obtiene información sobre la configuración del CDN
 */
export function getCDNInfo() {
    const cdnUrl = getCDNUrl();

    return {
        enabled: !!cdnUrl,
        url: cdnUrl,
        provider: cdnUrl ? detectCDNProvider(cdnUrl) : 'none',
    };
}

/**
 * Detecta el proveedor de CDN basado en la URL
 */
function detectCDNProvider(url: string): string {
    if (url.includes('vercel')) return 'Vercel Edge Network';
    if (url.includes('cloudflare')) return 'Cloudflare';
    if (url.includes('cloudfront')) return 'AWS CloudFront';
    if (url.includes('fastly')) return 'Fastly';
    if (url.includes('akamai')) return 'Akamai';
    return 'Custom CDN';
}

/**
 * Precarga un asset crítico
 * Útil para recursos que se necesitan inmediatamente
 */
export function preloadAsset(path: string, as: 'image' | 'script' | 'style' | 'font') {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = getAssetUrl(path);

    if (as === 'font') {
        link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
}

/**
 * Establece DNS prefetch para el CDN
 * Mejora la velocidad de carga al resolver DNS anticipadamente
 */
export function setupCDNPrefetch() {
    if (typeof window === 'undefined') return;

    const cdnUrl = getCDNUrl();
    if (!cdnUrl) return;

    try {
        const url = new URL(cdnUrl);
        const hostname = url.hostname;

        // DNS Prefetch
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = `//${hostname}`;
        document.head.appendChild(dnsPrefetch);

        // Preconnect
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = cdnUrl;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
    } catch (error) {
        console.error('Error setting up CDN prefetch:', error);
    }
}
