import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LRUCache, cacheKeys } from './cache.utils';

describe('LRUCache', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
        cache = new LRUCache<string>(3, 1000); // max 3 items, 1 second TTL
    });

    afterEach(() => {
        cache.destroy();
    });

    describe('Basic Operations', () => {
        it('should set and get values', () => {
            cache.set('key1', 'value1');
            expect(cache.get('key1')).toBe('value1');
        });

        it('should return undefined for non-existent keys', () => {
            expect(cache.get('nonexistent')).toBeUndefined();
        });

        it('should delete values', () => {
            cache.set('key1', 'value1');
            expect(cache.delete('key1')).toBe(true);
            expect(cache.get('key1')).toBeUndefined();
        });

        it('should check if key exists', () => {
            cache.set('key1', 'value1');
            expect(cache.has('key1')).toBe(true);
            expect(cache.has('key2')).toBe(false);
        });

        it('should clear all values', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.clear();
            expect(cache.size()).toBe(0);
        });
    });

    describe('LRU Eviction', () => {
        it('should evict least recently used item when max size is reached', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            cache.set('key4', 'value4'); // Should evict key1

            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBe('value2');
            expect(cache.get('key3')).toBe('value3');
            expect(cache.get('key4')).toBe('value4');
        });

        it('should update LRU order on get', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            // Access key1 to make it most recently used
            cache.get('key1');

            // Add key4, should evict key2 (least recently used)
            cache.set('key4', 'value4');

            expect(cache.get('key1')).toBe('value1');
            expect(cache.get('key2')).toBeUndefined();
            expect(cache.get('key3')).toBe('value3');
            expect(cache.get('key4')).toBe('value4');
        });
    });

    describe('TTL Expiration', () => {
        it('should expire entries after TTL', async () => {
            cache.set('key1', 'value1', 100); // 100ms TTL

            expect(cache.get('key1')).toBe('value1');

            // Wait for expiration
            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(cache.get('key1')).toBeUndefined();
        });

        it('should use custom TTL over default', async () => {
            cache.set('key1', 'value1', 100); // Custom 100ms TTL
            cache.set('key2', 'value2'); // Default 1000ms TTL

            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBe('value2');
        });

        it('should not return expired entries with has()', async () => {
            cache.set('key1', 'value1', 100);

            expect(cache.has('key1')).toBe(true);

            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(cache.has('key1')).toBe(false);
        });
    });

    describe('Statistics', () => {
        it('should track hits and misses', () => {
            cache.set('key1', 'value1');

            cache.get('key1'); // hit
            cache.get('key2'); // miss
            cache.get('key1'); // hit

            const stats = cache.getStats();
            expect(stats.hits).toBe(2);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBeCloseTo(0.666, 2);
        });

        it('should track cache size', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            const stats = cache.getStats();
            expect(stats.size).toBe(2);
        });

        it('should reset statistics', () => {
            cache.set('key1', 'value1');
            cache.get('key1');
            cache.get('key2');

            cache.resetStats();

            const stats = cache.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
        });
    });

    describe('Size Management', () => {
        it('should report correct size', () => {
            expect(cache.size()).toBe(0);

            cache.set('key1', 'value1');
            expect(cache.size()).toBe(1);

            cache.set('key2', 'value2');
            expect(cache.size()).toBe(2);

            cache.delete('key1');
            expect(cache.size()).toBe(1);
        });

        it('should not exceed max size', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            cache.set('key4', 'value4');
            cache.set('key5', 'value5');

            expect(cache.size()).toBe(3); // Max size
        });
    });
});

describe('cacheKeys', () => {
    it('should generate consistent product keys', () => {
        const key1 = cacheKeys.product.byId('123');
        const key2 = cacheKeys.product.byId('123');
        expect(key1).toBe(key2);
        expect(key1).toBe('products:id:123');
    });

    it('should generate keys with filters', () => {
        const filters = { category: 'GPU', minPrice: 100 };
        const key = cacheKeys.product.list(filters);
        expect(key).toContain('products:list');
        expect(key).toContain('GPU');
    });

    it('should generate different keys for different filters', () => {
        const key1 = cacheKeys.product.list({ category: 'GPU' });
        const key2 = cacheKeys.product.list({ category: 'CPU' });
        expect(key1).not.toBe(key2);
    });

    it('should generate cart keys', () => {
        const key = cacheKeys.cart.stockValidation('prod-123', 5);
        expect(key).toBe('cart:stock:prod-123:5');
    });

    it('should generate category keys', () => {
        const key = cacheKeys.category.list();
        expect(key).toBe('categories:list');
    });
});
