import ProductCard from '@/components/products/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';

// Mock data for initial display
const PRODUCTS = [
  {
    id: '1',
    name: 'NVIDIA GeForce RTX 4090',
    price: 1599.99,
    category: 'GPU',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
  },
  {
    id: '2',
    name: 'Intel Core i9-14900K',
    price: 589.99,
    category: 'CPU',
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80'
  },
  {
    id: '3',
    name: 'Samsung 990 PRO 2TB',
    price: 169.99,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80'
  },
  {
    id: '4',
    name: 'Corsair Dominator 32GB DDR5',
    price: 189.99,
    category: 'RAM',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80'
  },
  {
    id: '5',
    name: 'ASUS ROG Maximus Z790',
    price: 699.99,
    category: 'Motherboard',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
  },
  {
    id: '6',
    name: 'Lian Li O11 Dynamic Evo',
    price: 159.99,
    category: 'Case',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Productos Destacados</h2>
          <Link href="/productos" className="btn btn-outline">Ver Todo</Link>
        </div>
        <div className={styles.grid}>
          {PRODUCTS.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
