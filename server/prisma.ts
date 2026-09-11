import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * NIHOMI.COM — High-Performance Singleton Prisma Database Client
 * Uses connection pooling with @prisma/adapter-pg for PostgreSQL / Supabase
 * Prevents hot-reload connection leaks across development and serverless invocations.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/nihomi_db?schema=public';

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}

/**
 * Detects whether an error is a database connection timeout or pool failure.
 */
export function isPrismaConnectionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as Record<string, any>;

  // Check Prisma error codes
  // P1001: Can't reach database server
  // P1002: The database server was reached but timed out
  // P1008: Operations timed out
  // P1017: Server has closed the connection
  if (err.code && ['P1001', 'P1002', 'P1008', 'P1017'].includes(err.code)) {
    return true;
  }

  const message = String(err.message || '').toLowerCase();
  return (
    message.includes('timeout') ||
    message.includes('connection refused') ||
    message.includes('terminating connection') ||
    message.includes('closed the connection') ||
    message.includes('etimedout') ||
    message.includes('econnrefused') ||
    message.includes('econnreset')
  );
}

export default prisma;
