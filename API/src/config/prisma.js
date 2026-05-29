import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__workHubPrismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__workHubPrismaClient = prisma;
}

export default prisma;
