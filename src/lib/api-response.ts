import { NextResponse } from 'next/server';
import type { ApiResponse, PaginatedResponse } from '@/types/product.types';

/**
 * Crea una respuesta exitosa estándar
 */
export function successResponse<T>(
    data: T,
    meta?: any,
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(meta && { meta }),
        },
        { status }
    );
}

/**
 * Crea una respuesta de error estándar
 */
export function errorResponse(
    message: string,
    status: number = 500,
    code?: string,
    details?: any
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                ...(code && { code }),
                ...(details && { details }),
            },
        },
        { status }
    );
}

/**
 * Crea una respuesta paginada
 */
export function paginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
): NextResponse<ApiResponse<T[]>> {
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
        success: true,
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    });
}

/**
 * Respuestas de error comunes
 */
export const ErrorResponses = {
    notFound: (resource: string = 'Recurso') =>
        errorResponse(`${resource} no encontrado`, 404, 'NOT_FOUND'),

    badRequest: (message: string = 'Solicitud inválida') =>
        errorResponse(message, 400, 'BAD_REQUEST'),

    unauthorized: (message: string = 'No autorizado') =>
        errorResponse(message, 401, 'UNAUTHORIZED'),

    forbidden: (message: string = 'Acceso denegado') =>
        errorResponse(message, 403, 'FORBIDDEN'),

    conflict: (message: string = 'Conflicto') =>
        errorResponse(message, 409, 'CONFLICT'),

    validationError: (details: any) =>
        errorResponse('Error de validación', 400, 'VALIDATION_ERROR', details),

    serverError: (message: string = 'Error interno del servidor') =>
        errorResponse(message, 500, 'INTERNAL_ERROR'),
};
