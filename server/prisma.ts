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

/**
 * Asserts that PostgreSQL / Supabase connection is active.
 * Throws an error with status 503 if unreachable.
 */
export async function assertDatabaseConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    const error: any = new Error(
      `PostgreSQL database is currently unreachable: ${err?.message || 'Connection failed'}`
    );
    error.status = 503;
    error.code = 'DB_UNAVAILABLE';
    throw error;
  }
}

/**
 * Performs a lightweight health check against PostgreSQL / Supabase
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true, latencyMs: Date.now() - start };
  } catch (err: any) {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: err?.message || 'PostgreSQL connection failed'
    };
  }
}

/**
 * Express middleware to enforce strict PostgreSQL availability for stateful endpoints.
 * Rejects requests with HTTP 503 instead of creating diverging local state.
 */
export const requireDatabaseConnection = async (
  _req: any,
  res: any,
  next: any
) => {
  try {
    await assertDatabaseConnection();
    next();
  } catch (err: any) {
    return res.status(503).json({
      success: false,
      error: 'Database Unavailable',
      message:
        'PostgreSQL persistence is required but currently unreachable. Action halted to prevent data divergence.',
      code: 'DB_UNAVAILABLE'
    });
  }
};

export default prisma;
