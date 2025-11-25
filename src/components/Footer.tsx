import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.section}>
          <h3 className={styles.title}>KimStore</h3>
          <p className={styles.text}>
            Tu destino número uno para componentes de PC de alto rendimiento.
          </p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.subtitle}>Enlaces</h4>
          <ul className={styles.list}>
            <li>
              <a href="/productos">Productos</a>
            </li>
            <li>
              <a href="/carrito">Carrito</a>
            </li>
            <li>
              <a href="/perfil">Mi Cuenta</a>
            </li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4 className={styles.subtitle}>Contacto</h4>
          <p className={styles.text}>soporte@kimstore.com</p>
          <p className={styles.text}>+1 234 567 890</p>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} KimStore. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
