import { z } from 'zod';

// Schema para añadir al carrito
export const addToCartSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),

  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0')
    .max(100, 'La cantidad máxima es 100'),
});

// Schema para actualizar cantidad
export const updateCartItemSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),

  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .nonnegative('La cantidad no puede ser negativa')
    .max(100, 'La cantidad máxima es 100'),
});

// Schema para item del carrito
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  addedAt: z.string().datetime().optional(),
});

// Schema para carrito en localStorage
export const localStorageCartSchema = z.object({
  items: z.array(cartItemSchema),
  lastUpdated: z.string().datetime(),
});

// Schema para sincronizar carrito
export const syncCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
});

// Tipos inferidos
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type LocalStorageCartData = z.infer<typeof localStorageCartSchema>;
export type SyncCartInput = z.infer<typeof syncCartSchema>;
