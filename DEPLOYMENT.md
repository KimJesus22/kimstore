# Guía de Despliegue en Vercel

Esta guía detalla los pasos para desplegar la aplicación **PC Store** en [Vercel](https://vercel.com), la plataforma recomendada para Next.js.

## Prerrequisitos

1.  Cuenta en [Vercel](https://vercel.com/signup).
2.  Cuenta en [GitHub](https://github.com), [GitLab](https://gitlab.com) o [Bitbucket](https://bitbucket.org).
3.  Base de datos PostgreSQL en la nube (ej. Vercel Postgres, Neon, Supabase, Railway).

## Configuración de Base de Datos (Producción)

Para producción, necesitas una instancia de PostgreSQL accesible desde internet.

### Opción A: Vercel Postgres (Recomendado)
1.  En tu dashboard de Vercel, ve a la pestaña "Storage".
2.  Crea una nueva base de datos "Postgres".
3.  Vincula la base de datos a tu proyecto de Vercel.
4.  Vercel añadirá automáticamente las variables de entorno necesarias (`POSTGRES_URL`, etc.).
5.  **Nota**: Deberás actualizar tu `schema.prisma` o tu configuración para usar estas variables si difieren del estándar `DATABASE_URL`. Vercel suele proveer `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING`.

### Opción B: Proveedor Externo (Neon, Supabase, etc.)
1.  Crea una base de datos en tu proveedor.
2.  Obtén la "Connection String" (URL de conexión).

## Variables de Entorno

En el dashboard de tu proyecto en Vercel, ve a **Settings > Environment Variables** y añade las siguientes:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a tu BD PostgreSQL | `postgres://user:pass@host:5432/db` |
| `NEXT_PUBLIC_APP_URL` | URL de tu despliegue en Vercel | `https://tu-proyecto.vercel.app` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (Live) | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe (Live) | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secreto del Webhook de Stripe (Live) | `whsec_...` |

> [!IMPORTANT]
> Asegúrate de usar las claves de **producción** (Live) de Stripe, no las de prueba (Test), cuando estés listo para recibir pagos reales.

## Configuración del Build

Vercel detecta automáticamente que es un proyecto Next.js. La configuración por defecto suele funcionar:

- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Migraciones de Base de Datos
Para aplicar las migraciones de Prisma en producción, tienes dos opciones:

1.  **En el Build Command (Más fácil)**:
    Cambia el "Build Command" en Vercel a:
    ```bash
    npx prisma migrate deploy && next build
    ```
    Esto asegura que la base de datos esté sincronizada antes de construir la app.

2.  **Manualmente**:
    Puedes ejecutar `npx prisma migrate deploy` desde tu máquina local apuntando a la BD de producción (cambiando temporalmente el `.env`) o usar un script de post-install.

## Webhooks de Stripe en Producción

1.  Ve a tu Dashboard de Stripe > Developers > Webhooks.
2.  Añade un endpoint apuntando a tu URL de producción: `https://tu-proyecto.vercel.app/api/webhooks/stripe`.
3.  Selecciona los eventos a escuchar (ej. `checkout.session.completed`).
4.  Obtén el "Signing secret" (`whsec_...`) y añádelo a las variables de entorno de Vercel como `STRIPE_WEBHOOK_SECRET`.

## Verificación Post-Despliegue

1.  Visita la URL de tu proyecto.
2.  Navega por los productos (esto verifica la conexión a la BD).
3.  Prueba el flujo de carrito y checkout (esto verifica la integración con Stripe).
