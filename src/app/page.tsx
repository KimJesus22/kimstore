import ProductCard from '@/components/products/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';

// Mock data for initial display
const PRODUCTS = [
  { id: '1', name: 'NVIDIA GeForce RTX 4090', price: 1599.99, category: 'GPU', image: '/placeholder.jpg' },
  { id: '2', name: 'Intel Core i9-14900K', price: 589.99, category: 'CPU', image: '/placeholder.jpg' },
  { id: '3', name: 'Samsung 990 PRO 2TB', price: 169.99, category: 'Storage', image: '/placeholder.jpg' },
  { id: '4', name: 'Corsair Dominator 32GB DDR5', price: 189.99, category: 'RAM', image: '/placeholder.jpg' },
  { id: '5', name: 'ASUS ROG Maximus Z790', price: 699.99, category: 'Motherboard', image: '/placeholder.jpg' },
  { id: '6', name: 'Lian Li O11 Dynamic Evo', price: 159.99, category: 'Case', image: '/placeholder.jpg' },
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
          {PRODUCTS.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
