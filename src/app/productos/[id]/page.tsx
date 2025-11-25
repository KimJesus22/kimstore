import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import { productRepository } from '@/repositories/product.repository';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/cart.utils';
import styles from './page.module.css';

// Configurar ISR: Revalidar cada 60 segundos
export const revalidate = 60;

// Configurar generación dinámica con fallback
export const dynamicParams = true;

/**
 * Genera parámetros estáticos para los productos más populares
 * Solo pre-genera los top 50 productos en build time
 */
export async function generateStaticParams() {
  try {
    // Obtener productos destacados y algunos adicionales
    const featuredProducts = await productRepository.findFeatured(20);
    const additionalProducts = await productRepository.findAll({}, { limit: 30 });

    // Combinar y eliminar duplicados
    const allProducts = [...featuredProducts, ...additionalProducts.products];
    const uniqueProducts = Array.from(
      new Map(allProducts.map((p) => [p.id, p])).values()
    );

    return uniqueProducts.slice(0, 50).map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Genera metadata dinámica para SEO
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const product = await productService.getProductById(params.id);

    return {
      title: `${product.name} | KimStore`,
      description: product.description || `Compra ${product.name} al mejor precio`,
      openGraph: {
        title: product.name,
        description: product.description || `Compra ${product.name} al mejor precio`,
        images: [product.image],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description || `Compra ${product.name} al mejor precio`,
        images: [product.image],
      },
    };
  } catch (error) {
    return {
      title: 'Producto no encontrado | KimStore',
      description: 'El producto que buscas no está disponible',
    };
  }
}

/**
 * Página de detalle de producto con ISR
 */
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await productService.getProductById(params.id);

    return (
      <main className={styles.main}>
        <div className={`container ${styles.container}`}>
          <div className={styles.productDetail}>
            {/* Imagen del producto */}
            <div className={styles.imageSection}>
              <div className={styles.imageContainer}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.productImage}
                  priority
                />
              </div>
            </div>

            {/* Información del producto */}
            <div className={styles.infoSection}>
              <div className={styles.breadcrumb}>
                <span>Inicio</span>
                <span> / </span>
                <span>Productos</span>
                <span> / </span>
                <span>{product.category}</span>
              </div>

              <h1 className={styles.title}>{product.name}</h1>

              {product.brand && (
                <p className={styles.brand}>Marca: {product.brand}</p>
              )}

              <div className={styles.priceSection}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                {product.stock > 0 ? (
                  <span className={styles.stock}>
                    {product.stock} disponibles
                  </span>
                ) : (
                  <span className={styles.outOfStock}>Sin stock</span>
                )}
              </div>

              <p className={styles.description}>{product.description}</p>

              {/* Especificaciones */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className={styles.specs}>
                  <h2 className={styles.specsTitle}>Especificaciones</h2>
                  <dl className={styles.specsList}>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className={styles.specItem}>
                        <dt className={styles.specKey}>{key}</dt>
                        <dd className={styles.specValue}>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Acciones */}
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                </Button>
              </div>

              {/* Información adicional */}
              <div className={styles.additionalInfo}>
                <p>
                  <strong>Categoría:</strong> {product.category}
                </p>
                {product.featured && (
                  <p className={styles.featured}>⭐ Producto Destacado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // Si el producto no existe, mostrar 404
    notFound();
  }
}
