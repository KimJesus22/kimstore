import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          PC<span className={styles.logoHighlight}>Store</span>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            Inicio
          </Link>
          <Link href="/productos" className={styles.navLink}>
            Productos
          </Link>
          <Link href="/carrito" className={styles.cartBtn}>
            Carrito (0)
          </Link>
        </div>
      </div>
    </nav>
  );
}
