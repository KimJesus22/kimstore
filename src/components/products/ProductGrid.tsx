import React from 'react';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';
import { Product } from '@/types/product.types';

interface ProductGridProps {
  products: Product[];
  /**
   * Número de productos a cargar con prioridad (above-the-fold)
   * Default: 6 (2 filas en desktop de 3 columnas)
   */
  priorityCount?: number;
}

export default function ProductGrid({ products, priorityCount = 6 }: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
          loading={index < priorityCount ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}
