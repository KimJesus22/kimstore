/**
 * Configuración de caché para la aplicación
 */

export const CACHE_CONFIG = {
    // Productos
    products: {
        list: {
            memoryTTL: 2 * 60 * 1000, // 2 minutos
            nextTTL: 5 * 60, // 5 minutos
            maxSize: 100,
        },
        featured: {
            memoryTTL: 5 * 60 * 1000, // 5 minutos
            nextTTL: 10 * 60, // 10 minutos
            maxSize: 10,
        },
        byId: {
            memoryTTL: 5 * 60 * 1000, // 5 minutos
            nextTTL: 10 * 60, // 10 minutos
            maxSize: 200,
        },
        byCategory: {
            memoryTTL: 3 * 60 * 1000, // 3 minutos
            nextTTL: 5 * 60, // 5 minutos
            maxSize: 50,
        },
    },

    // Carrito
    cart: {
        stockValidation: {
            memoryTTL: 30 * 1000, // 30 segundos
            maxSize: 500,
        },
        totals: {
            memoryTTL: 60 * 1000, // 1 minuto
            maxSize: 200,
        },
    },

    // Categorías
    categories: {
        list: {
            memoryTTL: 10 * 60 * 1000, // 10 minutos
            nextTTL: 30 * 60, // 30 minutos
            maxSize: 20,
        },
    },
} as const;

/**
 * Configuración global de caché
 */
export const GLOBAL_CACHE_CONFIG = {
    // Habilitar caché en desarrollo
    enableInDev: true,

    // Habilitar caché en producción
    enableInProd: true,

    // Tamaño máximo global de caché en memoria (número de entradas)
    maxGlobalSize: 1000,

    // Intervalo de limpieza de entradas expiradas (ms)
    cleanupInterval: 60 * 1000, // 1 minuto

    // Habilitar logs de caché
    enableLogs: process.env.NODE_ENV === 'development',
} as const;

/**
 * Verifica si el caché está habilitado
 */
export function isCacheEnabled(): boolean {
    const isDev = process.env.NODE_ENV === 'development';
    return isDev ? GLOBAL_CACHE_CONFIG.enableInDev : GLOBAL_CACHE_CONFIG.enableInProd;
}
