import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // Use the production schema file
  prisma =
    global.prisma ||
    new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
} else {
  // Use the development schema and ensure only one instance is used in development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: "file:./dev.sqlite" } },
    });
  }
  prisma = global.prisma;
}

export default prisma;
