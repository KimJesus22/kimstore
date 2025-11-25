/**
 * Clase base para errores de API
 */
export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error 404 - Recurso no encontrado
 */
export class NotFoundError extends ApiError {
    constructor(resource: string = 'Recurso') {
        super(`${resource} no encontrado`, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

/**
 * Error 400 - Solicitud inválida
 */
export class BadRequestError extends ApiError {
    constructor(message: string = 'Solicitud inválida', details?: any) {
        super(message, 400, 'BAD_REQUEST', details);
        this.name = 'BadRequestError';
    }
}

/**
 * Error 401 - No autorizado
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string = 'No autorizado') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

/**
 * Error 403 - Acceso denegado
 */
export class ForbiddenError extends ApiError {
    constructor(message: string = 'Acceso denegado') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}

/**
 * Error 409 - Conflicto
 */
export class ConflictError extends ApiError {
    constructor(message: string = 'El recurso ya existe') {
        super(message, 409, 'CONFLICT');
        this.name = 'ConflictError';
    }
}

/**
 * Error 422 - Validación fallida
 */
export class ValidationError extends ApiError {
    constructor(details: any) {
        super('Error de validación', 422, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

/**
 * Maneja errores y los convierte en ApiError
 */
export function handleError(error: unknown): ApiError {
    // Si ya es un ApiError, retornarlo
    if (error instanceof ApiError) {
        return error;
    }

    // Si es un error de Prisma
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;

        switch (prismaError.code) {
            case 'P2002':
                return new ConflictError('El registro ya existe (campo único duplicado)');
            case 'P2025':
                return new NotFoundError('Registro');
            case 'P2003':
                return new BadRequestError('Violación de clave foránea');
            default:
                return new ApiError('Error de base de datos', 500, prismaError.code);
        }
    }

    // Si es un Error estándar
    if (error instanceof Error) {
        return new ApiError(error.message, 500);
    }

    // Error desconocido
    return new ApiError('Error desconocido', 500);
}

/**
 * Verifica si un error es de tipo ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}
