import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product.types';
import { formatPrice } from '@/lib/cart.utils';

describe('ProductCard', () => {
    const mockProduct: Product = {
        id: '1',
        name: 'Gaming PC',
        description: 'Powerful gaming PC',
        price: 1200,
        category: 'computers',
        image: 'https://example.com/pc.jpg',
        stock: 5,
        featured: true,
        slug: 'gaming-pc',
        brand: 'TechBrand',
        specs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Gaming PC')).toBeInTheDocument();
        expect(screen.getByText(formatPrice(1200))).toBeInTheDocument();
        expect(screen.getByText('TechBrand')).toBeInTheDocument();
    });

    it('renders "Sin Stock" when stock is 0', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 };
        render(<ProductCard product={outOfStockProduct} />);

        expect(screen.getByText('Sin Stock')).toBeInTheDocument();
    });
});
