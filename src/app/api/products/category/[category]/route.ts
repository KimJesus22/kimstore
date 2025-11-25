import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { paginationSchema } from '@/schemas/product.schema';
import { paginatedResponse, errorResponse, ErrorResponses } from '@/lib/api-response';
import { handleError } from '@/lib/api-error';

/**
 * GET /api/products/category/[category]
 * Obtiene productos por categoría con paginación
 */
export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  try {
    const { searchParams } = new URL(request.url);

    // Parsear paginación
    const pagination = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    // Validar paginación
    const validatedPagination = paginationSchema.parse(pagination);

    // Obtener productos por categoría
    const result = await productService.getProductsByCategory(params.category, validatedPagination);

    return paginatedResponse(result.products, result.page, result.limit, result.total);
  } catch (error: any) {
    console.error(`Error en GET /api/products/category/${params.category}:`, error);

    if (error.name === 'ZodError') {
      return ErrorResponses.validationError(error.errors);
    }

    const apiError = handleError(error);
    return errorResponse(apiError.message, apiError.statusCode, apiError.code);
  }
}
