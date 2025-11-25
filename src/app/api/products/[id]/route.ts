import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { productUpdateSchema } from '@/schemas/product.schema';
import { successResponse, errorResponse, ErrorResponses } from '@/lib/api-response';
import { handleError, NotFoundError } from '@/lib/api-error';

/**
 * GET /api/products/[id]
 * Obtiene un producto por ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await productService.getProductById(params.id);
    return successResponse(product);
  } catch (error) {
    console.error(`Error en GET /api/products/${params.id}:`, error);

    const apiError = handleError(error);
    return errorResponse(apiError.message, apiError.statusCode, apiError.code);
  }
}

/**
 * PUT /api/products/[id]
 * Actualiza un producto existente (requiere autenticación admin)
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // TODO: Verificar autenticación y rol de admin
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return ErrorResponses.forbidden('Solo administradores pueden actualizar productos');
    // }

    const body = await request.json();

    // Validar datos
    const validatedData = productUpdateSchema.parse(body);

    // Actualizar producto
    const product = await productService.updateProduct(params.id, validatedData);

    return successResponse(product);
  } catch (error) {
    console.error(`Error en PUT /api/products/${params.id}:`, error);

    if (error instanceof Error && error.name === 'ZodError') {
      return ErrorResponses.validationError((error as any).errors);
    }

    if (error instanceof Error && error.message === 'El slug ya está en uso') {
      return ErrorResponses.conflict(error.message);
    }

    const apiError = handleError(error);
    return errorResponse(apiError.message, apiError.statusCode, apiError.code);
  }
}

/**
 * DELETE /api/products/[id]
 * Elimina un producto (requiere autenticación admin)
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // TODO: Verificar autenticación y rol de admin
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return ErrorResponses.forbidden('Solo administradores pueden eliminar productos');
    // }

    await productService.deleteProduct(params.id);

    return successResponse({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(`Error en DELETE /api/products/${params.id}:`, error);

    const apiError = handleError(error);
    return errorResponse(apiError.message, apiError.statusCode, apiError.code);
  }
}
