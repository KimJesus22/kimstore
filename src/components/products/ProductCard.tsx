import Link from 'next/link';
import styles from './ProductCard.module.css';
import Button from '../ui/Button';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {/* Placeholder for image, in real app use next/image */}
                <div className={styles.placeholderImage}>{product.category}</div>
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    <Button variant="secondary" size="sm">Añadir</Button>
                </div>
            </div>
        </div>
    );
}
