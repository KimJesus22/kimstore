import { PrismaClient } from '@prisma/client';

/**
 * Configuración de Connection Pooling para Prisma
 * 
 * Connection pooling optimiza el uso de conexiones a la base de datos,
 * reutilizando conexiones existentes en lugar de crear nuevas para cada query.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// En desarrollo, mantener la instancia en global para evitar múltiples conexiones
// durante hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Configuración de Connection Pool en DATABASE_URL:
 * 
 * Agregar parámetros a la URL de conexión:
 * postgresql://user:password@localhost:5432/db?connection_limit=10&pool_timeout=20
 * 
 * Parámetros recomendados:
 * - connection_limit: Número máximo de conexiones (default: num_cpus * 2 + 1)
 * - pool_timeout: Tiempo de espera para obtener conexión en segundos (default: 10)
 * 
 * Para Next.js en Vercel:
 * - connection_limit=5 (por función serverless)
 * - pool_timeout=20
 * 
 * Para servidor dedicado:
 * - connection_limit=20-50 (según carga)
 * - pool_timeout=10
 */

/**
 * Graceful shutdown - cerrar conexiones al terminar
 */
if (typeof window === 'undefined') {
  // Solo en servidor
  const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
