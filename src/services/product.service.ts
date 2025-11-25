import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { productRepository } from '@/repositories/product.repository';
import type {
    Product,
    ProductListItem,
    ProductCreateInput,
    ProductUpdateInput,
    ProductFilters,
    PaginationOptions,
} from '@/types/product.types';

/**
 * Servicio de productos - Lógica de negocio con caché
 */
export class ProductService {
    /**
     * Obtiene productos con filtros y paginación (con caché)
     */
    getProducts = unstable_cache(
        async (filters: ProductFilters = {}, pagination: PaginationOptions = {}) => {
            return productRepository.findAll(filters, pagination);
        },
        ['products-list'],
        {
            revalidate: 60, // 60 segundos
            tags: ['products'],
        }
    );

    /**
     * Obtiene un producto por ID (con caché de request)
     */
    getProductById = cache(async (id: string): Promise<Product> => {
        return productRepository.findById(id);
    });

    /**
     * Obtiene un producto por slug (con caché persistente)
     */
    getProductBySlug = unstable_cache(
        async (slug: string): Promise<Product> => {
            return productRepository.findBySlug(slug);
        },
        ['product-by-slug'],
        {
            revalidate: 300, // 5 minutos
            tags: ['products'],
        }
    );

    /**
     * Obtiene productos por categoría (con caché)
     */
    getProductsByCategory = unstable_cache(
        async (category: string, pagination: PaginationOptions = {}) => {
            return productRepository.findByCategory(category, pagination);
        },
        ['products-by-category'],
        {
            revalidate: 60,
            tags: ['products'],
        }
    );

    /**
     * Obtiene productos destacados (con caché)
     */
    getFeaturedProducts = unstable_cache(
        async (limit: number = 6): Promise<Product[]> => {
            return productRepository.findFeatured(limit);
        },
        ['featured-products'],
        {
            revalidate: 600, // 10 minutos
            tags: ['products', 'featured'],
        }
    );

    /**
     * Busca productos (con caché corto)
     */
    searchProducts = unstable_cache(
        async (query: string, pagination: PaginationOptions = {}) => {
            return productRepository.findAll({ search: query }, pagination);
        },
        ['products-search'],
        {
            revalidate: 30, // 30 segundos
            tags: ['products'],
        }
    );

    /**
     * Crea un nuevo producto
     * Invalida caché automáticamente
     */
    async createProduct(data: ProductCreateInput): Promise<Product> {
        // Verificar si el slug ya existe
        const slugExists = await productRepository.slugExists(data.slug);
        if (slugExists) {
            throw new Error('El slug ya está en uso');
        }

        const product = await productRepository.create(data);

        // Invalidar caché
        this.invalidateCache();

        return product;
    }

    /**
     * Actualiza un producto existente
     * Invalida caché automáticamente
     */
    async updateProduct(id: string, data: ProductUpdateInput): Promise<Product> {
        // Si se actualiza el slug, verificar que no exista
        if (data.slug) {
            const slugExists = await productRepository.slugExists(data.slug, id);
            if (slugExists) {
                throw new Error('El slug ya está en uso');
            }
        }

        const product = await productRepository.update(id, data);

        // Invalidar caché
        this.invalidateCache();

        return product;
    }

    /**
     * Elimina un producto
     * Invalida caché automáticamente
     */
    async deleteProduct(id: string): Promise<void> {
        await productRepository.delete(id);

        // Invalidar caché
        this.invalidateCache();
    }

    /**
     * Actualiza el stock de un producto
     */
    async updateStock(id: string, quantity: number): Promise<Product> {
        const product = await productRepository.updateStock(id, quantity);

        // Invalidar caché
        this.invalidateCache();

        return product;
    }

    /**
     * Obtiene el conteo de productos
     */
    async getProductCount(filters: ProductFilters = {}): Promise<number> {
        return productRepository.count(filters);
    }

    /**
     * Convierte Product a ProductListItem (versión simplificada)
     */
    toListItem(product: Product): ProductListItem {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            featured: product.featured,
            slug: product.slug,
            brand: product.brand,
        };
    }

    /**
     * Invalida todo el caché de productos
     */
    private invalidateCache(): void {
        const { revalidateTag } = require('next/cache');
        revalidateTag('products');
    }
}

// Exportar instancia singleton
export const productService = new ProductService();
