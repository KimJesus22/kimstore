import prisma from '@/lib/prisma';
import type {
    Product,
    ProductCreateInput,
    ProductUpdateInput,
    ProductFilters,
    PaginationOptions,
} from '@/types/product.types';
import { NotFoundError } from '@/lib/api-error';

/**
 * Repositorio de productos - Capa de acceso a datos con Prisma
 */
export class ProductRepository {
    /**
     * Obtiene todos los productos con filtros y paginación
     */
    async findAll(
        filters: ProductFilters = {},
        pagination: PaginationOptions = { page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' }
    ) {
        const {
            category,
            featured,
            minPrice,
            maxPrice,
            inStock,
            search,
            brand,
        } = filters;

        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const skip = (page - 1) * limit;

        // Construir filtros dinámicamente
        const where: any = {};

        if (category) where.category = category;
        if (featured !== undefined) where.featured = featured;
        if (brand) where.brand = { contains: brand, mode: 'insensitive' };
        if (inStock) where.stock = { gt: 0 };

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Ejecutar queries en paralelo
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.product.count({ where }),
        ]);

        return {
            products,
            total,
            page,
            limit,
        };
    }

    /**
     * Obtiene un producto por ID
     */
    async findById(id: string): Promise<Product> {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundError('Producto');
        }

        return product as Product;
    }

    /**
     * Obtiene un producto por slug
     */
    async findBySlug(slug: string): Promise<Product> {
        const product = await prisma.product.findUnique({
            where: { slug },
        });

        if (!product) {
            throw new NotFoundError('Producto');
        }

        return product as Product;
    }

    /**
     * Obtiene productos por categoría
     */
    async findByCategory(
        category: string,
        pagination: PaginationOptions = { page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' }
    ) {
        return this.findAll({ category: category as any }, pagination);
    }

    /**
     * Obtiene productos destacados
     */
    async findFeatured(limit: number = 6) {
        const products = await prisma.product.findMany({
            where: { featured: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return products as Product[];
    }

    /**
     * Crea un nuevo producto
     */
    async create(data: ProductCreateInput): Promise<Product> {
        const product = await prisma.product.create({
            data: {
                ...data,
                specs: data.specs as any, // Prisma maneja JSON
            },
        });

        return product as Product;
    }

    /**
     * Actualiza un producto existente
     */
    async update(id: string, data: ProductUpdateInput): Promise<Product> {
        try {
            const product = await prisma.product.update({
                where: { id },
                data: {
                    ...data,
                    specs: data.specs as any,
                },
            });

            return product as Product;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Producto');
            }
            throw error;
        }
    }

    /**
     * Elimina un producto
     */
    async delete(id: string): Promise<void> {
        try {
            await prisma.product.delete({
                where: { id },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Producto');
            }
            throw error;
        }
    }

    /**
     * Actualiza el stock de un producto
     */
    async updateStock(id: string, quantity: number): Promise<Product> {
        const product = await this.findById(id);
        const newStock = product.stock + quantity;

        if (newStock < 0) {
            throw new Error('Stock insuficiente');
        }

        return this.update(id, { stock: newStock });
    }

    /**
     * Verifica si un slug ya existe
     */
    async slugExists(slug: string, excludeId?: string): Promise<boolean> {
        const product = await prisma.product.findUnique({
            where: { slug },
        });

        if (!product) return false;
        if (excludeId && product.id === excludeId) return false;

        return true;
    }

    /**
     * Obtiene el conteo total de productos
     */
    async count(filters: ProductFilters = {}): Promise<number> {
        const where: any = {};

        if (filters.category) where.category = filters.category;
        if (filters.featured !== undefined) where.featured = filters.featured;
        if (filters.inStock) where.stock = { gt: 0 };

        return prisma.product.count({ where });
    }
}

// Exportar instancia singleton
export const productRepository = new ProductRepository();
