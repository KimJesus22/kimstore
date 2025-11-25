import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Producto no encontrado</h2>
                <p className={styles.description}>
                    Lo sentimos, el producto que buscas no existe o ha sido eliminado.
                </p>
                <Link href="/productos" className={styles.link}>
                    Ver todos los productos
                </Link>
            </div>
        </div>
    );
}
