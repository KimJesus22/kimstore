import ProductGrid from '@/components/products/ProductGrid';
import styles from '../page.module.css';
import { Product } from '@/types/product.types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NVIDIA GeForce RTX 4090',
    description: 'Tarjeta gráfica de alto rendimiento',
    price: 1599.99,
    category: 'GPU',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    stock: 10,
    featured: true,
    slug: 'nvidia-rtx-4090',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Intel Core i9-14900K',
    description: 'Procesador de última generación',
    price: 589.99,
    category: 'CPU',
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',
    stock: 15,
    featured: true,
    slug: 'intel-i9-14900k',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Samsung 990 PRO 2TB',
    description: 'SSD NVMe de alta velocidad',
    price: 169.99,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    stock: 20,
    featured: true,
    slug: 'samsung-990-pro-2tb',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProductsPage() {
  return (
    <main className={styles.main}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 className={styles.sectionTitle}>Catálogo Completo</h1>
        <ProductGrid products={PRODUCTS} />
      </div>
    </main>
  );
}
