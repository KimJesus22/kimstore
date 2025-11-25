import type { Product } from './product.types';

// Item individual del carrito
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Carrito completo
export interface Cart {
  id: string;
  userId?: string | null;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Totales calculados del carrito
export interface CartTotals {
  subtotal: number; // Suma de (precio × cantidad)
  tax: number; // IVA 16%
  discount: number; // Descuentos aplicados
  shipping: number; // Costo de envío
  total: number; // subtotal + tax - discount + shipping
  itemCount: number; // Total de items (suma de cantidades)
}

// Input para añadir producto al carrito
export interface AddToCartInput {
  productId: string;
  quantity: number;
}

// Input para actualizar cantidad
export interface UpdateCartItemInput {
  productId: string;
  quantity: number;
}

// Item del carrito en localStorage (versión simplificada)
export interface LocalStorageCartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

// Carrito en localStorage
export interface LocalStorageCart {
  items: LocalStorageCartItem[];
  lastUpdated: string;
}

// Respuesta del carrito con totales
export interface CartWithTotals {
  cart: Cart;
  totals: CartTotals;
}

// Estado del carrito en el contexto
export interface CartState {
  cart: Cart | null;
  totals: CartTotals;
  isLoading: boolean;
  error: string | null;
}

// Acciones del carrito
export type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };
