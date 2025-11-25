import prisma from '@/lib/prisma';
import type { Cart, CartItem } from '@/types/cart.types';
import { NotFoundError } from '@/lib/api-error';

/**
 * Repositorio de carrito - Capa de acceso a datos con Prisma
 */
export class CartRepository {
  /**
   * Obtiene el carrito de un usuario (o crea uno nuevo)
   */
  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart as Cart;
  }

  /**
   * Obtiene un carrito por ID
   */
  async findById(cartId: string): Promise<Cart> {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundError('Carrito');
    }

    return cart as Cart;
  }

  /**
   * Añade un item al carrito (o actualiza si ya existe)
   */
  async addItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    // Verificar si el item ya existe
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Actualizar cantidad
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
      return updated as CartItem;
    }

    // Crear nuevo item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: { product: true },
    });

    return newItem as CartItem;
  }

  /**
   * Actualiza la cantidad de un item
   */
  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Item del carrito');
    }

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      include: { product: true },
    });

    return updated as CartItem;
  }

  /**
   * Elimina un item del carrito
   */
  async removeItem(cartId: string, productId: string): Promise<void> {
    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Item del carrito');
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });
  }

  /**
   * Limpia todos los items del carrito
   */
  async clearItems(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  /**
   * Obtiene todos los items del carrito con productos
   */
  async getItems(cartId: string): Promise<CartItem[]> {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      include: { product: true },
    });

    return items as CartItem[];
  }

  /**
   * Sincroniza items del carrito (útil para merge)
   */
  async syncItems(
    cartId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<Cart> {
    // Limpiar items existentes
    await this.clearItems(cartId);

    // Añadir nuevos items
    await prisma.cartItem.createMany({
      data: items.map((item) => ({
        cartId,
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    // Retornar carrito actualizado
    return this.findById(cartId);
  }

  /**
   * Elimina un carrito completo
   */
  async delete(cartId: string): Promise<void> {
    await prisma.cart.delete({
      where: { id: cartId },
    });
  }
}

// Exportar instancia singleton
export const cartRepository = new CartRepository();
