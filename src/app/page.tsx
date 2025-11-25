import ProductCard from '@/components/products/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';

// Mock data for initial display
const PRODUCTS = [
  {
    id: '1',
    name: 'NVIDIA GeForce RTX 4090',
    description: 'Tarjeta gráfica de alto rendimiento',
    price: 1599.99,
    category: 'GPU' as const,
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
    category: 'CPU' as const,
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
    category: 'Storage' as const,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    stock: 20,
    featured: true,
    slug: 'samsung-990-pro-2tb',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Corsair Dominator 32GB DDR5',
    description: 'Memoria RAM de alto rendimiento',
    price: 189.99,
    category: 'RAM' as const,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
    stock: 25,
    featured: false,
    slug: 'corsair-dominator-32gb',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'ASUS ROG Maximus Z790',
    description: 'Placa base para gaming',
    price: 699.99,
    category: 'Motherboard' as const,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    stock: 8,
    featured: false,
    slug: 'asus-rog-maximus-z790',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Lian Li O11 Dynamic Evo',
    description: 'Gabinete premium para PC',
    price: 159.99,
    category: 'Case' as const,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    stock: 12,
    featured: false,
    slug: 'lian-li-o11-dynamic',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Componentes de <span className={styles.highlight}>Alto Rendimiento</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Construye la PC de tus sueños con los mejores componentes del mercado.
          </p>
        </div>
      </section>

      <section className={`container ${styles.productSection}`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
            Productos Destacados
          </h2>
          <Link href="/productos" className="btn btn-outline">
            Ver Todo
          </Link>
        </div>
        <div className={styles.grid}>
          {PRODUCTS.slice(0, 3).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>
      </section>
    </main>
  );
}
