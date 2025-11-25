import type { Cart, CartItem, CartTotals, LocalStorageCart } from '@/types/cart.types';

const CART_STORAGE_KEY = 'kimstore_cart';
const TAX_RATE = 0.16; // IVA 16%
const FREE_SHIPPING_THRESHOLD = 1000; // Envío gratis si subtotal > $1000
const SHIPPING_COST = 100;

/**
 * Calcula el subtotal del carrito
 */
export function calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);
}

/**
 * Calcula el impuesto (IVA)
 */
export function calculateTax(subtotal: number): number {
    return subtotal * TAX_RATE;
}

/**
 * Calcula el costo de envío
 */
export function calculateShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

/**
 * Calcula todos los totales del carrito
 */
export function calculateTotals(items: CartItem[]): CartTotals {
    const subtotal = calculateSubtotal(items);
    const tax = calculateTax(subtotal);
    const discount = 0; // TODO: Implementar cupones
    const shipping = calculateShipping(subtotal);
    const total = subtotal + tax - discount + shipping;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number(total.toFixed(2)),
        itemCount,
    };
}

/**
 * Valida si hay stock suficiente para un producto
 */
export function validateStock(
    productStock: number,
    currentQuantityInCart: number,
    quantityToAdd: number
): { valid: boolean; available: number; message?: string } {
    const totalQuantity = currentQuantityInCart + quantityToAdd;

    if (totalQuantity > productStock) {
        return {
            valid: false,
            available: productStock - currentQuantityInCart,
            message: `Solo quedan ${productStock} unidades disponibles. Ya tienes ${currentQuantityInCart} en el carrito.`,
        };
    }

    return { valid: true, available: productStock };
}

/**
 * Fusiona dos carritos (útil al hacer login)
 */
export function mergeCarts(localCart: Cart, serverCart: Cart): CartItem[] {
    const mergedItems = new Map<string, CartItem>();

    // Añadir items del servidor
    serverCart.items.forEach(item => {
        mergedItems.set(item.productId, item);
    });

    // Fusionar items locales
    localCart.items.forEach(localItem => {
        const existing = mergedItems.get(localItem.productId);

        if (existing) {
            // Sumar cantidades si el producto ya existe
            mergedItems.set(localItem.productId, {
                ...existing,
                quantity: existing.quantity + localItem.quantity,
            });
        } else {
            // Añadir nuevo item
            mergedItems.set(localItem.productId, localItem);
        }
    });

    return Array.from(mergedItems.values());
}

/**
 * Guarda el carrito en localStorage
 */
export function saveToLocalStorage(cart: Cart): void {
    if (typeof window === 'undefined') return;

    const localCart: LocalStorageCart = {
        items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            addedAt: item.createdAt.toISOString(),
        })),
        lastUpdated: new Date().toISOString(),
    };

    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localCart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

/**
 * Carga el carrito desde localStorage
 */
export function loadFromLocalStorage(): LocalStorageCart | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        return parsed as LocalStorageCart;
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return null;
    }
}

/**
 * Limpia el carrito de localStorage
 */
export function clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing cart from localStorage:', error);
    }
}

/**
 * Formatea un precio en formato de moneda
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(price);
}

/**
 * Verifica si el carrito está vacío
 */
export function isCartEmpty(cart: Cart | null): boolean {
    return !cart || cart.items.length === 0;
}

/**
 * Obtiene la cantidad total de items en el carrito
 */
export function getItemCount(cart: Cart | null): number {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Busca un item específico en el carrito
 */
export function findCartItem(cart: Cart, productId: string): CartItem | undefined {
    return cart.items.find(item => item.productId === productId);
}
