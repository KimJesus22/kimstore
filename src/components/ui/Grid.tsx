import React from 'react';
import styles from './Grid.module.css';

type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Grid({ children, className }: GridProps) {
  return <div className={`${styles.grid} ${className || ''}`.trim()}>{children}</div>;
}
