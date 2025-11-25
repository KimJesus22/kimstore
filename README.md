# KimStore - Tienda de Componentes de PC

**KimStore** es una aplicación de comercio electrónico (e-commerce) full-stack diseñada para la venta de componentes de hardware de alto rendimiento. Este proyecto sirve como una demostración técnica de una tienda online moderna, con funcionalidades como catálogo de productos, carrito de compras y gestión de usuarios.

## 🚀 Funcionalidades Principales

- **Catálogo de Productos**: Navegación intuitiva por categorías (GPU, CPU, RAM, etc.) con filtrado y búsqueda.
- **Carrito de Compras**: Gestión de estado para añadir, eliminar y modificar cantidades de productos.
- **Diseño Premium**: Interfaz de usuario moderna, minimalista y responsiva, construida con un sistema de diseño personalizado.
- **Gestión de Usuarios**: (En desarrollo) Registro, inicio de sesión y gestión de perfiles.
- **Panel de Administración**: (En desarrollo) ABM (Alta, Baja, Modificación) de productos y gestión de inventario.

## 🛠️ Stack Técnico

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router) para renderizado híbrido (SSR/CSR).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para tipado estático y robustez.
- **Estilos**: Vanilla CSS con **CSS Modules** y variables CSS nativas (sin frameworks de terceros como Tailwind, para control total).
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) como base de datos relacional.
- **ORM**: [Prisma](https://www.prisma.io/) para el modelado de datos y consultas type-safe.
- **Control de Versiones**: Git y GitHub.

## 🏗️ Decisiones de Arquitectura

El proyecto utiliza la arquitectura de **Next.js App Router**, lo que permite:

- **Server Components**: La mayoría de los componentes se renderizan en el servidor para mejor rendimiento y SEO.
- **Client Components**: Uso selectivo de `'use client'` solo para interactividad (botones, formularios).
- **Estructura Modular**: Componentes reutilizables ubicados en `src/components` y páginas en `src/app`.
- **Singleton Pattern**: Para la instancia de Prisma Client (`lib/prisma.ts`) evitando múltiples conexiones en desarrollo.

## ☁️ Despliegue en Producción

La forma más recomendada de desplegar esta aplicación es utilizando **Vercel**:

1. Sube tu código a un repositorio de GitHub.
2. Crea una cuenta en [Vercel](https://vercel.com) e importa tu repositorio.
3. Configura las **Variables de Entorno** en el panel de Vercel:
   - `DATABASE_URL`: Tu cadena de conexión a PostgreSQL (puedes usar Vercel Postgres, Neon, o Supabase).
4. Haz clic en **Deploy**.

Alternativamente, puedes construir la aplicación para producción localmente:

```bash
npm run build
npm start
```

## 🏁 Empezando (Desarrollo Local)

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto, por favor:

1. Lee nuestra [Guía de Contribución](CONTRIBUTING.md)
2. Revisa los [issues abiertos](../../issues)
3. Crea un fork del repositorio
4. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
5. Haz commit de tus cambios siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
6. Push a la rama (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request

Para más detalles sobre el proceso de contribución, estándares de código, y cómo ejecutar tests, consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
