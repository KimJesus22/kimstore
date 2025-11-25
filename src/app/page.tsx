import ProductCard from '@/components/products/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';
import { productService } from '@/services/product.service';
import { Metadata } from 'next';

// Configurar ISR: Revalidar cada 60 segundos
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'KimStore - Componentes de PC de Alto Rendimiento',
  description:
    'Construye la PC de tus sueños con los mejores componentes del mercado. GPU, CPU, RAM, almacenamiento y más.',
  openGraph: {
    title: 'KimStore - Componentes de PC de Alto Rendimiento',
    description:
      'Construye la PC de tus sueños con los mejores componentes del mercado.',
  },
};

export default async function Home() {
  // Obtener productos destacados de la base de datos
  const featuredProducts = await productService.getFeaturedProducts(3);

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
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>
      </section>
    </main>
  );
}
