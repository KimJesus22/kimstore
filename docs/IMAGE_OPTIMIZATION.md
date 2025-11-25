# Guía de Optimización de Imágenes con next/image

Esta guía explica cómo usar correctamente el componente `next/image` de Next.js para obtener el máximo rendimiento.

## ¿Por qué usar next/image?

El componente `Image` de Next.js proporciona:
- ✅ Optimización automática de imágenes
- ✅ Lazy loading por defecto
- ✅ Prevención de Layout Shift (CLS)
- ✅ Formatos modernos (AVIF, WebP)
- ✅ Tamaños responsivos automáticos
- ✅ Placeholder blur

## Uso Básico

### Importar el Componente

```tsx
import Image from 'next/image';
```

### Imagen con Dimensiones Fijas

```tsx
<Image
  src="/logo.png"
  alt="Logo de KimStore"
  width={200}
  height={50}
  priority // Para imágenes above-the-fold
/>
```

### Imagen con Fill (Contenedor Relativo)

```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    sizes="100vw"
    className="object-cover"
    priority
  />
</div>
```

## Atributo `sizes` (Crítico para Rendimiento)

El atributo `sizes` le dice al navegador qué tamaño de imagen cargar según el viewport.

### Sintaxis

```tsx
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

**Significado:**
- En móvil (≤640px): imagen ocupa 100% del viewport
- En tablet (≤1024px): imagen ocupa 50% del viewport
- En desktop (>1024px): imagen ocupa 33% del viewport

### Ejemplos por Caso de Uso

#### 1. ProductCard (Grid de 3 columnas)

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className={styles.productImage}
/>
```

**Explicación:**
- Móvil: 1 columna → 100vw
- Tablet: 2 columnas → 50vw
- Desktop: 3 columnas → 33vw

#### 2. Página de Producto (2 columnas)

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>
```

**Explicación:**
- Móvil: Imagen full width → 100vw
- Desktop: 2 columnas → 50vw

#### 3. Thumbnail en Carrito (Tamaño Fijo)

```tsx
<Image
  src={item.image}
  alt={item.name}
  fill
  sizes="96px"
/>
```

**Explicación:**
- Siempre 96px (tamaño del contenedor)

#### 4. Hero Image (Full Width)

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="100vw"
  priority
/>
```

**Explicación:**
- Siempre ocupa 100% del viewport

## Atributo `priority`

Usa `priority` para imágenes críticas que aparecen above-the-fold (primera pantalla).

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="100vw"
  priority // Carga inmediata, no lazy
/>
```

**Cuándo usar:**
- ✅ Hero images
- ✅ Logo principal
- ✅ Primera imagen de producto
- ✅ Primeros 3 productos en grid
- ❌ Imágenes below-the-fold

## Placeholder Blur

Muestra una versión borrosa mientras carga la imagen real.

### Opción 1: Data URL (Recomendado)

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

### Opción 2: Imagen Estática

```tsx
import heroImage from '/public/hero.jpg';

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur" // Automático con import
/>
```

## Calidad de Imagen

Controla la calidad de compresión (1-100):

```tsx
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  quality={85} // Default: 75
/>
```

**Recomendaciones:**
- Hero images: 85-90
- Product images: 75-80
- Thumbnails: 60-70

## Formatos de Imagen

Next.js automáticamente sirve el mejor formato:

1. **AVIF** (si el navegador lo soporta)
   - ~50% más pequeño que JPEG
   - Chrome 85+, Firefox 93+, Safari 16+

2. **WebP** (fallback)
   - ~30% más pequeño que JPEG
   - Chrome 23+, Firefox 65+, Safari 14+

3. **JPEG/PNG** (fallback final)
   - Todos los navegadores

## Object Fit

Controla cómo se ajusta la imagen al contenedor:

```tsx
<Image
  src="/product.jpg"
  alt="Product"
  fill
  className="object-cover" // Cubre todo el contenedor
/>
```

**Opciones:**
- `object-cover`: Cubre todo, puede recortar
- `object-contain`: Contiene toda la imagen, puede dejar espacio
- `object-fill`: Estira para llenar
- `object-none`: Tamaño original
- `object-scale-down`: Escala hacia abajo si es necesario

## Loading States

### Lazy Loading (Default)

```tsx
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  loading="lazy" // Default, no es necesario especificar
/>
```

### Eager Loading

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  loading="eager" // Carga inmediata
  priority // Equivalente
/>
```

## Ejemplos Completos

### ProductCard Component

```tsx
export default function ProductCard({ product, priority = false }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.productImage}
          priority={priority}
          placeholder="blur"
          blurDataURL={product.blurDataURL || defaultBlurDataURL}
        />
      </div>
      {/* ... resto del componente */}
    </div>
  );
}
```

### Product Detail Page

```tsx
<div className={styles.imageSection}>
  <div className={styles.imageContainer}>
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className={styles.productImage}
      priority
      quality={85}
    />
  </div>
</div>
```

### Cart Item Thumbnail

```tsx
<div className="w-24 h-24 relative">
  <Image
    src={item.product.image}
    alt={item.product.name}
    fill
    sizes="96px"
    className="object-cover"
  />
</div>
```

## Mejores Prácticas

### 1. Siempre Especifica `alt`

```tsx
// ✅ Correcto
<Image src="/product.jpg" alt="NVIDIA RTX 4090 Graphics Card" />

// ❌ Incorrecto
<Image src="/product.jpg" alt="" />
```

### 2. Usa `sizes` con `fill`

```tsx
// ✅ Correcto
<Image src="/hero.jpg" fill sizes="100vw" />

// ❌ Incorrecto (usará tamaño máximo)
<Image src="/hero.jpg" fill />
```

### 3. Prioriza Imágenes Críticas

```tsx
// ✅ Correcto - Hero image
<Image src="/hero.jpg" fill priority />

// ❌ Incorrecto - Imagen en footer
<Image src="/footer-logo.jpg" width={100} height={50} priority />
```

### 4. Contenedor con `position: relative` para `fill`

```tsx
// ✅ Correcto
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image src="/hero.jpg" fill />
</div>

// ❌ Incorrecto (imagen no se mostrará)
<div>
  <Image src="/hero.jpg" fill />
</div>
```

### 5. Usa Placeholder para Mejor UX

```tsx
// ✅ Correcto
<Image
  src="/product.jpg"
  fill
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// ⚠️ Aceptable pero menos UX
<Image src="/product.jpg" fill />
```

## Debugging

### Ver Tamaño Servido

Inspecciona el HTML generado:

```html
<img
  srcset="
    /_next/image?url=/product.jpg&w=640&q=75 640w,
    /_next/image?url=/product.jpg&w=750&q=75 750w,
    /_next/image?url=/product.jpg&w=828&q=75 828w
  "
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

### Verificar Formato

En DevTools Network:
- Busca `/_next/image`
- Verifica Content-Type: `image/avif` o `image/webp`

## Métricas de Rendimiento

### Antes de Optimización

```
- Formato: JPEG
- Tamaño: 500KB
- LCP: 3.5s
- CLS: 0.15
```

### Después de Optimización

```
- Formato: AVIF
- Tamaño: 100KB
- LCP: 1.2s
- CLS: 0
```

**Mejora: ~80% reducción de tamaño, ~65% mejora en LCP**

## Recursos

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Image Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**Última actualización:** Noviembre 2025
