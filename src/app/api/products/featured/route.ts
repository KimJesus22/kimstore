import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleError } from '@/lib/api-error';

/**
 * GET /api/products/featured
 * Obtiene productos destacados
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 6;

        // Validar límite
        if (limit < 1 || limit > 50) {
            return errorResponse('El límite debe estar entre 1 y 50', 400);
        }

        const products = await productService.getFeaturedProducts(limit);

        return successResponse(products);
    } catch (error) {
        console.error('Error en GET /api/products/featured:', error);

        const apiError = handleError(error);
        return errorResponse(apiError.message, apiError.statusCode, apiError.code);
    }
}
