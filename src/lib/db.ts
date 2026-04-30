import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Disable query logging in production to prevent sensitive data exposure
const logLevel = process.env.NODE_ENV === 'production' ? ([] as const) : (['query'] as const)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevel as any, // Type assertion needed for dynamic log levels
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db