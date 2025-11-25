// Tipos base de productos basados en Prisma
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    image: string;
    stock: number;
    featured: boolean;
    slug: string;
    brand?: string | null;
    specs?: ProductSpecs | null;
    createdAt: Date;
    updatedAt: Date;
}

// Categorías de productos
export type ProductCategory =
    | 'GPU'
    | 'CPU'
    | 'RAM'
    | 'Storage'
    | 'Motherboard'
    | 'Case'
    | 'PSU'
    | 'Cooling';

// Especificaciones técnicas (JSON)
export interface ProductSpecs {
    [key: string]: string | number | boolean;
}

// Versión simplificada para listados
export interface ProductListItem {
    id: string;
    name: string;
    price: number;
    category: ProductCategory;
    image: string;
    stock: number;
    featured: boolean;
    slug: string;
    brand?: string | null;
}

// Input para crear producto
export interface ProductCreateInput {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    image: string;
    stock?: number;
    featured?: boolean;
    slug: string;
    brand?: string;
    specs?: ProductSpecs;
}

// Input para actualizar producto (todos los campos opcionales)
export interface ProductUpdateInput {
    name?: string;
    description?: string;
    price?: number;
    category?: ProductCategory;
    image?: string;
    stock?: number;
    featured?: boolean;
    slug?: string;
    brand?: string;
    specs?: ProductSpecs;
}

// Filtros para búsqueda
export interface ProductFilters {
    category?: ProductCategory;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    brand?: string;
}

// Opciones de paginación
export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
    sortOrder?: 'asc' | 'desc';
}

// Respuesta paginada
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Respuesta de API estándar
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    meta?: any;
}
