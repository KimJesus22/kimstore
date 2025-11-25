import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { productCreateSchema, productFiltersSchema, paginationSchema } from '@/schemas/product.schema';
import { successResponse, errorResponse, paginatedResponse, ErrorResponses } from '@/lib/api-response';
import { handleError } from '@/lib/api-error';

/**
 * GET /api/products
 * Obtiene lista de productos con filtros y paginación
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parsear filtros
        const filters = {
            category: searchParams.get('category') || undefined,
            featured: searchParams.get('featured') === 'true' ? true : undefined,
            minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
            maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
            inStock: searchParams.get('inStock') === 'true' ? true : undefined,
            search: searchParams.get('search') || undefined,
            brand: searchParams.get('brand') || undefined,
        };

        // Parsear paginación
        const pagination = {
            page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
            sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
            sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
        };

        // Validar filtros y paginación
        const validatedFilters = productFiltersSchema.parse(filters);
        const validatedPagination = paginationSchema.parse(pagination);

        // Obtener productos
        const result = await productService.getProducts(validatedFilters, validatedPagination);

        return paginatedResponse(
            result.products,
            result.page,
            result.limit,
            result.total
        );
    } catch (error: any) {
        console.error('Error en GET /api/products:', error);

        if (error.name === 'ZodError') {
            return ErrorResponses.validationError(error.errors);
        }

        const apiError = handleError(error);
        return errorResponse(apiError.message, apiError.statusCode, apiError.code);
    }
}

/**
 * POST /api/products
 * Crea un nuevo producto (requiere autenticación admin)
 */
export async function POST(request: NextRequest) {
    try {
        // TODO: Verificar autenticación y rol de admin
        // const session = await getServerSession();
        // if (!session || session.user.role !== 'admin') {
        //   return ErrorResponses.forbidden('Solo administradores pueden crear productos');
        // }

        const body = await request.json();

        // Validar datos
        const validatedData = productCreateSchema.parse(body);

        // Crear producto
        const product = await productService.createProduct(validatedData);

        return successResponse(product, undefined, 201);
    } catch (error: any) {
        console.error('Error en POST /api/products:', error);

        if (error.name === 'ZodError') {
            return ErrorResponses.validationError(error.errors);
        }

        if (error.message === 'El slug ya está en uso') {
            return ErrorResponses.conflict(error.message);
        }

        const apiError = handleError(error);
        return errorResponse(apiError.message, apiError.statusCode, apiError.code);
    }
}
