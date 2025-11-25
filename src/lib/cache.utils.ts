import { GLOBAL_CACHE_CONFIG } from './cache.config';

/**
 * Entrada de caché con TTL
 */
interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

/**
 * Estadísticas de caché
 */
export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
}

/**
 * Implementación de caché LRU (Least Recently Used) en memoria
 * con soporte para TTL (Time To Live)
 */
export class LRUCache<T = any> {
    private cache: Map<string, CacheEntry<T>>;
    private maxSize: number;
    private defaultTTL: number;
    private hits: number = 0;
    private misses: number = 0;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;

        // Iniciar limpieza automática
        this.startCleanup();
    }

    /**
     * Obtiene un valor de la caché
     */
    get(key: string): T | undefined {
        const entry = this.cache.get(key);

        if (!entry) {
            this.misses++;
            this.log('miss', key);
            return undefined;
        }

        // Verificar si expiró
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.misses++;
            this.log('expired', key);
            return undefined;
        }

        // Mover al final (más recientemente usado)
        this.cache.delete(key);
        this.cache.set(key, entry);

        this.hits++;
        this.log('hit', key);
        return entry.value;
    }

    /**
     * Establece un valor en la caché
     */
    set(key: string, value: T, ttl?: number): void {
        const expiresAt = Date.now() + (ttl ?? this.defaultTTL);

        // Si ya existe, eliminarlo primero
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        // Si alcanzamos el tamaño máximo, eliminar el menos recientemente usado
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
                this.log('evicted', firstKey);
            }
        }

        this.cache.set(key, { value, expiresAt });
        this.log('set', key);
    }

    /**
     * Elimina un valor de la caché
     */
    delete(key: string): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.log('delete', key);
        }
        return deleted;
    }

    /**
     * Limpia toda la caché
     */
    clear(): void {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
        this.log('clear', 'all');
    }

    /**
     * Verifica si una clave existe y no ha expirado
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Obtiene el tamaño actual de la caché
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Obtiene estadísticas de la caché
     */
    getStats(): CacheStats {
        const total = this.hits + this.misses;
        return {
            hits: this.hits,
            misses: this.misses,
            size: this.cache.size,
            hitRate: total > 0 ? this.hits / total : 0,
        };
    }

    /**
     * Resetea las estadísticas
     */
    resetStats(): void {
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Limpia entradas expiradas
     */
    private cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach((key) => {
            this.cache.delete(key);
            this.log('cleanup', key);
        });

        if (keysToDelete.length > 0) {
            this.log('cleanup', `Removed ${keysToDelete.length} expired entries`);
        }
    }

    /**
     * Inicia la limpieza automática
     */
    private startCleanup(): void {
        if (this.cleanupInterval) return;

        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, GLOBAL_CACHE_CONFIG.cleanupInterval);

        // Permitir que Node.js termine si este es el único timer activo
        if (this.cleanupInterval.unref) {
            this.cleanupInterval.unref();
        }
    }

    /**
     * Detiene la limpieza automática
     */
    stopCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    /**
     * Log de operaciones de caché
     */
    private log(operation: string, key: string): void {
        if (GLOBAL_CACHE_CONFIG.enableLogs) {
            console.log(`[Cache] ${operation}: ${key}`);
        }
    }

    /**
     * Destructor para limpiar recursos
     */
    destroy(): void {
        this.stopCleanup();
        this.clear();
    }
}

/**
 * Instancia global de caché para productos
 */
export const productCache = new LRUCache(200, 5 * 60 * 1000);

/**
 * Instancia global de caché para categorías
 */
export const categoryCache = new LRUCache(20, 10 * 60 * 1000);

/**
 * Instancia global de caché para carrito
 */
export const cartCache = new LRUCache(500, 60 * 1000);

/**
 * Utilidad para generar claves de caché consistentes
 */
export const cacheKeys = {
    product: {
        list: (filters?: Record<string, any>) =>
            `products:list:${JSON.stringify(filters || {})}`,
        byId: (id: string) => `products:id:${id}`,
        bySlug: (slug: string) => `products:slug:${slug}`,
        byCategory: (category: string, pagination?: Record<string, any>) =>
            `products:category:${category}:${JSON.stringify(pagination || {})}`,
        featured: (limit: number) => `products:featured:${limit}`,
    },
    cart: {
        stockValidation: (productId: string, quantity: number) =>
            `cart:stock:${productId}:${quantity}`,
        totals: (items: any[]) => `cart:totals:${JSON.stringify(items)}`,
    },
    category: {
        list: () => 'categories:list',
        count: (category: string) => `categories:count:${category}`,
    },
};
