import { cartRepository } from '@/repositories/cart.repository';
import { productRepository } from '@/repositories/product.repository';
import type { Cart, CartWithTotals } from '@/types/cart.types';
import { calculateTotals, validateStock, mergeCarts } from '@/lib/cart.utils';
import { BadRequestError } from '@/lib/api-error';

/**
 * Servicio de carrito - Lógica de negocio
 */
export class CartService {
    /**
     * Obtiene el carrito de un usuario con totales calculados
     */
    async getCart(userId?: string): Promise<CartWithTotals> {
        let cart: Cart;

        if (userId) {
            cart = await cartRepository.findOrCreateByUserId(userId);
        } else {
            // Para usuarios no autenticados, retornar carrito vacío
            cart = {
                id: 'temp',
                userId: null,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        const totals = calculateTotals(cart.items);

        return { cart, totals };
    }

    /**
     * Añade un producto al carrito
     */
    async addToCart(
        productId: string,
        quantity: number,
        userId?: string
    ): Promise<CartWithTotals> {
        // Validar que el producto existe y tiene stock
        const product = await productRepository.findById(productId);

        if (!userId) {
            throw new BadRequestError('Se requiere autenticación para añadir al carrito');
        }

        // Obtener o crear carrito
        const cart = await cartRepository.findOrCreateByUserId(userId);

        // Verificar stock disponible
        const currentItem = cart.items.find(item => item.productId === productId);
        const currentQuantity = currentItem?.quantity || 0;

        const stockValidation = validateStock(product.stock, currentQuantity, quantity);

        if (!stockValidation.valid) {
            throw new BadRequestError(stockValidation.message || 'Stock insuficiente');
        }

        // Añadir item al carrito
        await cartRepository.addItem(cart.id, productId, quantity);

        // Retornar carrito actualizado
        return this.getCart(userId);
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    async updateQuantity(
        productId: string,
        quantity: number,
        userId?: string
    ): Promise<CartWithTotals> {
        if (!userId) {
            throw new BadRequestError('Se requiere autenticación');
        }

        const cart = await cartRepository.findOrCreateByUserId(userId);

        // Si la cantidad es 0, eliminar el item
        if (quantity === 0) {
            await cartRepository.removeItem(cart.id, productId);
            return this.getCart(userId);
        }

        // Validar stock
        const product = await productRepository.findById(productId);
        const stockValidation = validateStock(product.stock, 0, quantity);

        if (!stockValidation.valid) {
            throw new BadRequestError(stockValidation.message || 'Stock insuficiente');
        }

        // Actualizar cantidad
        await cartRepository.updateItemQuantity(cart.id, productId, quantity);

        return this.getCart(userId);
    }

    /**
     * Elimina un producto del carrito
     */
    async removeFromCart(productId: string, userId?: string): Promise<CartWithTotals> {
        if (!userId) {
            throw new BadRequestError('Se requiere autenticación');
        }

        const cart = await cartRepository.findOrCreateByUserId(userId);
        await cartRepository.removeItem(cart.id, productId);

        return this.getCart(userId);
    }

    /**
     * Limpia el carrito completo
     */
    async clearCart(userId?: string): Promise<CartWithTotals> {
        if (!userId) {
            throw new BadRequestError('Se requiere autenticación');
        }

        const cart = await cartRepository.findOrCreateByUserId(userId);
        await cartRepository.clearItems(cart.id);

        return this.getCart(userId);
    }

    /**
     * Sincroniza el carrito local con el carrito del usuario (al hacer login)
     */
    async syncCart(
        localItems: Array<{ productId: string; quantity: number }>,
        userId: string
    ): Promise<CartWithTotals> {
        // Obtener carrito del servidor
        const serverCart = await cartRepository.findOrCreateByUserId(userId);

        // Crear carrito temporal con items locales
        const localCart: Cart = {
            id: 'temp',
            userId: null,
            items: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Cargar productos para los items locales
        for (const localItem of localItems) {
            try {
                const product = await productRepository.findById(localItem.productId);
                localCart.items.push({
                    id: 'temp',
                    cartId: 'temp',
                    productId: localItem.productId,
                    product,
                    quantity: localItem.quantity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            } catch (error) {
                // Ignorar productos que ya no existen
                console.warn(`Product ${localItem.productId} not found, skipping`);
            }
        }

        // Fusionar carritos
        const mergedItems = mergeCarts(localCart, serverCart);

        // Preparar items para sincronización
        const itemsToSync = mergedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
        }));

        // Sincronizar en la base de datos
        await cartRepository.syncItems(serverCart.id, itemsToSync);

        // Retornar carrito actualizado
        return this.getCart(userId);
    }

    /**
     * Valida el stock de todos los items del carrito
     */
    async validateCartStock(userId: string): Promise<{
        valid: boolean;
        issues: Array<{ productId: string; productName: string; available: number; requested: number }>;
    }> {
        const cart = await cartRepository.findOrCreateByUserId(userId);
        const issues: Array<{ productId: string; productName: string; available: number; requested: number }> = [];

        for (const item of cart.items) {
            const product = await productRepository.findById(item.productId);

            if (item.quantity > product.stock) {
                issues.push({
                    productId: item.productId,
                    productName: item.product.name,
                    available: product.stock,
                    requested: item.quantity,
                });
            }
        }

        return {
            valid: issues.length === 0,
            issues,
        };
    }
}

// Exportar instancia singleton
export const cartService = new CartService();
