import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const adapter = PrismaAdapter(prisma)

export async function createAdminUser() {
  await adapter.createUser({ name: "admin", email: "admin@admin.de", password: "admin", role: "ADMIN" })
}
