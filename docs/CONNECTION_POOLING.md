# Connection Pooling con Prisma

Esta guía explica cómo está configurado el connection pooling en la aplicación para optimizar el manejo de conexiones a PostgreSQL.

## ¿Qué es Connection Pooling?

Connection pooling es una técnica que mantiene un grupo (pool) de conexiones abiertas a la base de datos que pueden ser reutilizadas, en lugar de crear y cerrar conexiones para cada query.

### Beneficios

- ✅ **Rendimiento**: Reutilizar conexiones es mucho más rápido que crear nuevas
- ✅ **Escalabilidad**: Limita el número de conexiones simultáneas
- ✅ **Recursos**: Reduce carga en el servidor de BD
- ✅ **Estabilidad**: Evita agotar el límite de conexiones de PostgreSQL

### Sin Connection Pooling

```
Request 1 → Nueva conexión → Query → Cerrar conexión
Request 2 → Nueva conexión → Query → Cerrar conexión
Request 3 → Nueva conexión → Query → Cerrar conexión
```

**Problema:** Crear conexión toma ~50-100ms

### Con Connection Pooling

```
Request 1 → Tomar del pool → Query → Devolver al pool
Request 2 → Tomar del pool → Query → Devolver al pool
Request 3 → Tomar del pool → Query → Devolver al pool
```

**Beneficio:** Tomar del pool toma ~1ms

## Configuración Implementada

### Prisma Client

#### [src/lib/prisma.ts](file:///c:/Users/gomez/Documents/tienda%20componentes%20pc/pc-store/src/lib/prisma.ts)

```typescript
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};
```

**Características:**
- ✅ Singleton pattern (una sola instancia)
- ✅ Logging en desarrollo
- ✅ Configuración de datasource
- ✅ Graceful shutdown

### Variables de Entorno

#### DATABASE_URL con Parámetros de Pool

```env
# Desarrollo
DATABASE_URL="postgresql://user:password@localhost:5432/kimstore?connection_limit=10&pool_timeout=20"

# Producción (Vercel/Serverless)
DATABASE_URL="postgresql://user:password@host:5432/kimstore?connection_limit=5&pool_timeout=20&pgbouncer=true"

# Producción (Servidor Dedicado)
DATABASE_URL="postgresql://user:password@host:5432/kimstore?connection_limit=50&pool_timeout=10"
```

### Parámetros de Connection Pool

#### connection_limit

**Descripción:** Número máximo de conexiones en el pool

**Valores recomendados:**

| Entorno | connection_limit | Razón |
|---------|------------------|-------|
| Desarrollo | 10 | Suficiente para desarrollo local |
| Serverless (Vercel) | 5 | Límite por función lambda |
| Servidor pequeño | 20 | Balance entre rendimiento y recursos |
| Servidor grande | 50-100 | Más conexiones para alta carga |

**Fórmula:** `num_cpus * 2 + 1`

**Default de Prisma:** Calculado automáticamente

#### pool_timeout

**Descripción:** Tiempo máximo de espera (en segundos) para obtener una conexión del pool

**Valores recomendados:**

| Entorno | pool_timeout | Razón |
|---------|--------------|-------|
| Desarrollo | 20 | Tiempo generoso para debugging |
| Producción | 10 | Balance entre espera y error rápido |
| Alta carga | 5 | Fallar rápido si no hay conexiones |

**Default de Prisma:** 10 segundos

#### pgbouncer

**Descripción:** Habilita modo compatible con PgBouncer (connection pooler externo)

**Cuándo usar:**
- ✅ Usando PgBouncer
- ✅ Plataformas como Supabase, Neon
- ❌ PostgreSQL directo

```env
DATABASE_URL="postgresql://...?pgbouncer=true"
```

## Configuración por Entorno

### Desarrollo Local

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kimstore?connection_limit=10&pool_timeout=20"
```

**Configuración:**
- connection_limit: 10
- pool_timeout: 20s
- Logging: query, error, warn

### Vercel (Serverless)

```env
DATABASE_URL="postgresql://user:password@host:5432/kimstore?connection_limit=5&pool_timeout=20&pgbouncer=true"
```

**Configuración:**
- connection_limit: 5 (por función)
- pool_timeout: 20s
- pgbouncer: true (si usas Supabase/Neon)
- Logging: solo error

**Importante:** Cada función serverless tiene su propio pool

### Servidor Dedicado

```env
DATABASE_URL="postgresql://user:password@host:5432/kimstore?connection_limit=50&pool_timeout=10"
```

**Configuración:**
- connection_limit: 50
- pool_timeout: 10s
- Logging: solo error

## Singleton Pattern

### Implementación

```typescript
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
```

**Beneficios:**
- ✅ Una sola instancia de PrismaClient
- ✅ Evita múltiples pools en desarrollo (hot-reload)
- ✅ Reutiliza conexiones eficientemente

### Sin Singleton (Problema)

```typescript
// ❌ Incorrecto - crea nueva instancia cada vez
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

**Problema en Next.js:**
- Hot-reload crea nuevas instancias
- Múltiples pools de conexiones
- Agota límite de conexiones de PostgreSQL

### Con Singleton (Correcto)

```typescript
// ✅ Correcto - reutiliza instancia
import prisma from '@/lib/prisma';
```

## Graceful Shutdown

### Implementación

```typescript
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
```

**Beneficios:**
- ✅ Cierra conexiones correctamente
- ✅ Evita conexiones huérfanas
- ✅ Limpia recursos al terminar

**Cuándo se ejecuta:**
- SIGINT: Ctrl+C en terminal
- SIGTERM: Kill del proceso

## Logging

### Configuración

```typescript
log: process.env.NODE_ENV === 'development' 
  ? ['query', 'error', 'warn'] 
  : ['error']
```

### Niveles de Log

**Desarrollo:**
- `query`: Todas las queries SQL
- `error`: Errores de BD
- `warn`: Advertencias

**Producción:**
- `error`: Solo errores

### Ejemplo de Output

```
prisma:query SELECT * FROM "Product" WHERE "category" = $1
prisma:query Parameters: ["GPU"]
prisma:query Duration: 5ms
```

## Límites de PostgreSQL

### Conexiones Máximas

PostgreSQL tiene un límite de conexiones simultáneas:

```sql
-- Ver límite actual
SHOW max_connections;
-- Default: 100

-- Ver conexiones activas
SELECT count(*) FROM pg_stat_activity;
```

### Cálculo de Límites

**Ejemplo con 100 conexiones max:**
- Sistema: 10 conexiones
- Disponibles: 90 conexiones
- Aplicaciones: 90 / número de apps

**Con 3 instancias de la app:**
- Por instancia: 90 / 3 = 30 conexiones
- connection_limit: 25 (dejar margen)

## Monitoreo

### Ver Conexiones Activas

```sql
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query
FROM pg_stat_activity
WHERE datname = 'kimstore';
```

### Ver Conexiones por Estado

```sql
SELECT
    state,
    count(*)
FROM pg_stat_activity
WHERE datname = 'kimstore'
GROUP BY state;
```

### Matar Conexión Huérfana

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid = 12345;
```

## Troubleshooting

### Error: "Too many connections"

**Problema:** Agotaste el límite de conexiones de PostgreSQL

**Soluciones:**
1. Reducir `connection_limit` en DATABASE_URL
2. Aumentar `max_connections` en PostgreSQL
3. Usar PgBouncer

```sql
-- Aumentar límite (requiere reinicio)
ALTER SYSTEM SET max_connections = 200;
```

### Error: "Connection pool timeout"

**Problema:** No hay conexiones disponibles en el pool

**Soluciones:**
1. Aumentar `pool_timeout`
2. Aumentar `connection_limit`
3. Optimizar queries lentas
4. Verificar conexiones huérfanas

### Conexiones Huérfanas

**Problema:** Conexiones que no se cerraron correctamente

**Solución:**
```typescript
// Siempre usar try/finally
try {
  const result = await prisma.product.findMany();
  return result;
} finally {
  // Prisma maneja esto automáticamente
  // No necesitas $disconnect() en cada query
}
```

## PgBouncer (Opcional)

### ¿Qué es PgBouncer?

Connection pooler externo que se sitúa entre la aplicación y PostgreSQL.

### Beneficios

- ✅ Pool compartido entre múltiples apps
- ✅ Mejor para serverless
- ✅ Reduce carga en PostgreSQL

### Configuración

```env
# URL de PgBouncer
DATABASE_URL="postgresql://user:password@pgbouncer-host:6432/kimstore?pgbouncer=true"
```

### Limitaciones

- ❌ No soporta prepared statements
- ❌ No soporta transacciones interactivas
- ⚠️ Requiere `pgbouncer=true` en Prisma

## Mejores Prácticas

### 1. Usar Singleton

```typescript
// ✅ Correcto
import prisma from '@/lib/prisma';

// ❌ Incorrecto
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

### 2. No Cerrar Conexiones Manualmente

```typescript
// ✅ Correcto - Prisma maneja el pool
const products = await prisma.product.findMany();

// ❌ Incorrecto - rompe el pool
await prisma.$disconnect();
```

### 3. Configurar Límites Apropiados

```env
# ✅ Correcto - según entorno
# Serverless
connection_limit=5

# Servidor dedicado
connection_limit=50
```

### 4. Monitorear Conexiones

```sql
-- Verificar regularmente
SELECT count(*) FROM pg_stat_activity;
```

## Resumen

✅ **Implementado:**
- Singleton pattern para PrismaClient
- Connection pooling configurado
- Graceful shutdown
- Logging por entorno
- Documentación completa

📊 **Configuración:**
- Desarrollo: 10 conexiones, 20s timeout
- Serverless: 5 conexiones, 20s timeout
- Servidor: 50 conexiones, 10s timeout

🚀 **Beneficios:**
- Queries 50-100x más rápidas (reutilizar vs crear)
- Mejor uso de recursos
- Mayor estabilidad
- Escalabilidad mejorada

---

**Última actualización:** Noviembre 2025
