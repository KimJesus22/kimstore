import ProductGrid from '@/components/products/ProductGrid';
import styles from '../page.module.css';
import { productRepository } from '@/repositories/product.repository';
import { Metadata } from 'next';

// Configurar ISR: Revalidar cada 30 segundos
export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Catálogo de Productos | KimStore',
  description:
    'Explora nuestro catálogo completo de componentes de PC de alto rendimiento. GPU, CPU, RAM, almacenamiento y más.',
  openGraph: {
    title: 'Catálogo de Productos | KimStore',
    description:
      'Explora nuestro catálogo completo de componentes de PC de alto rendimiento.',
  },
};

export default async function ProductsPage() {
  // Obtener productos de la base de datos
  const { products } = await productRepository.findAll(
    {},
    { limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }
  );

  return (
    <main className={styles.main}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 className={styles.sectionTitle}>Catálogo Completo</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          Descubre nuestra selección de componentes de PC de alta calidad
        </p>
        <ProductGrid products={products as any} />
      </div>
    </main>
  );
}
