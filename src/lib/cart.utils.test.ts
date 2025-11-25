import { calculateTotals, validateStock } from './cart.utils';
import { CartItem } from '@/types/cart.types';

describe('cart.utils', () => {
    describe('calculateTotals', () => {
        it('calculates totals correctly for multiple items', () => {
            const items = [
                {
                    id: '1',
                    quantity: 2,
                    product: { price: 100 },
                },
                {
                    id: '2',
                    quantity: 1,
                    product: { price: 50 },
                },
            ] as CartItem[];

            const totals = calculateTotals(items);

            expect(totals.subtotal).toBe(250);
            expect(totals.tax).toBe(40); // 16% of 250
            expect(totals.shipping).toBe(100); // Subtotal < 1000
            expect(totals.total).toBe(390); // 250 + 40 + 100
        });

        it('returns 0 for empty cart', () => {
            const totals = calculateTotals([]);
            expect(totals.total).toBe(0);
        });
    });

    describe('validateStock', () => {
        it('returns valid when stock is sufficient', () => {
            const result = validateStock(10, 0, 5);
            expect(result.valid).toBe(true);
        });

        it('returns invalid when requesting more than available', () => {
            const result = validateStock(5, 0, 6);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Solo quedan 5 unidades');
        });
    });
});
