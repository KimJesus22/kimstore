import { z } from 'zod';

// Schema para categorías
export const productCategorySchema = z.enum([
    'GPU',
    'CPU',
    'RAM',
    'Storage',
    'Motherboard',
    'Case',
    'PSU',
    'Cooling',
]);

// Schema para especificaciones (JSON flexible)
export const productSpecsSchema = z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
).optional();

// Schema para crear producto
export const productCreateSchema = z.object({
    name: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(200, 'El nombre no puede exceder 200 caracteres'),

    description: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(2000, 'La descripción no puede exceder 2000 caracteres'),

    price: z.number()
        .positive('El precio debe ser mayor a 0')
        .max(999999, 'El precio es demasiado alto'),

    category: productCategorySchema,

    image: z.string()
        .url('Debe ser una URL válida'),

    stock: z.number()
        .int('El stock debe ser un número entero')
        .nonnegative('El stock no puede ser negativo')
        .default(0),

    featured: z.boolean()
        .default(false),

    slug: z.string()
        .min(3, 'El slug debe tener al menos 3 caracteres')
        .max(200, 'El slug no puede exceder 200 caracteres')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser lowercase con guiones'),

    brand: z.string()
        .min(2, 'La marca debe tener al menos 2 caracteres')
        .max(100, 'La marca no puede exceder 100 caracteres')
        .optional(),

    specs: productSpecsSchema,
});

// Schema para actualizar producto (todos los campos opcionales)
export const productUpdateSchema = z.object({
    name: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(200, 'El nombre no puede exceder 200 caracteres')
        .optional(),

    description: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(2000, 'La descripción no puede exceder 2000 caracteres')
        .optional(),

    price: z.number()
        .positive('El precio debe ser mayor a 0')
        .max(999999, 'El precio es demasiado alto')
        .optional(),

    category: productCategorySchema.optional(),

    image: z.string()
        .url('Debe ser una URL válida')
        .optional(),

    stock: z.number()
        .int('El stock debe ser un número entero')
        .nonnegative('El stock no puede ser negativo')
        .optional(),

    featured: z.boolean().optional(),

    slug: z.string()
        .min(3, 'El slug debe tener al menos 3 caracteres')
        .max(200, 'El slug no puede exceder 200 caracteres')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser lowercase con guiones')
        .optional(),

    brand: z.string()
        .min(2, 'La marca debe tener al menos 2 caracteres')
        .max(100, 'La marca no puede exceder 100 caracteres')
        .optional(),

    specs: productSpecsSchema,
});

// Schema para filtros de búsqueda
export const productFiltersSchema = z.object({
    category: productCategorySchema.optional(),
    featured: z.boolean().optional(),
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().positive().optional(),
    inStock: z.boolean().optional(),
    search: z.string().min(1).max(100).optional(),
    brand: z.string().min(1).max(100).optional(),
});

// Schema para paginación
export const paginationSchema = z.object({
    page: z.number()
        .int()
        .positive()
        .default(1),

    limit: z.number()
        .int()
        .positive()
        .max(100, 'El límite máximo es 100')
        .default(12),

    sortBy: z.enum(['name', 'price', 'createdAt', 'stock'])
        .default('createdAt'),

    sortOrder: z.enum(['asc', 'desc'])
        .default('desc'),
});

// Tipos inferidos de los schemas
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type PaginationOptions = z.infer<typeof paginationSchema>;
